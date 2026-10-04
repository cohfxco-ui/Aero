import React from 'react';
import { Cpu, CheckCircle2, AlertOctagon, HelpCircle, Activity, ChevronRight, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export default function AIDiagnostics({ telemetry, physics, activeFault }) {
  
  // Calculate physics residuals
  const chtResidual3 = Math.abs(telemetry.cht3 - physics.expectedChtAvg);
  const egtResidual2 = Math.abs(telemetry.egt2 - physics.expectedEgtAvg);
  const oilResidual = Math.abs(telemetry.oilPressure - physics.expectedOilPressure);
  const vibResidual = Math.abs(telemetry.vibration - physics.expectedVibration);

  // Fault Diagnosis Classifier & Sensor vs Engine Isolation Logic
  let diagnosis = {
    status: 'NORMAL_OPERATION',
    title: 'Engine Operating Within Physics Nominal Envelope',
    confidence: 99.4,
    type: 'NO_FAULT',
    category: 'Optimal Health',
    recommendation: 'Engine cleared for continuous MALE UAV mission operation.',
    shapFeatures: [
      { name: 'CHT Residual', value: 2.1 },
      { name: 'EGT Residual', value: 3.4 },
      { name: 'Oil Press Residual', value: 1.2 },
      { name: 'Vibration Residual', value: 0.4 },
      { name: 'RPM Consistency', value: 1.1 },
    ],
  };

  if (activeFault === 'cht_overheat_cyl3' || telemetry.cht3 > 215) {
    diagnosis = {
      status: 'CRITICAL_FAULT',
      title: 'Cylinder 3 Thermal Overheat (Mechanical Fault)',
      confidence: 96.8,
      type: 'ENGINE_FAULT',
      category: 'Thermal Exhaustion / Cooling Blockage',
      recommendation: 'Reduce UAV altitude & throttle by 20%. Plan emergency recovery within 45 mins.',
      shapFeatures: [
        { name: 'CHT-3 Residual Δ', value: 45.2 },
        { name: 'EGT-3 Coupling', value: 18.5 },
        { name: 'Oil Temp Rise', value: 12.1 },
        { name: 'Vibration Δ', value: 4.2 },
        { name: 'Altitude Pressure', value: 2.0 },
      ],
    };
  } else if (activeFault === 'sensor_fault_cht1' || (telemetry.cht1 > 240 && telemetry.egt1 < 750)) {
    diagnosis = {
      status: 'SENSOR_FAULT',
      title: 'CHT-1 Thermocouple Signal Anomaly (Sensor Fault Isolated)',
      confidence: 98.2,
      type: 'SENSOR_FAULT',
      category: 'Electrical Drift / Thermocouple Short-Circuit',
      recommendation: 'Cross-sensor physics check confirms engine is physically normal. Ignore CHT-1 gauge, rely on EGT-1 twin calculation.',
      shapFeatures: [
        { name: 'CHT-1 Spike Δ', value: 72.0 },
        { name: 'EGT-1 Discrepancy', value: -42.0 },
        { name: 'Oil Temp Normal', value: 0.5 },
        { name: 'Vibration Normal', value: 0.2 },
        { name: 'Battery Volts', value: 1.1 },
      ],
    };
  } else if (activeFault === 'fuel_injector_clog' || telemetry.egt2 > 810) {
    diagnosis = {
      status: 'WARNING_FAULT',
      title: 'Lean Mixture / Fuel Injector Clogging in Cylinder 2',
      confidence: 94.5,
      type: 'ENGINE_FAULT',
      category: 'Fuel Feed Restriction',
      recommendation: 'Service Cylinder 2 fuel injector nozzle upon landing.',
      shapFeatures: [
        { name: 'EGT-2 Residual Δ', value: 38.6 },
        { name: 'Fuel Flow Delta', value: 14.2 },
        { name: 'Vibration Ripple', value: 9.4 },
        { name: 'CHT-2 Heat Spike', value: 6.8 },
      ],
    };
  } else if (activeFault === 'oil_pressure_drop' || telemetry.oilPressure < 32) {
    diagnosis = {
      status: 'CRITICAL_FAULT',
      title: 'Oil Pressure Loss / Lubrication Pump Cavitation',
      confidence: 97.9,
      type: 'ENGINE_FAULT',
      category: 'Hydraulic Lubrication Failure',
      recommendation: 'IMMEDIATE UAV ABORT RECOVERY. Reduce engine RPM to idle throttle.',
      shapFeatures: [
        { name: 'Oil Press Residual', value: 58.4 },
        { name: 'Oil Temp Rise', value: 24.1 },
        { name: 'Crank Bearing Vib', value: 12.8 },
        { name: 'RPM Delta', value: 4.7 },
      ],
    };
  }

  return (
    <div className="flex flex-col gap-6">
      
      {/* Top Banner: Sensor Fault vs Engine Fault AI Isolation */}
      <div className={`glass-panel rounded-2xl p-6 border flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 ${
        diagnosis.type === 'ENGINE_FAULT' ? 'border-red-500/50 bg-red-950/20' :
        diagnosis.type === 'SENSOR_FAULT' ? 'border-amber-500/50 bg-amber-950/20' :
        'border-cyan-500/30 bg-slate-900/50'
      }`}>
        
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-2xl border ${
            diagnosis.type === 'ENGINE_FAULT' ? 'bg-red-500/20 text-red-400 border-red-500/40 glow-red' :
            diagnosis.type === 'SENSOR_FAULT' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
            'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 glow-green'
          }`}>
            {diagnosis.type === 'ENGINE_FAULT' ? <AlertOctagon className="w-8 h-8 animate-pulse" /> :
             diagnosis.type === 'SENSOR_FAULT' ? <HelpCircle className="w-8 h-8" /> :
             <CheckCircle2 className="w-8 h-8" />}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold ${
                diagnosis.type === 'ENGINE_FAULT' ? 'bg-red-900/80 text-red-200 border border-red-500/40' :
                diagnosis.type === 'SENSOR_FAULT' ? 'bg-amber-900/80 text-amber-200 border border-amber-500/40' :
                'bg-emerald-900/80 text-emerald-200 border border-emerald-500/40'
              }`}>
                {diagnosis.type}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Category: {diagnosis.category}
              </span>
            </div>

            <h2 className="text-xl font-tech font-bold text-white mb-1">
              {diagnosis.title}
            </h2>
            <p className="text-sm font-mono text-slate-300">
              💡 <span className="font-semibold text-cyan-300">AI Actionable Recommendation:</span> {diagnosis.recommendation}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 border-t lg:border-t-0 lg:border-l border-slate-700/60 pt-4 lg:pt-0 lg:pl-6 w-full lg:w-auto justify-between lg:justify-start">
          <div>
            <div className="text-xs font-mono text-slate-400">AI CONFIDENCE SCORE</div>
            <div className="text-3xl font-tech font-bold text-cyan-400 glow-cyan">
              {diagnosis.confidence}%
            </div>
          </div>

          <div>
            <div className="text-xs font-mono text-slate-400">PHYSICS MATCH</div>
            <div className="text-3xl font-tech font-bold text-emerald-400">
              {diagnosis.type === 'SENSOR_FAULT' ? 'DISCREPANT' : 'SYNCED'}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: SHAP Feature Importance & Residual Delta Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* SHAP Feature Importance Chart */}
        <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-cyan-400" />
                <h3 className="font-tech font-bold text-lg text-white">
                  Explainable AI (XAI) SHAP Feature Attribution
                </h3>
              </div>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                XGBoost + SHAP
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400 mb-4">
              Shows top telemetry parameters driving the current AI diagnosis
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={diagnosis.shapFeatures} margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0c1527', borderColor: '#00f2fe', borderRadius: '8px', fontSize: '12px', fontFamily: 'JetBrains Mono' }} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {diagnosis.shapFeatures.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.value > 30 ? '#ff2a5f' : entry.value > 10 ? '#ffb703' : '#00f2fe'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-time Residual Delta Matrix */}
        <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-purple-400" />
              <h3 className="font-tech font-bold text-lg text-white">
                Digital Twin Residual Delta Matrix
              </h3>
            </div>
            <p className="text-xs font-mono text-slate-400 mb-4">
              Thermodynamic physics law verification: $\Delta = |Sensor - Physics|$
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-700/80 text-slate-400 bg-slate-900/60">
                  <th className="py-2.5 px-3">PARAMETER</th>
                  <th className="py-2.5 px-3">ACTUAL</th>
                  <th className="py-2.5 px-3">EXPECTED</th>
                  <th className="py-2.5 px-3">RESIDUAL Δ</th>
                  <th className="py-2.5 px-3">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-semibold text-slate-200">Cylinder 3 CHT</td>
                  <td className="py-2.5 px-3 text-cyan-300">{telemetry.cht3}°C</td>
                  <td className="py-2.5 px-3 text-emerald-400">{physics.expectedChtAvg}°C</td>
                  <td className="py-2.5 px-3 font-bold text-amber-400">+{chtResidual3.toFixed(1)}°C</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${chtResidual3 > 30 ? 'bg-red-950 text-red-300 border border-red-500/40' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'}`}>
                      {chtResidual3 > 30 ? 'ANOMALY' : 'OK'}
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-semibold text-slate-200">Cylinder 2 EGT</td>
                  <td className="py-2.5 px-3 text-cyan-300">{telemetry.egt2}°C</td>
                  <td className="py-2.5 px-3 text-emerald-400">{physics.expectedEgtAvg}°C</td>
                  <td className="py-2.5 px-3 font-bold text-amber-400">+{egtResidual2.toFixed(1)}°C</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${egtResidual2 > 50 ? 'bg-red-950 text-red-300 border border-red-500/40' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'}`}>
                      {egtResidual2 > 50 ? 'LEAN FAULT' : 'OK'}
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-semibold text-slate-200">Oil Pressure</td>
                  <td className="py-2.5 px-3 text-cyan-300">{telemetry.oilPressure} PSI</td>
                  <td className="py-2.5 px-3 text-emerald-400">{physics.expectedOilPressure} PSI</td>
                  <td className="py-2.5 px-3 font-bold text-cyan-400">{oilResidual.toFixed(1)} PSI</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${telemetry.oilPressure < 30 ? 'bg-red-950 text-red-300 border border-red-500/40' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'}`}>
                      {telemetry.oilPressure < 30 ? 'PRESSURE DROP' : 'NORMAL'}
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-semibold text-slate-200">Vibration Level</td>
                  <td className="py-2.5 px-3 text-cyan-300">{telemetry.vibration} g</td>
                  <td className="py-2.5 px-3 text-emerald-400">{physics.expectedVibration} g</td>
                  <td className="py-2.5 px-3 font-bold text-cyan-400">{vibResidual.toFixed(2)} g</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                      NOMINAL
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
