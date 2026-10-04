import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, FastForward, Film, Compass, Thermometer, ShieldCheck, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ReplayAndSandbox({ theme }) {
  // Flight Replay State
  const [selectedMission, setSelectedMission] = useState('mission_12');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentFrame, setCurrentFrame] = useState(15);

  // What-If Simulator State
  const [alt, setAlt] = useState(14000);
  const [ambientTemp, setAmbientTemp] = useState(28);
  const [coolingEff, setCoolingEff] = useState(85);
  const [extraHours, setExtraHours] = useState(2);
  const [payloadLoad, setPayloadLoad] = useState(80);

  // Mock historical mission frames for replay
  const missionFrames = Array.from({ length: 100 }, (_, i) => {
    const minute = i * 2;
    const isOverheat = selectedMission === 'mission_12' && i > 60;
    return {
      frame: i,
      timestamp: `T+${Math.floor(minute / 60)}h ${minute % 60}m`,
      rpm: isOverheat ? 5400 : 4800 + Math.sin(i / 5) * 200,
      cht3: isOverheat ? 225 + Math.min(30, (i - 60) * 1.2) : 172 + Math.cos(i / 4) * 8,
      egt2: isOverheat ? 810 : 725 + Math.sin(i / 3) * 15,
      oilPressure: isOverheat ? 32 : 54,
      status: isOverheat ? 'FAULT_DETECTED' : 'NOMINAL',
    };
  });

  // Replay playback loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentFrame((prev) => {
        if (prev >= missionFrames.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1000 / playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, missionFrames.length]);

  const frameData = missionFrames[currentFrame] || missionFrames[0];

  // Compute Mission Readiness Score
  const calcMissionScore = () => {
    let score = 98;
    if (ambientTemp > 30) score -= (ambientTemp - 30) * 1.5;
    if (alt > 15000) score -= ((alt - 15000) / 1000) * 2;
    if (coolingEff < 80) score -= (80 - coolingEff) * 1.8;
    if (extraHours > 3) score -= (extraHours - 3) * 4;
    return Math.max(10, Math.min(100, Math.round(score)));
  };

  const missionScore = calcMissionScore();

  const handleSimulatePass = () => {
    if (missionScore >= 80) {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Blackbox Flight Replay Panel */}
      <div className={`glass-panel rounded-2xl p-6 border ${theme === 'dark' ? 'border-cyan-500/20 bg-slate-900/60' : 'border-slate-200 bg-white'}`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4 border-b pb-4 border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Film className="w-5 h-5 text-cyan-400" />
              <h2 className="font-tech font-bold text-xl">
                Blackbox Flight Telemetry Replay & Event Analyzer
              </h2>
            </div>
            <p className="text-xs font-mono text-slate-400">
              Select recorded UAV flight missions to replay frame-by-frame telemetry logs
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedMission}
              onChange={(e) => { setSelectedMission(e.target.value); setCurrentFrame(0); setIsPlaying(false); }}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-cyan-500/40 font-mono text-xs text-cyan-300 font-semibold"
            >
              <option value="mission_04">Mission #04: Standard Desert Patrol (4 Hours)</option>
              <option value="mission_08">Mission #08: High Altitude Recon (18,000 ft)</option>
              <option value="mission_12">Mission #12: Cylinder-3 Overheat & Recovery Event</option>
            </select>
          </div>
        </div>

        {/* Replay Controls & Scrubber */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
          
          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-3 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-bold transition shadow-lg"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            <button
              onClick={() => { setCurrentFrame(0); setIsPlaying(false); }}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Reset Replay"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1 font-mono text-xs bg-slate-950 px-2 py-1 rounded border border-slate-800">
              <span className="text-slate-400">SPEED:</span>
              {[1, 2, 5].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-1.5 py-0.5 rounded ${playbackSpeed === spd ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400'}`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* Timeline Scrubber */}
          <div className="lg:col-span-2 flex flex-col gap-1">
            <div className="flex justify-between font-mono text-xs text-slate-400">
              <span>TIMESTAMP: <strong className="text-cyan-300">{frameData.timestamp}</strong></span>
              <span>FRAME: {currentFrame + 1} / 100</span>
            </div>
            <input
              type="range"
              min="0"
              max="99"
              value={currentFrame}
              onChange={(e) => setCurrentFrame(Number(e.target.value))}
              className="accent-cyan-400 cursor-pointer w-full"
            />
          </div>

          {/* Replayed Frame Telemetry Snapshot */}
          <div className={`p-3 rounded-xl border font-mono text-xs ${frameData.status === 'FAULT_DETECTED' ? 'bg-red-950/80 border-red-500/50 text-red-300' : 'bg-slate-950 border-cyan-500/30 text-cyan-300'}`}>
            <div className="flex justify-between font-bold">
              <span>{frameData.status}</span>
              <span>{frameData.rpm} RPM</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              CHT3: {frameData.cht3.toFixed(1)}°C | EGT2: {frameData.egt2.toFixed(1)}°C
            </div>
          </div>

        </div>
      </div>

      {/* What-If Sandbox Panel */}
      <div className={`glass-panel rounded-2xl p-6 border ${theme === 'dark' ? 'border-cyan-500/20 bg-slate-900/60' : 'border-slate-200 bg-white'}`}>
        <div className="flex items-center justify-between mb-4 border-b pb-3 border-slate-800">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            <h2 className="font-tech font-bold text-xl">
              Mission-Aware What-If Sandbox & Readiness Evaluator
            </h2>
          </div>
          <button
            onClick={handleSimulatePass}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-tech font-bold text-slate-950 hover:from-cyan-400 hover:to-blue-500 shadow-md transition"
          >
            RUN READINESS CHECK
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-slate-400">Flight Altitude:</span>
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
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-slate-400">Ambient Air Temp:</span>
                <span className={`${ambientTemp > 32 ? 'text-red-400' : 'text-cyan-400'} font-bold`}>{ambientTemp}°C</span>
              </div>
              <input
                type="range"
                min="-30"
                max="45"
                value={ambientTemp}
                onChange={(e) => setAmbientTemp(Number(e.target.value))}
                className="accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-slate-400">Cooling Efficiency:</span>
                <span className="text-cyan-400 font-bold">{coolingEff}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={coolingEff}
                onChange={(e) => setCoolingEff(Number(e.target.value))}
                className="accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-slate-400">Extra Flight Duration:</span>
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
            </div>

          </div>

          {/* Outcome */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 flex flex-col justify-between items-center text-center">
            <div className="text-xs font-mono text-slate-400">PREDICTED MISSION READINESS</div>
            <div className={`text-5xl font-tech font-bold my-2 ${missionScore >= 80 ? 'text-emerald-400 glow-green' : missionScore >= 60 ? 'text-amber-400' : 'text-red-400 glow-red'}`}>
              {missionScore}%
            </div>
            <span className={`px-3 py-1 rounded text-xs font-mono font-bold ${missionScore >= 80 ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-amber-950 text-amber-300'}`}>
              {missionScore >= 80 ? 'MISSION CLEARED' : 'CAUTION: MARGINAL'}
            </span>
          </div>

        </div>
      </div>

    </div>
  );
}
