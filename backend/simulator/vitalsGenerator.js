import { faker } from '@faker-js/faker';

/**
 * Vitals Generator
 * Generates realistic patient vital signs using Faker.js
 */

// Ward names for simulation
const WARDS = ['ICU', 'Ward A', 'Ward B', 'Emergency', 'Surgical'];

/**
 * Generate realistic heart rate (60-120 bpm, occasionally higher for emergencies)
 */
function generateHeartRate() {
  // 10% chance of high heart rate (emergency)
  if (Math.random() < 0.1) {
    return faker.number.int({ min: 120, max: 150 });
  }
  return faker.number.int({ min: 60, max: 100 });
}

/**
 * Generate realistic SpO₂ (95-100%, occasionally lower for emergencies)
 */
function generateSpO2() {
  // 15% chance of low SpO₂ (concerning)
  if (Math.random() < 0.15) {
    return faker.number.float({ min: 85, max: 94, fractionDigits: 1 });
  }
  return faker.number.float({ min: 95, max: 100, fractionDigits: 1 });
}

/**
 * Generate realistic blood pressure
 * Normal: 90-120/60-80
 * High: 130-160/85-100
 */
function generateBloodPressure() {
  // 20% chance of high blood pressure
  if (Math.random() < 0.2) {
    return {
      systolic: faker.number.int({ min: 130, max: 160 }),
      diastolic: faker.number.int({ min: 85, max: 100 })
    };
  }
  return {
    systolic: faker.number.int({ min: 90, max: 120 }),
    diastolic: faker.number.int({ min: 60, max: 80 })
  };
}

/**
 * Generate realistic respiratory rate (12-20 bpm, occasionally higher)
 */
function generateRespiratoryRate() {
  // 10% chance of high respiratory rate
  if (Math.random() < 0.1) {
    return faker.number.int({ min: 20, max: 28 });
  }
  return faker.number.int({ min: 12, max: 20 });
}

/**
 * Generate realistic body temperature (97-99.5°F, occasionally higher for fever)
 */
function generateTemperature() {
  // 15% chance of fever
  if (Math.random() < 0.15) {
    return faker.number.float({ min: 99.5, max: 102.5, fractionDigits: 1 });
  }
  return faker.number.float({ min: 97.0, max: 99.5, fractionDigits: 1 });
}

/**
 * Generate a random ward name
 */
function generateWard() {
  return faker.helpers.arrayElement(WARDS);
}

/**
 * Generate a unique patient ID
 */
function generatePatientId() {
  return `PAT-${faker.string.alphanumeric(8).toUpperCase()}`;
}

/**
 * Generate complete patient vitals data
 * @param {string} patientId - Optional patient ID, generates new one if not provided
 * @returns {Object} Complete vitals object
 */
export function generatePatientVitals(patientId = null) {
  const heartRate = generateHeartRate();
  const spO2 = generateSpO2();
  const bloodPressure = generateBloodPressure();
  const respiratoryRate = generateRespiratoryRate();
  const temperature = generateTemperature();
  const ward = generateWard();

  return {
    patientId: patientId || generatePatientId(),
    heartRate,
    oxygenSaturation: spO2,
    bloodPressure: `${bloodPressure.systolic}/${bloodPressure.diastolic}`,
    bloodPressureObj: bloodPressure, // Keep object format for database
    respiratoryRate,
    temperature,
    ward,
    timestamp: new Date()
  };
}

/**
 * Generate multiple patient vitals
 * @param {number} count - Number of patients to generate
 * @returns {Array} Array of patient vitals
 */
export function generateMultipleVitals(count = 5) {
  return Array.from({ length: count }, () => generatePatientVitals());
}
