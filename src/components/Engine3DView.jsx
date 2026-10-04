import React, { useEffect, useRef, useState } from 'react';
import { ShieldAlert, Zap, Cpu, Maximize2, Info } from 'lucide-react';

export default function Engine3DView({ telemetry, activeFault, onSelectSensor }) {
  const canvasRef = useRef(null);
  const [selectedComponent, setSelectedComponent] = useState('Cylinder 3 (CHT3)');
  const [isRotating, setIsRotating] = useState(true);

  // Angle tracking for crankshaft rotation animation
  const angleRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const render = () => {
      // Handle canvas resize
      const width = canvas.width = canvas.parentElement.clientWidth;
      const height = canvas.height = 420;

      // Clear Canvas
      ctx.fillStyle = '#080d19';
      ctx.fillRect(0, 0, width, height);

      // Draw Grid lines background
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 25;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const centerX = width / 2;
      const centerY = height / 2 + 10;

      // Update rotation angle based on live telemetry RPM
      const rpm = telemetry.rpm || 3000;
      if (isRotating) {
        angleRef.current += (rpm / 60) * 0.05;
      }
      const angle = angleRef.current;

      // ENGINE BLOCK (Boxer 4-Cylinder Layout)
      // Center Crankcase
      const caseWidth = 140;
      const caseHeight = 120;
      ctx.fillStyle = 'rgba(20, 32, 54, 0.9)';
      ctx.strokeStyle = '#00f2fe';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur = 15;
      
      // Draw main crankcase
      ctx.beginPath();
      ctx.roundRect(centerX - caseWidth / 2, centerY - caseHeight / 2, caseWidth, caseHeight, 16);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Crankshaft Hub
      ctx.beginPath();
      ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(30, 48, 80, 0.9)';
      ctx.strokeStyle = '#00f2fe';
      ctx.fill();
      ctx.stroke();

      // Rotating Crank Pin
      const crankRadius = 18;
      const crankX = centerX + Math.cos(angle) * crankRadius;
      const crankY = centerY + Math.sin(angle) * crankRadius;
      ctx.beginPath();
      ctx.arc(crankX, crankY, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#00f2fe';
      ctx.fill();

      // Draw Cylinders (2 on Left, 2 on Right)
      const cylinderLength = 110;
      const cylinderWidth = 64;

      const cylinders = [
        { id: 'Cyl 1', side: 'left', yOffset: -38, chtKey: 'cht1', egtKey: 'egt1', angleShift: 0 },
        { id: 'Cyl 3', side: 'left', yOffset: 38, chtKey: 'cht3', egtKey: 'egt3', angleShift: Math.PI },
        { id: 'Cyl 2', side: 'right', yOffset: -38, chtKey: 'cht2', egtKey: 'egt2', angleShift: Math.PI / 2 },
        { id: 'Cyl 4', side: 'right', yOffset: 38, chtKey: 'cht4', egtKey: 'egt4', angleShift: (3 * Math.PI) / 2 },
      ];

      cylinders.forEach((cyl) => {
        const isLeft = cyl.side === 'left';
        const cylX = isLeft ? centerX - caseWidth / 2 - cylinderLength : centerX + caseWidth / 2;
        const cylY = centerY + cyl.yOffset - cylinderWidth / 2;

        const chtVal = telemetry[cyl.chtKey] || 170;
        const egtVal = telemetry[cyl.egtKey] || 720;
        
        // Determine status color
        let statusColor = '#00f2fe'; // Normal Cyan
        let glowColor = 'rgba(0, 242, 254, 0.4)';
        if (chtVal > 220 || egtVal > 800) {
          statusColor = '#ff2a5f'; // Fault Red
          glowColor = 'rgba(255, 42, 95, 0.8)';
        } else if (chtVal > 190 || egtVal > 760) {
          statusColor = '#ffb703'; // Warning Amber
          glowColor = 'rgba(255, 183, 3, 0.6)';
        }

        // Cylinder Sleeve Outer Body
        ctx.fillStyle = 'rgba(15, 25, 45, 0.85)';
        ctx.strokeStyle = statusColor;
        ctx.lineWidth = 2;
        ctx.shadowColor = statusColor;
        ctx.shadowBlur = (chtVal > 220) ? 20 : 6;
        
        ctx.beginPath();
        ctx.roundRect(cylX, cylY, cylinderLength, cylinderWidth, 8);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Cooling Fins on Cylinder Body
        ctx.strokeStyle = statusColor;
        ctx.lineWidth = 1;
        for (let fin = 15; fin < cylinderLength - 15; fin += 14) {
          ctx.beginPath();
          ctx.moveTo(cylX + fin, cylY - 6);
          ctx.lineTo(cylX + fin, cylY + cylinderWidth + 6);
          ctx.stroke();
        }

        // Piston oscillation math
        const pistonTravel = 32;
        const cycleAngle = angle + cyl.angleShift;
        const pistonDisp = Math.cos(cycleAngle) * pistonTravel;
        const pistonWidth = 24;
        const pistonHeight = 52;
        const pistonX = isLeft 
          ? cylX + 15 + (pistonTravel - pistonDisp) 
          : cylX + cylinderLength - 15 - pistonWidth - (pistonTravel - pistonDisp);
        const pistonY = cylY + 6;

        // Connecting Rod
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(crankX, crankY);
        ctx.lineTo(pistonX + (isLeft ? pistonWidth : 0), pistonY + pistonHeight / 2);
        ctx.stroke();

        // Piston Head
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = statusColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(pistonX, pistonY, pistonWidth, pistonHeight, 4);
        ctx.fill();
        ctx.stroke();

        // Spark Flash at TDC (Top Dead Center)
        if (Math.abs(Math.cos(cycleAngle) - 1) < 0.15) {
          ctx.fillStyle = '#ffb703';
          ctx.shadowColor = '#ffb703';
          ctx.shadowBlur = 15;
          const sparkX = isLeft ? cylX + 6 : cylX + cylinderLength - 6;
          ctx.beginPath();
          ctx.arc(sparkX, cylY + cylinderWidth / 2, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Label Sensors on Cylinder Head
        const labelX = isLeft ? cylX - 10 : cylX + cylinderLength + 10;
        const labelY = cylY + cylinderWidth / 2;
        
        ctx.font = 'bold 11px "JetBrains Mono"';
        ctx.fillStyle = statusColor;
        ctx.textAlign = isLeft ? 'right' : 'left';
        ctx.fillText(`${cyl.id}: ${chtVal}°C`, labelX, labelY - 6);
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(`EGT: ${egtVal}°C`, labelX, labelY + 8);
      });

      // Oil Sump & Pressure Sensor (Bottom)
      const sumpY = centerY + caseHeight / 2 + 10;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = telemetry.oilPressure < 30 ? '#ff2a5f' : '#00e676';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(centerX - 40, sumpY, 80, 30, 6);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = telemetry.oilPressure < 30 ? '#ff2a5f' : '#00e676';
      ctx.font = '10px "JetBrains Mono"';
      ctx.textAlign = 'center';
      ctx.fillText(`OIL: ${telemetry.oilPressure} PSI`, centerX, sumpY + 18);

      // Animation Frame Call
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [telemetry, isRotating]);

  return (
    <div className="glass-panel rounded-2xl p-4 border border-cyan-500/20 flex flex-col gap-3 relative overflow-hidden">
      
      {/* Overlay Title & Quick Controls */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-cyan-400" />
          <h2 className="font-tech font-bold text-lg text-white">
            3D Aero-Piston Digital Twin Live Model
          </h2>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
            Boxer-4 180° Twin Engine
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition"
          >
            {isRotating ? 'Pause Rotation' : 'Resume Rotation'}
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
        <canvas ref={canvasRef} className="w-full block" />
        
        {/* Realtime Speed Overlay */}
        <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-cyan-500/30 font-mono text-xs text-cyan-300">
          <div>CRANKSHAFT: <span className="font-bold text-white">{telemetry.rpm} RPM</span></div>
          <div>THROTTLE: <span className="font-bold text-cyan-400">{telemetry.throttle}%</span></div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md p-2.5 rounded-lg border border-slate-700/60 font-mono text-xs flex gap-3 text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Normal
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Warning
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span> Anomaly / Fault
          </div>
        </div>
      </div>
    </div>
  );
}
