import { faker } from '@faker-js/faker';

/**
 * Ward Occupancy Simulator
 * Simulates realistic ward and ICU occupancy levels
 */

// Ward configurations
const WARD_CONFIGS = {
  'ICU': { totalBeds: 20, minOccupancy: 60, maxOccupancy: 100 },
  'Ward A': { totalBeds: 40, minOccupancy: 40, maxOccupancy: 95 },
  'Ward B': { totalBeds: 35, minOccupancy: 35, maxOccupancy: 90 },
  'Emergency': { totalBeds: 15, minOccupancy: 50, maxOccupancy: 100 },
  'Surgical': { totalBeds: 30, minOccupancy: 30, maxOccupancy: 85 }
};

/**
 * Generate occupancy for a specific ward
 * @param {string} wardName - Name of the ward
 * @returns {Object} Occupancy data
 */
export function generateWardOccupancy(wardName) {
  const config = WARD_CONFIGS[wardName] || WARD_CONFIGS['Ward A'];
  
  // Generate occupancy percentage with some variation
  const occupancyPercent = faker.number.float({
    min: config.minOccupancy,
    max: config.maxOccupancy,
    fractionDigits: 1
  });

  const occupiedBeds = Math.round((config.totalBeds * occupancyPercent) / 100);
  const availableBeds = config.totalBeds - occupiedBeds;

  return {
    wardName,
    totalBeds: config.totalBeds,
    occupiedBeds,
    availableBeds,
    occupancyPercent: Math.round(occupancyPercent * 10) / 10,
    status: getOccupancyStatus(occupancyPercent)
  };
}

/**
 * Generate occupancy for all wards
 * @returns {Object} Occupancy data for all wards
 */
export function generateAllWardOccupancy() {
  const wards = Object.keys(WARD_CONFIGS);
  const occupancy = {};

  wards.forEach(ward => {
    occupancy[ward] = generateWardOccupancy(ward);
  });

  return occupancy;
}

/**
 * Get occupancy status based on percentage
 * @param {number} occupancyPercent - Occupancy percentage
 * @returns {string} Status (low, moderate, high, critical)
 */
function getOccupancyStatus(occupancyPercent) {
  if (occupancyPercent >= 95) {
    return 'critical';
  } else if (occupancyPercent >= 85) {
    return 'high';
  } else if (occupancyPercent >= 60) {
    return 'moderate';
  }
  return 'low';
}

/**
 * Get occupancy percentage for a specific ward
 * @param {string} wardName - Name of the ward
 * @returns {number} Occupancy percentage
 */
export function getWardOccupancyPercent(wardName) {
  const occupancy = generateWardOccupancy(wardName);
  return occupancy.occupancyPercent;
}
