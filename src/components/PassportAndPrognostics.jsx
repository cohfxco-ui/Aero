import React from 'react';
import { Shield, Clock, Wrench, FileText, Printer, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function PassportAndPrognostics({ telemetry, activeFault, theme }) {
  
  const handlePrint = () => {
    window.print();
  };

  const degradationHistory = [
    { hour: 0, health: 100 },
    { hour: 50, health: 98.5 },
    { hour: 100, health: 97.0 },
    { hour: 150, health: 95.2 },
    { hour: 200, health: 93.8 },
    { hour: 250, health: 91.5 },
    { hour: 300, health: 88.0 },
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

  const logs = [
    { date: '2026-10-04 18:30', event: 'Pre-flight Digital Twin Telemetry Diagnostics', status: 'PASSED', operator: 'Flt Lt. V. Sharma' },
    { date: '2026-10-01 14:15', event: '100-Hour Overhaul Inspection & Oil Sample Analysis', status: 'CLEARED', operator: 'DRDO Tech Team A' },
    { date: '2026-09-24 09:40', event: 'Sensor Calibration: CHT Cylinder 3 Thermocouple', status: 'CALIBRATED', operator: 'Avionics Crew' },
    { date: '2026-09-12 11:20', event: 'High Altitude Test Flight (18,000 ft Mission)', status: 'SUCCESS', operator: 'UAV Operator Squadron 4' },
  ];

  return (
    <div className="flex flex-col gap-6">
      
      {/* Top Banner: RUL & Health Index Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* RUL Hours Remaining */}
        <div className={`glass-panel p-5 rounded-2xl border flex items-center justify-between ${theme === 'dark' ? 'border-cyan-500/30 bg-slate-900/60' : 'border-slate-200 bg-white'}`}>
          <div>
            <div className="text-xs font-mono text-slate-400 mb-1">REMAINING USEFUL LIFE (RUL)</div>
            <div className="text-3xl font-tech font-bold text-cyan-400 glow-cyan">
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
        <div className={`glass-panel p-5 rounded-2xl border flex items-center justify-between ${theme === 'dark' ? 'border-cyan-500/30 bg-slate-900/60' : 'border-slate-200 bg-white'}`}>
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
        <div className={`glass-panel p-5 rounded-2xl border flex items-center justify-between ${theme === 'dark' ? 'border-cyan-500/30 bg-slate-900/60' : 'border-slate-200 bg-white'}`}>
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

      {/* Degradation Chart & Component Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* RUL Chart */}
        <div className={`glass-panel rounded-2xl p-5 border ${theme === 'dark' ? 'border-cyan-500/20' : 'border-slate-200 bg-white'}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-tech font-bold text-lg">
                Engine Health Degradation & RUL Trajectory
              </h3>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
              LSTM Prognostics
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={degradationHistory}>
                <defs>
                  <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#00f2fe" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} domain={[60, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0c1527', borderColor: '#00f2fe', borderRadius: '8px', fontSize: '12px', fontFamily: 'JetBrains Mono' }} />
                <Area type="monotone" dataKey="health" stroke="#00f2fe" fillOpacity={1} fill="url(#colorHealth)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Components Wear Grid */}
        <div className={`glass-panel rounded-2xl p-5 border ${theme === 'dark' ? 'border-cyan-500/20' : 'border-slate-200 bg-white'}`}>
          <h3 className="font-tech font-bold text-lg mb-4">
            Subsystem Wear Breakdown
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {components.map((comp, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-xs text-slate-200">{comp.name}</span>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${comp.health < 70 ? 'bg-red-950 text-red-300' : 'bg-emerald-950 text-emerald-300'}`}>
                    {comp.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full ${comp.health < 70 ? 'bg-red-500' : 'bg-cyan-400'}`} style={{ width: `${comp.health}%` }}></div>
                  </div>
                  <span className="font-mono text-xs font-bold">{comp.health}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Official Printable Passport Card */}
      <div className={`glass-panel rounded-2xl p-6 border ${theme === 'dark' ? 'border-cyan-500/30 bg-slate-900/90' : 'border-slate-300 bg-white'} print:bg-white print:text-black print:border-none`}>
        <div className="flex justify-between items-start border-b pb-4 mb-4 border-slate-800 print:border-slate-300">
          <div>
            <div className="text-xs font-mono font-bold text-cyan-400 print:text-blue-700">
              DRDO / iDEX • SIH26054 DIGITAL TWIN
            </div>
            <h2 className="text-xl font-tech font-bold print:text-black mt-1">
              ENGINE DIGITAL PASSPORT CERTIFICATE
            </h2>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs transition print:hidden"
          >
            <Printer className="w-4 h-4 text-cyan-400" />
            Print / Export PDF Report
          </button>
        </div>

        {/* Passport Specs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs mb-4">
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800 print:bg-slate-50 print:border-slate-200">
            <div className="text-slate-400">SERIAL ID</div>
            <div className="font-bold text-cyan-400 mt-0.5">AP-DRDO-9042X</div>
          </div>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800 print:bg-slate-50 print:border-slate-200">
            <div className="text-slate-400">TOTAL FLIGHT TIME</div>
            <div className="font-bold text-slate-200 mt-0.5">482.5 Hours</div>
          </div>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800 print:bg-slate-50 print:border-slate-200">
            <div className="text-slate-400">PLATFORM</div>
            <div className="font-bold text-slate-200 mt-0.5">TAPAS MALE UAV</div>
          </div>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800 print:bg-slate-50 print:border-slate-200">
            <div className="text-slate-400">PASSPORT STATUS</div>
            <div className="font-bold text-emerald-400 mt-0.5">VERIFIED & SYNCED</div>
          </div>
        </div>

        {/* Log table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60 print:bg-slate-100">
                <th className="py-2 px-3">TIMESTAMP</th>
                <th className="py-2 px-3">EVENT DESCRIPTION</th>
                <th className="py-2 px-3">STATUS</th>
                <th className="py-2 px-3">AUTHORITY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {logs.map((log, i) => (
                <tr key={i}>
                  <td className="py-2 px-3 text-slate-400">{log.date}</td>
                  <td className="py-2 px-3 font-semibold text-slate-200">{log.event}</td>
                  <td className="py-2 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300">{log.status}</span></td>
                  <td className="py-2 px-3 text-cyan-300">{log.operator}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
