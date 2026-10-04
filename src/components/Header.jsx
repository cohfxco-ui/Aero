import React from 'react';
import { Activity, Shield, Cpu, Compass, FileText, Zap, AlertTriangle, Sun, Moon } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, liveStatus, activeFault, setActiveFault, theme, setTheme }) {
  const tabs = [
    { id: 'twin', label: 'Real-Time Digital Twin & Live Engine', icon: Activity },
    { id: 'diagnostics', label: 'PINN AI Benchmark & XAI', icon: Cpu },
    { id: 'replay_sandbox', label: 'Blackbox Replay & Mission Sandbox', icon: Compass },
    { id: 'passport_prognostics', label: 'Prognostics RUL & Digital Passport', icon: Shield },
  ];

  return (
    <header className={`sticky top-0 z-50 glass-panel border-b px-4 py-3 shadow-xl transition-colors duration-300 ${
      theme === 'dark' ? 'border-cyan-500/20 bg-slate-950/80' : 'border-sky-500/30 bg-white/80'
    }`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Team ID */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-400/40 shadow-lg glow-cyan">
            <Zap className="w-6 h-6 text-cyan-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-xl font-tech font-bold tracking-wider ${
                theme === 'dark' ? 'bg-gradient-to-r from-cyan-300 via-white to-cyan-500 bg-clip-text text-transparent' : 'text-slate-900'
              }`}>
                COHFX-AERO
              </h1>
              <span className="px-2 py-0.5 text-xs font-mono font-semibold rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                SIH26054
              </span>
              <span className="px-2 py-0.5 text-xs font-mono font-semibold rounded bg-purple-950/80 border border-purple-500/40 text-purple-300">
                DRDO / iDEX
              </span>
            </div>
            <p className={`text-xs font-mono ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Physics-Informed AI Digital Twin for Aero-Piston Engine Reliability & Mission Assurance
            </p>
          </div>
        </div>

        {/* System Controls & Theme Toggle */}
        <div className="flex items-center gap-3">
          
          {/* Light / Dark Mode Switcher Button */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-xs transition-all ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-700 text-amber-300 hover:bg-slate-800'
                : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
            }`}
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            <span className="font-semibold">{theme === 'dark' ? 'LIGHT MODE' : 'DARK MODE'}</span>
          </button>

          {/* Live Telemetry Connection Indicator */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-xs ${
            theme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700'
          }`}>
            <span className={`w-2.5 h-2.5 rounded-full ${liveStatus ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_#00e676]' : 'bg-red-500'}`}></span>
            <span>{liveStatus ? 'CAN-BUS 50Hz STREAM' : 'PAUSED'}</span>
          </div>

          {activeFault && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-950/80 border border-red-500/50 text-red-300 font-mono text-xs animate-pulse">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span>FAULT INJECTED</span>
              <button
                onClick={() => setActiveFault(null)}
                className="ml-2 px-1.5 py-0.5 rounded bg-red-800 hover:bg-red-700 text-white font-bold transition"
                title="Clear Fault"
              >
                CLEAR
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Streamlined Navigation Tabs */}
      <div className={`max-w-7xl mx-auto mt-3 flex overflow-x-auto gap-2 no-scrollbar border-t pt-2 ${
        theme === 'dark' ? 'border-slate-800/80' : 'border-slate-200'
      }`}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-tech font-semibold text-sm transition-all whitespace-nowrap ${
                isActive
                  ? theme === 'dark'
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/30 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(0,242,254,0.2)]'
                    : 'bg-sky-500 text-white shadow-md'
                  : theme === 'dark'
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? (theme === 'dark' ? 'text-cyan-400' : 'text-white') : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
