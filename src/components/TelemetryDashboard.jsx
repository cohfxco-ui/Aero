import React from 'react';
import { Gauge, Flame, Droplets, Activity, Wind, Sliders, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

export default function TelemetryDashboard({
  telemetry,
  physics,
  telemetryHistory,
  throttle,
  setThrottle,
  altitude,
  setAltitude,
  onInjectFault,
}) {
  const getStatusColor = (val, warnThreshold, critThreshold) => {
    if (val >= critThreshold) return 'text-red-400 border-red-500/50 bg-red-950/40 glow-red';
    if (val >= warnThreshold) return 'text-amber-400 border-amber-500/50 bg-amber-950/40';
    return 'text-cyan-400 border-cyan-500/30 bg-slate-900/60 glow-cyan';
  };

  const chtMax = Math.max(telemetry.cht1, telemetry.cht2, telemetry.cht3, telemetry.cht4);

  return (
    <div className="flex flex-col gap-6">
      
      {/* Flight Control Sliders & Fault Injector Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-cyan-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Controls */}
        <div className="flex flex-1 items-center gap-6 w-full">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <span className="font-tech font-bold text-white">Telemetry Controls:</span>
          </div>

          <div className="flex flex-1 items-center gap-4">
            <div className="flex flex-col flex-1 gap-1">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-slate-400">Throttle Position:</span>
                <span className="text-cyan-400 font-bold">{throttle}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={throttle}
                onChange={(e) => setThrottle(Number(e.target.value))}
                className="accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>

            <div className="flex flex-col flex-1 gap-1">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-slate-400">UAV Altitude:</span>
                <span className="text-cyan-400 font-bold">{altitude.toLocaleString()} ft</span>
              </div>
              <input
                type="range"
                min="0"
                max="25000"
                step="500"
                value={altitude}
                onChange={(e) => setAltitude(Number(e.target.value))}
                className="accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Fault Injector Shortcuts */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <span className="text-xs font-mono text-slate-400 whitespace-nowrap">Inject Fault:</span>
          <button
            onClick={() => onInjectFault('cht_overheat_cyl3')}
            className="px-2.5 py-1 text-xs font-mono rounded bg-red-950/80 border border-red-500/40 text-red-300 hover:bg-red-800 transition whitespace-nowrap"
          >
            🔥 CHT-3 Overheat
          </button>
          <button
            onClick={() => onInjectFault('fuel_injector_clog')}
            className="px-2.5 py-1 text-xs font-mono rounded bg-amber-950/80 border border-amber-500/40 text-amber-300 hover:bg-amber-800 transition whitespace-nowrap"
          >
            ⛽ Fuel Lean / EGT
          </button>
          <button
            onClick={() => onInjectFault('oil_pressure_drop')}
            className="px-2.5 py-1 text-xs font-mono rounded bg-purple-950/80 border border-purple-500/40 text-purple-300 hover:bg-purple-800 transition whitespace-nowrap"
          >
            🛢️ Oil Pressure Loss
          </button>
          <button
            onClick={() => onInjectFault('sensor_fault_cht1')}
            className="px-2.5 py-1 text-xs font-mono rounded bg-blue-950/80 border border-blue-500/40 text-blue-300 hover:bg-blue-800 transition whitespace-nowrap"
          >
            🔌 Sensor Spike Fault
          </button>
        </div>
      </div>

      {/* Primary Telemetry Live Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        
        {/* RPM Card */}
        <div className="glass-panel p-3.5 rounded-xl border border-cyan-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 font-mono text-xs">
            <span>ENGINE SPEED</span>
            <Gauge className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-tech font-bold text-white glow-cyan">{telemetry.rpm}</span>
            <span className="text-xs font-mono text-slate-400 ml-1">RPM</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 flex justify-between border-t border-slate-800 pt-1">
            <span>PHYSICS BASE:</span>
            <span className="text-cyan-300 font-semibold">{physics.expectedRpm} RPM</span>
          </div>
        </div>

        {/* Max CHT Card */}
        <div className={`glass-panel p-3.5 rounded-xl border flex flex-col justify-between ${getStatusColor(chtMax, 190, 220)}`}>
          <div className="flex items-center justify-between font-mono text-xs opacity-90">
            <span>MAX CHT TEMP</span>
            <Flame className="w-4 h-4" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-tech font-bold">{chtMax}°C</span>
          </div>
          <div className="text-[11px] font-mono opacity-80 flex justify-between border-t border-slate-800 pt-1">
            <span>EXPECTED AVG:</span>
            <span className="font-semibold">{physics.expectedChtAvg}°C</span>
          </div>
        </div>

        {/* Max EGT Card */}
        <div className="glass-panel p-3.5 rounded-xl border border-cyan-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 font-mono text-xs">
            <span>AVG EGT TEMP</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-tech font-bold text-amber-300">{Math.round((telemetry.egt1 + telemetry.egt2 + telemetry.egt3 + telemetry.egt4) / 4)}°C</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 flex justify-between border-t border-slate-800 pt-1">
            <span>PHYSICS BASE:</span>
            <span className="text-amber-300 font-semibold">{physics.expectedEgtAvg}°C</span>
          </div>
        </div>

        {/* Oil Pressure Card */}
        <div className={`glass-panel p-3.5 rounded-xl border flex flex-col justify-between ${telemetry.oilPressure < 30 ? 'border-red-500/50 bg-red-950/40 text-red-400' : 'border-cyan-500/20 text-cyan-400'}`}>
          <div className="flex items-center justify-between font-mono text-xs opacity-90">
            <span>OIL PRESSURE</span>
            <Droplets className="w-4 h-4" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-tech font-bold">{telemetry.oilPressure}</span>
            <span className="text-xs font-mono opacity-80 ml-1">PSI</span>
          </div>
          <div className="text-[11px] font-mono opacity-80 flex justify-between border-t border-slate-800 pt-1">
            <span>PHYSICS BASE:</span>
            <span className="font-semibold">{physics.expectedOilPressure} PSI</span>
          </div>
        </div>

        {/* Fuel Flow Card */}
        <div className="glass-panel p-3.5 rounded-xl border border-cyan-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 font-mono text-xs">
            <span>FUEL CONSUMPTION</span>
            <Wind className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-tech font-bold text-emerald-300">{telemetry.fuelFlow}</span>
            <span className="text-xs font-mono text-slate-400 ml-1">L/hr</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 flex justify-between border-t border-slate-800 pt-1">
            <span>PHYSICS BASE:</span>
            <span className="text-emerald-300 font-semibold">{physics.expectedFuelFlow} L/h</span>
          </div>
        </div>

        {/* Vibration Card */}
        <div className="glass-panel p-3.5 rounded-xl border border-cyan-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 font-mono text-xs">
            <span>VIBRATION LEVEL</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-tech font-bold text-purple-300">{telemetry.vibration}</span>
            <span className="text-xs font-mono text-slate-400 ml-1">g</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 flex justify-between border-t border-slate-800 pt-1">
            <span>LIMIT:</span>
            <span className="text-purple-300 font-semibold">2.5 g</span>
          </div>
        </div>
      </div>

      {/* Real-Time Physics Residual Chart (Recharts) */}
      <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-tech font-bold text-lg text-white">
              Physics Model (Expected) vs Live Telemetry Residuals
            </h3>
            <p className="text-xs font-mono text-slate-400">
              Continuously computes residual Δ = |Tactual − Texpected| for anomaly detection
            </p>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="flex items-center gap-1 text-cyan-400">
              <span className="w-3 h-0.5 bg-cyan-400"></span> Actual Telemetry
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-3 h-0.5 bg-emerald-400 stroke-dasharray"></span> Digital Twin Physics Baseline
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={telemetryHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4a" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0c1527', borderColor: '#00f2fe', borderRadius: '8px', fontSize: '12px', fontFamily: 'JetBrains Mono' }}
              />
              <Line type="monotone" dataKey="cht3" name="Actual CHT 3 (°C)" stroke="#00f2fe" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="expectedChtAvg" name="Physics Baseline (°C)" stroke="#00e676" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              <Line type="monotone" dataKey="egt2" name="Actual EGT 2 (°C)" stroke="#ffb703" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
