import React from 'react';
import { FileText, Download, ShieldCheck, Cpu, Clock, CheckCircle2, AlertTriangle, Printer } from 'lucide-react';

export default function EnginePassport({ telemetry, physics, activeFault }) {
  
  const handlePrint = () => {
    window.print();
  };

  const logs = [
    { date: '2026-10-04 18:30', event: 'Pre-flight Digital Twin Telemetry Diagnostics', status: 'PASSED', operator: 'Flt Lt. V. Sharma' },
    { date: '2026-10-01 14:15', event: '100-Hour Overhaul Inspection & Oil Sample Analysis', status: 'CLEARED', operator: 'DRDO Tech Team A' },
    { date: '2026-09-24 09:40', event: 'Sensor Calibration: CHT Cylinder 3 Thermocouple', status: 'CALIBRATED', operator: 'Avionics Crew' },
    { date: '2026-09-12 11:20', event: 'High Altitude Test Flight (18,000 ft Mission)', status: 'SUCCESS', operator: 'UAV Operator Squadron 4' },
  ];

  return (
    <div className="flex flex-col gap-6">
      
      {/* Printable Header & Action Bar */}
      <div className="glass-panel rounded-2xl p-5 border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-6 h-6 text-cyan-400" />
            <h2 className="font-tech font-bold text-xl text-white">
              Engine Digital Passport & Official Maintenance Record
            </h2>
          </div>
          <p className="text-xs font-mono text-slate-400">
            Immutable Digital Passport tracking engine lifecycle, maintenance, and anomaly logs
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-mono text-xs font-semibold transition"
          >
            <Printer className="w-4 h-4 text-cyan-400" />
            Export Engineering PDF / Print
          </button>
        </div>
      </div>

      {/* Official Printable Report Card */}
      <div className="glass-panel rounded-2xl p-8 border border-cyan-500/20 bg-slate-900/90 flex flex-col gap-6 print:bg-white print:text-black print:border-none">
        
        {/* Document Header */}
        <div className="flex justify-between items-start border-b border-cyan-500/30 pb-6 print:border-slate-300">
          <div>
            <div className="text-xs font-mono font-bold text-cyan-400 print:text-blue-700">
              DEFENCE RESEARCH & DEVELOPMENT ORGANISATION (DRDO) / iDEX
            </div>
            <h1 className="text-2xl font-tech font-bold text-white print:text-black mt-1">
              ENGINE DIGITAL PASSPORT CERTIFICATE
            </h1>
            <div className="text-xs font-mono text-slate-400 print:text-slate-600">
              SIH26054: AI-Enabled Aero-Piston Engine Digital Twin
            </div>
          </div>

          <div className="text-right font-mono text-xs">
            <div className="px-3 py-1 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 print:bg-slate-100 print:text-slate-800">
              SERIAL: <span className="font-bold">AP-DRDO-9042X</span>
            </div>
            <div className="text-slate-400 print:text-slate-600 mt-1">
              Issued: 04 OCT 2026
            </div>
          </div>
        </div>

        {/* Engine Specifications & Metadata */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 print:bg-slate-50 print:border-slate-200">
            <div className="text-slate-400 print:text-slate-500">ENGINE TYPE</div>
            <div className="font-bold text-slate-100 print:text-slate-900 mt-0.5">Rotax 914/915 Turbo</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 print:bg-slate-50 print:border-slate-200">
            <div className="text-slate-400 print:text-slate-500">TOTAL FLIGHT TIME</div>
            <div className="font-bold text-cyan-400 print:text-blue-600 mt-0.5">482.5 Hours</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 print:bg-slate-50 print:border-slate-200">
            <div className="text-slate-400 print:text-slate-500">UAV PLATFORM</div>
            <div className="font-bold text-slate-100 print:text-slate-900 mt-0.5">TAPAS-BH MALE UAV</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 print:bg-slate-50 print:border-slate-200">
            <div className="text-slate-400 print:text-slate-500">DIGITAL TWIN STATUS</div>
            <div className="font-bold text-emerald-400 print:text-emerald-700 mt-0.5">ACTIVE & SYNCED</div>
          </div>
        </div>

        {/* Current Live Digital Twin Diagnostics Snapshot */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 print:bg-slate-50 print:border-slate-300">
          <h3 className="font-tech font-bold text-sm text-cyan-300 print:text-blue-800 mb-2">
            TELEMETRY SNAPSHOT & HEALTH INTEGRITY
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
            <div>Engine Speed: <span className="font-semibold text-white print:text-black">{telemetry.rpm} RPM</span></div>
            <div>Max CHT: <span className="font-semibold text-white print:text-black">{Math.max(telemetry.cht1, telemetry.cht2, telemetry.cht3, telemetry.cht4)}°C</span></div>
            <div>Oil Pressure: <span className="font-semibold text-white print:text-black">{telemetry.oilPressure} PSI</span></div>
            <div>Vibration Level: <span className="font-semibold text-white print:text-black">{telemetry.vibration} g</span></div>
          </div>
        </div>

        {/* Maintenance Lifecycle Log */}
        <div>
          <h3 className="font-tech font-bold text-base text-white print:text-black mb-3">
            Lifecycle Event & Maintenance History Log
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400 print:text-slate-600 bg-slate-950/60 print:bg-slate-100">
                  <th className="py-2 px-3">TIMESTAMP</th>
                  <th className="py-2 px-3">EVENT DESCRIPTION</th>
                  <th className="py-2 px-3">STATUS</th>
                  <th className="py-2 px-3">CERTIFIED BY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-200">
                {logs.map((log, i) => (
                  <tr key={i} className="hover:bg-slate-800/30 print:hover:bg-slate-50">
                    <td className="py-2.5 px-3 text-slate-400 print:text-slate-600">{log.date}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-200 print:text-slate-900">{log.event}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40 print:bg-emerald-100 print:text-emerald-800">
                        {log.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-cyan-300 print:text-blue-700">{log.operator}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Official Sign-off Stamp */}
        <div className="mt-4 pt-4 border-t border-slate-800 print:border-slate-300 flex justify-between items-end font-mono text-xs text-slate-400 print:text-slate-600">
          <div>
            <div>COHFX-AERO DIGITAL TWIN PLATFORM</div>
            <div>AUTOMATED VALIDATION MD5: <span className="text-cyan-400 print:text-black">8f92a110b42c67e9</span></div>
          </div>
          <div className="text-right">
            <div className="font-bold text-slate-200 print:text-black">APPROVED BY CHIEF RELIABILITY ENGINEER</div>
            <div>DRDO iDEX MALE UAV DIVISION</div>
          </div>
        </div>

      </div>

    </div>
  );
}
