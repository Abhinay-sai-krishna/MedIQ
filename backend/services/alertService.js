/**
 * Alert Service
 * Coordinates sending alerts (SMS, etc.) when critical conditions are detected
 */

import User from '../models/User.model.js';
import { sendPatientAlertSMS, sendWardOverloadSMS, isSMSAvailable } from './smsService.js';

/**
 * Get phone numbers of staff members by role
 * @param {Array<string>} roles - Array of roles to get (e.g., ['doctor', 'nurse', 'admin'])
 * @param {string} ward - Optional ward filter for nurses
 * @returns {Promise<Array<string>>} Array of phone numbers in E.164 format
 */
export async function getStaffPhoneNumbers(roles = ['doctor', 'nurse', 'admin'], ward = null) {
  try {
    const query = {
      role: { $in: roles },
      isActive: true,
      'profile.phoneNumber': { $exists: true, $ne: null, $ne: '' }
    };

    // Filter nurses by ward if specified
    if (ward && roles.includes('nurse')) {
      query['profile.ward'] = ward;
    }

    const staff = await User.find(query).select('profile.phoneNumber role firstName lastName');

    const phoneNumbers = staff
      .map(user => {
        const phone = user.profile?.phoneNumber;
        // Ensure phone number is in E.164 format (starts with +)
        if (phone && !phone.startsWith('+')) {
          // If not in E.164, try to format (basic - assumes US if no country code)
          return `+1${phone.replace(/\D/g, '')}`;
        }
        return phone;
      })
      .filter(phone => phone && phone.startsWith('+'));

    console.log(`📱 Found ${phoneNumbers.length} staff phone numbers for roles: ${roles.join(', ')}`);
    return phoneNumbers;
  } catch (error) {
    console.error('❌ Error getting staff phone numbers:', error);
    return [];
  }
}

/**
 * Send patient alert to relevant staff
 * @param {Object} alertData - Alert information
 * @param {Array<string>} targetRoles - Roles to notify (default: ['doctor', 'nurse', 'admin'])
 * @returns {Promise<Object>} Result of alert sending
 */
export async function sendPatientAlert(alertData, targetRoles = ['doctor', 'nurse', 'admin']) {
  if (!isSMSAvailable()) {
    console.warn('⚠️  SMS not available, skipping patient alert');
    return { success: false, reason: 'SMS not configured' };
  }

  try {
    const { ward } = alertData;
    
    // Get phone numbers of staff to notify
    const phoneNumbers = await getStaffPhoneNumbers(targetRoles, ward);

    if (phoneNumbers.length === 0) {
      console.warn('⚠️  No staff phone numbers found for alert');
      return { success: false, reason: 'No staff phone numbers found' };
    }

    // Send SMS to all staff
    const results = await Promise.allSettled(
      phoneNumbers.map(phone => sendPatientAlertSMS(phone, alertData))
    );

    const successful = results.filter(r => 
      r.status === 'fulfilled' && r.value.success
    ).length;

    console.log(`📱 Patient alert sent: ${successful}/${phoneNumbers.length} successful`);

    return {
      success: successful > 0,
      sent: successful,
      total: phoneNumbers.length,
      results: results.map(r => r.status === 'fulfilled' ? r.value : { success: false })
    };
  } catch (error) {
    console.error('❌ Error sending patient alert:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send ward overload alert to administrators
 * @param {Object} wardData - Ward information
 * @returns {Promise<Object>} Result of alert sending
 */
export async function sendWardOverloadAlert(wardData) {
  if (!isSMSAvailable()) {
    console.warn('⚠️  SMS not available, skipping ward overload alert');
    return { success: false, reason: 'SMS not configured' };
  }

  try {
    // Get phone numbers of administrators
    const phoneNumbers = await getStaffPhoneNumbers(['admin']);

    if (phoneNumbers.length === 0) {
      console.warn('⚠️  No admin phone numbers found for ward overload alert');
      return { success: false, reason: 'No admin phone numbers found' };
    }

    // Send SMS to all admins
    const results = await Promise.allSettled(
      phoneNumbers.map(phone => sendWardOverloadSMS(phone, wardData))
    );

    const successful = results.filter(r => 
      r.status === 'fulfilled' && r.value.success
    ).length;

    console.log(`📱 Ward overload alert sent: ${successful}/${phoneNumbers.length} successful`);

    return {
      success: successful > 0,
      sent: successful,
      total: phoneNumbers.length,
      results: results.map(r => r.status === 'fulfilled' ? r.value : { success: false })
    };
  } catch (error) {
    console.error('❌ Error sending ward overload alert:', error);
    return { success: false, error: error.message };
  }
}

export default {
  getStaffPhoneNumbers,
  sendPatientAlert,
  sendWardOverloadAlert
};
