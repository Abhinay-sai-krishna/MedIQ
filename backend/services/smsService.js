/**
 * SMS Service using Twilio
 * Handles sending SMS alerts for critical patient conditions and hospital overload
 */

import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Twilio client (will be null if credentials are missing)
let twilioClient = null;

// Check if Twilio credentials are available
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  try {
    twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    console.log('✅ Twilio SMS service initialized');
  } catch (error) {
    console.warn('⚠️  Twilio initialization failed:', error.message);
  }
} else {
  console.warn('⚠️  Twilio credentials not found. SMS alerts will be disabled.');
  console.warn('   Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in .env');
}

const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || '';

/**
 * Send SMS alert to a phone number
 * @param {string} toPhoneNumber - Recipient phone number (E.164 format: +1234567890)
 * @param {string} message - SMS message content
 * @returns {Promise<Object>} Twilio message response or error
 */
export async function sendSMS(toPhoneNumber, message) {
  // Validate Twilio is configured
  if (!twilioClient || !TWILIO_PHONE_NUMBER) {
    console.warn('⚠️  SMS not sent: Twilio not configured');
    return {
      success: false,
      error: 'Twilio not configured',
      message: 'SMS service is not available. Check environment variables.'
    };
  }

  // Validate phone number format (basic check)
  if (!toPhoneNumber || !toPhoneNumber.startsWith('+')) {
    console.warn(`⚠️  Invalid phone number format: ${toPhoneNumber}`);
    return {
      success: false,
      error: 'Invalid phone number',
      message: 'Phone number must be in E.164 format (e.g., +1234567890)'
    };
  }

  try {
    const result = await twilioClient.messages.create({
      body: message,
      from: TWILIO_PHONE_NUMBER,
      to: toPhoneNumber
    });

    console.log(`✅ SMS sent successfully to ${toPhoneNumber} (SID: ${result.sid})`);
    
    return {
      success: true,
      sid: result.sid,
      status: result.status,
      to: toPhoneNumber
    };
  } catch (error) {
    // Log error but don't throw - system should continue working
    console.error(`❌ SMS sending failed to ${toPhoneNumber}:`, error.message);
    
    return {
      success: false,
      error: error.message,
      code: error.code,
      to: toPhoneNumber
    };
  }
}

/**
 * Send critical patient alert SMS
 * @param {string} toPhoneNumber - Recipient phone number
 * @param {Object} alertData - Alert information
 * @param {string} alertData.patientId - Patient ID
 * @param {Object} alertData.vitals - Patient vital signs
 * @param {number} alertData.riskScore - Risk score (0-100)
 * @param {string} alertData.riskLevel - Risk level (low/medium/high/critical)
 * @param {Array<string>} alertData.reasons - Array of risk reasons
 * @param {string} alertData.ward - Ward name
 * @param {number} alertData.wardOccupancy - Ward occupancy percentage
 * @returns {Promise<Object>} SMS send result
 */
export async function sendPatientAlertSMS(toPhoneNumber, alertData) {
  const {
    patientId,
    vitals,
    riskScore,
    riskLevel,
    reasons = [],
    ward = 'Unknown',
    wardOccupancy = 0
  } = alertData;

  // Build concise SMS message (under 160 chars for trial accounts)
  let message = `🚨 ALERT: ${patientId} ${riskLevel.toUpperCase()} RISK\n`;

  // Add only critical vitals
  if (vitals) {
    const criticalVitals = [];
    if (vitals.oxygenSaturation !== undefined && vitals.oxygenSaturation < 90) {
      criticalVitals.push(`SpO2:${vitals.oxygenSaturation}%`);
    }
    if (vitals.heartRate !== undefined && (vitals.heartRate > 120 || vitals.heartRate < 50)) {
      criticalVitals.push(`HR:${vitals.heartRate}`);
    }
    if (criticalVitals.length > 0) {
      message += criticalVitals.join(' ') + '\n';
    }
  }

  // Add top risk reason only
  if (reasons.length > 0) {
    const topReason = reasons[0].replace('Critical: ', '').replace('High ', '').substring(0, 50);
    message += topReason + '\n';
  }

  // Add location and score
  message += `${ward} | Risk:${riskScore}/100`;
  
  if (wardOccupancy > 90) {
    message += ` | Ward:${wardOccupancy}%`;
  }

  return await sendSMS(toPhoneNumber, message);
}

/**
 * Send ward overload alert SMS
 * @param {string} toPhoneNumber - Recipient phone number
 * @param {Object} wardData - Ward information
 * @param {string} wardData.wardName - Ward name
 * @param {number} wardData.occupancyPercent - Occupancy percentage (0-100)
 * @param {number} wardData.totalBeds - Total beds
 * @param {number} wardData.occupiedBeds - Occupied beds
 * @returns {Promise<Object>} SMS send result
 */
export async function sendWardOverloadSMS(toPhoneNumber, wardData) {
  const {
    wardName,
    occupancyPercent,
    totalBeds,
    occupiedBeds
  } = wardData;

  // Concise ward overload message (under 160 chars)
  const message = `🚨 WARD OVERLOAD: ${wardName}\n` +
    `Occupancy: ${occupancyPercent}% (${occupiedBeds}/${totalBeds} beds)\n` +
    `Action: Transfer or add staff`;

  return await sendSMS(toPhoneNumber, message);
}

/**
 * Send bulk SMS to multiple recipients
 * @param {Array<string>} phoneNumbers - Array of phone numbers
 * @param {string} message - SMS message
 * @returns {Promise<Array>} Array of send results
 */
export async function sendBulkSMS(phoneNumbers, message) {
  if (!Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
    return [];
  }

  const results = await Promise.allSettled(
    phoneNumbers.map(phone => sendSMS(phone, message))
  );

  const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
  const failed = results.length - successful;

  console.log(`📱 Bulk SMS: ${successful} sent, ${failed} failed`);

  return results.map(r => r.status === 'fulfilled' ? r.value : { success: false, error: r.reason });
}

/**
 * Check if SMS service is available
 * @returns {boolean} True if Twilio is configured
 */
export function isSMSAvailable() {
  return twilioClient !== null && TWILIO_PHONE_NUMBER !== '';
}

export default {
  sendSMS,
  sendPatientAlertSMS,
  sendWardOverloadSMS,
  sendBulkSMS,
  isSMSAvailable
};
