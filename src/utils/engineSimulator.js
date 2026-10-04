// Aero-Piston Engine Telemetry Physics Simulator
// Problem Statement SIH26054 - MALE UAV Aero Piston Engine

export const DEFAULT_MISSION_PROFILES = {
  patrol: { name: 'Patrol Alpha (Standard)', altitude: 8000, ambientTemp: 15, durationHours: 6, throttle: 65 },
  recon: { name: 'High Altitude Recon', altitude: 18000, ambientTemp: -10, durationHours: 8, throttle: 80 },
  endurance: { name: 'Long Endurance Surveillance', altitude: 12000, ambientTemp: 5, durationHours: 14, throttle: 55 },
  climb: { name: 'Max Payload Climb', altitude: 22000, ambientTemp: -20, durationHours: 4, throttle: 95 },
};

export const INITIAL_TELEMETRY = {
  rpm: 4800,
  cht1: 175, // Cylinder Head Temp °C
  cht2: 178,
  cht3: 176,
  cht4: 174,
  egt1: 720, // Exhaust Gas Temp °C
  egt2: 725,
  egt3: 722,
  egt4: 719,
  oilPressure: 55, // PSI
  oilTemp: 88, // °C
  fuelFlow: 24.5, // L/hr
  vibration: 1.2, // g
  batteryVoltage: 28.2, // V
  throttle: 65, // %
  altitude: 8000, // ft
};

// Physics model expected baseline values based on throttle and altitude
export function calculatePhysicsExpected(telemetry) {
  const throttleFactor = telemetry.throttle / 100;
  const altFactor = 1 - (telemetry.altitude / 50000);
  
  const expectedRpm = Math.round(1200 + throttleFactor * 4600);
  const expectedChtAvg = Math.round((140 + throttleFactor * 55) * altFactor);
  const expectedEgtAvg = Math.round((600 + throttleFactor * 200));
  const expectedOilPressure = Math.round(40 + throttleFactor * 25);
  const expectedOilTemp = Math.round(70 + throttleFactor * 28);
  const expectedFuelFlow = parseFloat((10 + throttleFactor * 22).toFixed(1));
  const expectedVibration = parseFloat((0.8 + throttleFactor * 0.7).toFixed(2));

  return {
    expectedRpm,
    expectedChtAvg,
    expectedEgtAvg,
    expectedOilPressure,
    expectedOilTemp,
    expectedFuelFlow,
    expectedVibration,
  };
}

export function generateTelemetryStep(current, activeFault, throttle, altitude) {
  const noise = (scale) => (Math.random() - 0.5) * scale;
  
  let target = { ...current };
  target.throttle = throttle;
  target.altitude = altitude;

  // Base physics calculation
  const physics = calculatePhysicsExpected(target);
  
  // Drift towards target with minor noise
  target.rpm = Math.round(target.rpm * 0.9 + physics.expectedRpm * 0.1 + noise(15));
  
  const targetCht = physics.expectedChtAvg;
  target.cht1 = Math.round(target.cht1 * 0.95 + targetCht * 0.05 + noise(1));
  target.cht2 = Math.round(target.cht2 * 0.95 + (targetCht + 2) * 0.05 + noise(1));
  target.cht3 = Math.round(target.cht3 * 0.95 + (targetCht - 1) * 0.05 + noise(1));
  target.cht4 = Math.round(target.cht4 * 0.95 + (targetCht + 1) * 0.05 + noise(1));

  const targetEgt = physics.expectedEgtAvg;
  target.egt1 = Math.round(target.egt1 * 0.95 + targetEgt * 0.05 + noise(3));
  target.egt2 = Math.round(target.egt2 * 0.95 + (targetEgt + 5) * 0.05 + noise(3));
  target.egt3 = Math.round(target.egt3 * 0.95 + (targetEgt - 3) * 0.05 + noise(3));
  target.egt4 = Math.round(target.egt4 * 0.95 + (targetEgt + 2) * 0.05 + noise(3));

  target.oilPressure = parseFloat((target.oilPressure * 0.95 + physics.expectedOilPressure * 0.05 + noise(0.5)).toFixed(1));
  target.oilTemp = parseFloat((target.oilTemp * 0.95 + physics.expectedOilTemp * 0.05 + noise(0.3)).toFixed(1));
  target.fuelFlow = parseFloat((target.fuelFlow * 0.95 + physics.expectedFuelFlow * 0.05 + noise(0.2)).toFixed(1));
  target.vibration = parseFloat((target.vibration * 0.95 + physics.expectedVibration * 0.05 + noise(0.04)).toFixed(2));
  target.batteryVoltage = parseFloat((28.1 + noise(0.1)).toFixed(1));

  // Apply Fault Injections if active
  if (activeFault === 'cht_overheat_cyl3') {
    target.cht3 = Math.min(245, target.cht3 + 3.5 + Math.random() * 2);
    target.egt3 = target.egt3 + 1.5;
  } else if (activeFault === 'fuel_injector_clog') {
    target.egt2 = Math.min(840, target.egt2 + 5.0); // Lean mixture temp rise in Cylinder 2
    target.vibration = parseFloat((target.vibration + 0.15).toFixed(2));
  } else if (activeFault === 'oil_pressure_drop') {
    target.oilPressure = Math.max(18, target.oilPressure - 1.2);
    target.oilTemp = Math.min(118, target.oilTemp + 0.8);
  } else if (activeFault === 'vibration_surge') {
    target.vibration = parseFloat((target.vibration + 0.35 + Math.random() * 0.5).toFixed(2));
  } else if (activeFault === 'sensor_fault_cht1') {
    // Sensor fault: spike without physics backing (EGT and Oil normal)
    target.cht1 = 250 + Math.round(Math.random() * 15);
  }

  return target;
}
