import React from 'react';
import { Shield, Clock, AlertTriangle, TrendingDown, Wrench, CheckCircle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function PrognosticsRUL({ telemetry, activeFault }) {
  // Mock degradation history trajectory over flight hours
  const degradationHistory = [
    { hour: 0, health: 100, rul: 250 },
    { hour: 50, health: 98.5, rul: 200 },
    { hour: 100, health: 97.0, rul: 150 },
    { hour: 150, health: 95.2, rul: 100 },
    { hour: 200, health: 93.8, rul: 50 },
    { hour: 250, health: 91.5, rul: 25 },
    { hour: 300, health: 88.0, rul: 10 },
  ];

  let currentRUL = 142.5;
  let healthIndex = 94.2;

  if (activeFault === 'cht_overheat_cyl3') {
    currentRUL = 34.0;
    healthIndex = 76.5;
  } else if (activeFault === 'oil_pressure_drop') {
    currentRUL = 4.2;
    healthIndex = 52.0;
  }

  const components = [
    { name: 'Cylinder 3 Compression & Rings', health: activeFault === 'cht_overheat_cyl3' ? 64 : 92, status: activeFault === 'cht_overheat_cyl3' ? 'CRITICAL WEAR' : 'GOOD' },
    { name: 'Cylinder 2 Fuel Injector Nozzle', health: activeFault === 'fuel_injector_clog' ? 58 : 95, status: activeFault === 'fuel_injector_clog' ? 'CLOGGED' : 'OPTIMAL' },
    { name: 'Oil Pump & Main Bearing', health: activeFault === 'oil_pressure_drop' ? 42 : 96, status: activeFault === 'oil_pressure_drop' ? 'PRESSURE DROP' : 'OPTIMAL' },
    { name: 'Spark Plugs & Dual Ignition', health: 94, status: 'OPTIMAL' },
    { name: 'Exhaust Valve Clearance', health: 89, status: 'NORMAL WEAR' },
    { name: 'Alternator & Battery System', health: 98, status: 'EXCELLENT' },
  ];

  return (
    <div className="flex flex-col gap-6">
      
      {/* Top Banner: RUL & Health Index Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* RUL Hours Remaining */}
        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 bg-slate-900/60 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-slate-400 mb-1">REMAINING USEFUL LIFE (RUL)</div>
            <div className="text-3xl font-tech font-bold text-cyan-300 glow-cyan">
              {currentRUL} <span className="text-sm font-mono text-slate-400">HOURS</span>
            </div>
            <p className="text-xs font-mono text-cyan-400/80 mt-1">
              Estimated until required overhaul
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
            <Clock className="w-8 h-8" />
          </div>
        </div>

        {/* Engine Health Index */}
        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 bg-slate-900/60 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-slate-400 mb-1">ENGINE HEALTH INDEX</div>
            <div className="text-3xl font-tech font-bold text-emerald-400 glow-green">
              {healthIndex}%
            </div>
            <p className="text-xs font-mono text-emerald-400/80 mt-1">
              Multi-sensor prognostic baseline
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
            <Shield className="w-8 h-8" />
          </div>
        </div>

        {/* Next Scheduled Maintenance */}
        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 bg-slate-900/60 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-slate-400 mb-1">NEXT SERVICE DUE</div>
            <div className="text-3xl font-tech font-bold text-purple-300">
              57.5 <span className="text-sm font-mono text-slate-400">HRS</span>
            </div>
            <p className="text-xs font-mono text-purple-300/80 mt-1">
              100-Hour Inspection & Oil Change
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-purple-950/80 border border-purple-500/40 text-purple-400">
            <Wrench className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* RUL & Health Index Degradation Curve Chart */}
      <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-tech font-bold text-lg text-white">
              Engine Degradation & Remaining Useful Life (RUL) Trajectory
            </h3>
            <p className="text-xs font-mono text-slate-400">
              Prognostic degradation model synced with Aero-Piston lifecycle data
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded border border-cyan-500/30">
            LSTM-Neural Prognostics Model
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={degradationHistory}>
              <defs>
                <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#00f2fe" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4a" />
              <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} label={{ value: 'Total Operating Flight Hours', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} domain={[60, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#0c1527', borderColor: '#00f2fe', borderRadius: '8px', fontSize: '12px', fontFamily: 'JetBrains Mono' }} />
              <Area type="monotone" dataKey="health" name="Engine Health Index (%)" stroke="#00f2fe" fillOpacity={1} fill="url(#colorHealth)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Component Wear Breakdown Grid */}
      <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20">
        <h3 className="font-tech font-bold text-lg text-white mb-4">
          Subsystem Lifecycle & Component Wear Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {components.map((comp, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-xs text-slate-200">{comp.name}</span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  comp.health < 70 ? 'bg-red-950 text-red-300 border border-red-500/40' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {comp.status}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${comp.health < 70 ? 'bg-red-500' : comp.health < 85 ? 'bg-amber-400' : 'bg-cyan-400'}`}
                    style={{ width: `${comp.health}%` }}
                  ></div>
                </div>
                <span className="font-mono text-xs font-bold text-white">{comp.health}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
