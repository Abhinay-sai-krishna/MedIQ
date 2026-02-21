/**
 * Risk Calculator
 * Calculates patient risk scores based on vital signs and ward occupancy
 */

/**
 * Calculate risk score based on vital signs and ward occupancy
 * @param {Object} vitals - Patient vital signs
 * @param {number} wardOccupancy - Ward occupancy percentage (0-100)
 * @returns {Object} Risk score and reasons
 */
export function calculateRiskScore(vitals, wardOccupancy = 0) {
  let riskScore = 0;
  const reasons = [];

  // Extract blood pressure values
  const bpParts = vitals.bloodPressure?.split('/') || [];
  const systolic = parseInt(bpParts[0]) || vitals.bloodPressureObj?.systolic || 120;
  const diastolic = parseInt(bpParts[1]) || vitals.bloodPressureObj?.diastolic || 80;

  // 1. SpO₂ Risk (Low SpO₂ is critical)
  if (vitals.oxygenSaturation < 90) {
    riskScore += 40;
    reasons.push(`Critical: SpO₂ is dangerously low at ${vitals.oxygenSaturation}%`);
  } else if (vitals.oxygenSaturation < 95) {
    riskScore += 20;
    reasons.push(`Warning: SpO₂ is below normal at ${vitals.oxygenSaturation}%`);
  }

  // 2. Heart Rate Risk (High heart rate indicates stress)
  if (vitals.heartRate > 120) {
    riskScore += 25;
    reasons.push(`High heart rate detected: ${vitals.heartRate} bpm`);
  } else if (vitals.heartRate > 100) {
    riskScore += 10;
    reasons.push(`Elevated heart rate: ${vitals.heartRate} bpm`);
  } else if (vitals.heartRate < 50) {
    riskScore += 15;
    reasons.push(`Low heart rate (bradycardia): ${vitals.heartRate} bpm`);
  }

  // 3. Blood Pressure Risk
  if (systolic > 160 || diastolic > 100) {
    riskScore += 20;
    reasons.push(`High blood pressure: ${systolic}/${diastolic} mmHg`);
  } else if (systolic < 90 || diastolic < 60) {
    riskScore += 15;
    reasons.push(`Low blood pressure: ${systolic}/${diastolic} mmHg`);
  }

  // 4. Respiratory Rate Risk
  if (vitals.respiratoryRate > 24) {
    riskScore += 15;
    reasons.push(`High respiratory rate: ${vitals.respiratoryRate} bpm`);
  } else if (vitals.respiratoryRate < 12) {
    riskScore += 10;
    reasons.push(`Low respiratory rate: ${vitals.respiratoryRate} bpm`);
  }

  // 5. Temperature Risk (Fever)
  if (vitals.temperature > 101) {
    riskScore += 10;
    reasons.push(`High fever: ${vitals.temperature}°F`);
  } else if (vitals.temperature < 96) {
    riskScore += 15;
    reasons.push(`Hypothermia: ${vitals.temperature}°F`);
  }

  // 6. Ward Occupancy Risk (High occupancy = less attention per patient)
  if (wardOccupancy > 95) {
    riskScore += 15;
    reasons.push(`Critical ward occupancy: ${wardOccupancy}%`);
  } else if (wardOccupancy > 85) {
    riskScore += 5;
    reasons.push(`High ward occupancy: ${wardOccupancy}%`);
  }

  // Cap risk score at 100
  riskScore = Math.min(100, Math.max(0, riskScore));

  // Determine risk level
  let riskLevel = 'low';
  if (riskScore >= 70) {
    riskLevel = 'critical';
  } else if (riskScore >= 50) {
    riskLevel = 'high';
  } else if (riskScore >= 30) {
    riskLevel = 'medium';
  }

  return {
    riskScore: Math.round(riskScore),
    riskLevel,
    reasons: reasons.length > 0 ? reasons : ['All vitals within normal range'],
    calculatedAt: new Date()
  };
}

/**
 * Check if vitals indicate danger
 * @param {Object} vitals - Patient vital signs
 * @returns {boolean} True if vitals are dangerous
 */
export function isDangerous(vitals) {
  const bpParts = vitals.bloodPressure?.split('/') || [];
  const systolic = parseInt(bpParts[0]) || vitals.bloodPressureObj?.systolic || 120;

  return (
    vitals.oxygenSaturation < 90 ||
    vitals.heartRate > 130 ||
    vitals.heartRate < 50 ||
    systolic > 160 ||
    vitals.respiratoryRate > 24 ||
    vitals.temperature > 102 ||
    vitals.temperature < 96
  );
}
