import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Engine3DView from './components/Engine3DView';
import TelemetryDashboard from './components/TelemetryDashboard';
import PINNBenchmarkXAI from './components/PINNBenchmarkXAI';
import ReplayAndSandbox from './components/ReplayAndSandbox';
import PassportAndPrognostics from './components/PassportAndPrognostics';

import {
  INITIAL_TELEMETRY,
  calculatePhysicsExpected,
  generateTelemetryStep,
} from './utils/engineSimulator';

export default function App() {
  const [activeTab, setActiveTab] = useState('twin');
  const [theme, setTheme] = useState('dark');
  
  const [liveStatus, setLiveStatus] = useState(true);
  const [activeFault, setActiveFault] = useState(null);
  
  const [throttle, setThrottle] = useState(65);
  const [altitude, setAltitude] = useState(8000);

  const [telemetry, setTelemetry] = useState(INITIAL_TELEMETRY);
  const [telemetryHistory, setTelemetryHistory] = useState([]);

  const physics = calculatePhysicsExpected(telemetry);

  // Live telemetry loop at 500ms tick
  useEffect(() => {
    if (!liveStatus) return;

    const interval = setInterval(() => {
      setTelemetry((prev) => {
        const next = generateTelemetryStep(prev, activeFault, throttle, altitude);
        
        // Update history
        const expected = calculatePhysicsExpected(next);
        const timeLabel = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        setTelemetryHistory((hist) => {
          const updated = [...hist, { ...next, expectedChtAvg: expected.expectedChtAvg, expectedOilPressure: expected.expectedOilPressure, time: timeLabel }];
          if (updated.length > 30) updated.shift();
          return updated;
        });

        return next;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [liveStatus, activeFault, throttle, altitude]);

  const handleInjectFault = (faultType) => {
    if (activeFault === faultType) {
      setActiveFault(null);
    } else {
      setActiveFault(faultType);
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark-theme bg-tactical-grid bg-aerospace-900 text-slate-100' : 'light-theme bg-tactical-grid bg-slate-100 text-slate-900'} flex flex-col font-sans transition-colors duration-300 selection:bg-cyan-500 selection:text-black`}>
      
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        liveStatus={liveStatus}
        activeFault={activeFault}
        setActiveFault={setActiveFault}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6">
        
        {/* Tab 1: Real-time Digital Twin & Live Engine */}
        {activeTab === 'twin' && (
          <div className="flex flex-col gap-6">
            <Engine3DView
              telemetry={telemetry}
              activeFault={activeFault}
            />

            <TelemetryDashboard
              telemetry={telemetry}
              physics={physics}
              telemetryHistory={telemetryHistory}
              throttle={throttle}
              setThrottle={setThrottle}
              altitude={altitude}
              setAltitude={setAltitude}
              onInjectFault={handleInjectFault}
            />
          </div>
        )}

        {/* Tab 2: PINN AI Benchmark & XAI Diagnostics */}
        {activeTab === 'diagnostics' && (
          <PINNBenchmarkXAI
            telemetry={telemetry}
            physics={physics}
            activeFault={activeFault}
            theme={theme}
          />
        )}

        {/* Tab 3: Blackbox Replay & Mission Sandbox */}
        {activeTab === 'replay_sandbox' && (
          <ReplayAndSandbox
            theme={theme}
          />
        )}

        {/* Tab 4: Prognostics RUL & Digital Passport */}
        {activeTab === 'passport_prognostics' && (
          <PassportAndPrognostics
            telemetry={telemetry}
            activeFault={activeFault}
            theme={theme}
          />
        )}

      </main>

      {/* Footer */}
      <footer className={`border-t py-4 px-6 text-center font-mono text-xs ${theme === 'dark' ? 'border-slate-800/80 text-slate-500' : 'border-slate-300 text-slate-600'}`}>
        <p>COHFX-AERO • AI Digital Twin for Aero-Piston Engine Reliability • DRDO / iDEX SIH26054</p>
      </footer>
    </div>
  );
}
