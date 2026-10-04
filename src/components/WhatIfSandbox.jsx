import React, { useState } from 'react';
import { Compass, Thermometer, Wind, ShieldCheck, AlertTriangle, RefreshCw, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WhatIfSandbox({ telemetry }) {
  const [alt, setAlt] = useState(12000);
  const [ambientTemp, setAmbientTemp] = useState(25);
  const [coolingEff, setCoolingEff] = useState(85);
  const [extraHours, setExtraHours] = useState(2);
  const [payloadLoad, setPayloadLoad] = useState(75);

  // Compute interactive mission simulation
  const calcMissionScore = () => {
    let score = 98;
    
    // High ambient temp penalty
    if (ambientTemp > 30) score -= (ambientTemp - 30) * 1.5;
    if (ambientTemp < -10) score -= Math.abs(ambientTemp + 10) * 0.5;

    // High altitude penalty
    if (alt > 15000) score -= ((alt - 15000) / 1000) * 2;

    // Cooling efficiency penalty
    if (coolingEff < 80) score -= (80 - coolingEff) * 1.8;

    // Extra hours penalty
    if (extraHours > 3) score -= (extraHours - 3) * 4;

    // Load penalty
    if (payloadLoad > 85) score -= (payloadLoad - 85) * 1.2;

    return Math.max(10, Math.min(100, Math.round(score)));
  };

  const missionScore = calcMissionScore();

  const getThermalRisk = () => {
    const risk = Math.round(10 + (ambientTemp * 0.8) + ((100 - coolingEff) * 0.9) + (payloadLoad * 0.3));
    return Math.min(99, Math.max(5, risk));
  };

  const thermalRisk = getThermalRisk();

  const estFuelLiters = Math.round((24.5 * (1 + (payloadLoad / 200))) * (4 + extraHours));

  const handleSimulatePass = () => {
    if (missionScore >= 80) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Title Header */}
      <div className="glass-panel rounded-2xl p-5 border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Compass className="w-6 h-6 text-cyan-400" />
            <h2 className="font-tech font-bold text-xl text-white">
              Mission-Aware What-If Simulation Sandbox
            </h2>
          </div>
          <p className="text-xs font-mono text-slate-400">
            Simulate environmental extremes & mission duration changes before UAV launch
          </p>
        </div>

        <button
          onClick={handleSimulatePass}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-tech font-bold text-slate-950 hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_15px_rgba(0,242,254,0.3)] transition"
        >
          RUN MISSION RE-EVALUATION
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Simulation Controls Panel (2 columns) */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-5 border border-cyan-500/20 flex flex-col gap-5">
          <h3 className="font-tech font-bold text-lg text-white border-b border-slate-800 pb-3">
            Interactive Scenario Parameters
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Mission Flight Altitude */}
            <div className="flex flex-col gap-2 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-slate-300 font-semibold">Simulated Flight Altitude:</span>
                <span className="text-cyan-400 font-bold">{alt.toLocaleString()} ft</span>
              </div>
              <input
                type="range"
                min="1000"
                max="25000"
                step="1000"
                value={alt}
                onChange={(e) => setAlt(Number(e.target.value))}
                className="accent-cyan-400 cursor-pointer"
              />
              <span className="text-[11px] font-mono text-slate-500">MALE UAV Operating Ceiling: 25,000 ft</span>
            </div>

            {/* Ambient Air Temperature */}
            <div className="flex flex-col gap-2 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-slate-300 font-semibold">Ambient Air Temp:</span>
                <span className={`${ambientTemp > 35 ? 'text-red-400' : 'text-cyan-400'} font-bold`}>{ambientTemp}°C</span>
              </div>
              <input
                type="range"
                min="-30"
                max="45"
                value={ambientTemp}
                onChange={(e) => setAmbientTemp(Number(e.target.value))}
                className="accent-cyan-400 cursor-pointer"
              />
              <span className="text-[11px] font-mono text-slate-500">Extreme desert vs high-altitude ice conditions</span>
            </div>

            {/* Engine Cooling System Efficiency */}
            <div className="flex flex-col gap-2 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-slate-300 font-semibold">Cooling Efficiency:</span>
                <span className={`${coolingEff < 75 ? 'text-amber-400' : 'text-cyan-400'} font-bold`}>{coolingEff}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={coolingEff}
                onChange={(e) => setCoolingEff(Number(e.target.value))}
                className="accent-cyan-400 cursor-pointer"
              />
              <span className="text-[11px] font-mono text-slate-500">Simulate duct blockage / cowl flap restriction</span>
            </div>

            {/* Extended Flight Mission Time */}
            <div className="flex flex-col gap-2 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-slate-300 font-semibold">Extra Mission Duration:</span>
                <span className="text-cyan-400 font-bold">+{extraHours} Hours</span>
              </div>
              <input
                type="range"
                min="0"
                max="6"
                value={extraHours}
                onChange={(e) => setExtraHours(Number(e.target.value))}
                className="accent-cyan-400 cursor-pointer"
              />
              <span className="text-[11px] font-mono text-slate-500">Base patrol: 4 Hours (Total: {4 + extraHours} Hours)</span>
            </div>

            {/* Payload Load */}
            <div className="flex flex-col gap-2 bg-slate-900/60 p-4 rounded-xl border border-slate-800 md:col-span-2">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-slate-300 font-semibold">Engine Load & Payload Capacity:</span>
                <span className="text-cyan-400 font-bold">{payloadLoad}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                value={payloadLoad}
                onChange={(e) => setPayloadLoad(Number(e.target.value))}
                className="accent-cyan-400 cursor-pointer"
              />
            </div>

          </div>
        </div>

        {/* Results & Mission Assurance Outcome (1 column) */}
        <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20 flex flex-col justify-between">
          <div>
            <h3 className="font-tech font-bold text-lg text-white mb-4 border-b border-slate-800 pb-3">
              Mission Assurance Outcome
            </h3>

            {/* Mission Readiness Rating Dial */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-900/80 border border-slate-800 mb-4">
              <div className="text-xs font-mono text-slate-400 mb-1">PREDICTED MISSION READINESS</div>
              <div className={`text-5xl font-tech font-bold ${missionScore >= 80 ? 'text-emerald-400 glow-green' : missionScore >= 60 ? 'text-amber-400' : 'text-red-400 glow-red'}`}>
                {missionScore}%
              </div>
              <span className={`mt-2 px-3 py-0.5 rounded text-xs font-mono font-bold ${missionScore >= 80 ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : missionScore >= 60 ? 'bg-amber-950 text-amber-300 border border-amber-500/40' : 'bg-red-950 text-red-300 border border-red-500/40'}`}>
                {missionScore >= 80 ? 'MISSION CLEARED' : missionScore >= 60 ? 'CAUTION: MARGINAL' : 'MISSION REJECTED'}
              </span>
            </div>

            {/* Sub-Metrics */}
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between p-2.5 rounded bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">Thermal Overheat Risk:</span>
                <span className={`font-bold ${thermalRisk > 50 ? 'text-red-400' : 'text-cyan-300'}`}>{thermalRisk}%</span>
              </div>

              <div className="flex justify-between p-2.5 rounded bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">Total Fuel Required:</span>
                <span className="text-emerald-300 font-bold">{estFuelLiters} Liters</span>
              </div>

              <div className="flex justify-between p-2.5 rounded bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">RUL Safety Buffer:</span>
                <span className="text-cyan-300 font-bold">142.5 hrs</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            📌 Digital Twin recommendation is automatically logged into the Engine Digital Passport history.
          </div>
        </div>

      </div>

    </div>
  );
}
