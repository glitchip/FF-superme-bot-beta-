import React from 'react';
import { Target, Zap, Settings, Shield, Crosshair, AlertCircle } from 'lucide-react';
import { DetectionObject } from '../types';

interface DecisionProps {
  currentScene: { objects: DetectionObject[] };
  confidenceThreshold: number;
  activeTargetId: string | null;
  onTargetSelect: (id: string | null) => void;
  autoAimEnabled: boolean;
  onToggleAutoAim: () => void;
  aimSmoothing: number;
  onAimSmoothingChange: (val: number) => void;
  aimMode: 'closest' | 'highest_confidence' | 'priority_head';
  onAimModeChange: (mode: 'closest' | 'highest_confidence' | 'priority_head') => void;
}

export const DecisionEngineView: React.FC<DecisionProps> = ({
  currentScene,
  confidenceThreshold,
  activeTargetId,
  onTargetSelect,
  autoAimEnabled,
  onToggleAutoAim,
  aimSmoothing,
  onAimSmoothingChange,
  aimMode,
  onAimModeChange
}) => {
  // Filter objects by confidence
  const eligibleObjects = currentScene.objects.filter(obj => obj.confidence >= confidenceThreshold);
  const enemies = eligibleObjects.filter(obj => obj.className.startsWith('enemy'));

  // Calculate recommendation based on active Strategy mode
  let recommendedTarget: DetectionObject | null = null;
  if (enemies.length > 0) {
    if (aimMode === 'priority_head') {
      const head = enemies.find(e => e.className === 'enemy_head');
      recommendedTarget = head || enemies[0];
    } else if (aimMode === 'highest_confidence') {
      recommendedTarget = [...enemies].sort((a, b) => b.confidence - a.confidence)[0];
    } else {
      // 'closest' to center (50, 50)
      recommendedTarget = [...enemies].sort((a, b) => {
        const distA = Math.pow(a.x + a.width / 2 - 50, 2) + Math.pow(a.y + a.height / 2 - 50, 2);
        const distB = Math.pow(b.x + b.width / 2 - 50, 2) + Math.pow(b.y + b.height / 2 - 50, 2);
        return distA - distB;
      })[0];
    }
  }

  // Active target details
  const activeTarget = enemies.find(e => e.id === activeTargetId);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="p-1 px-2.5 rounded bg-amber-500/10 text-amber-500 font-mono text-xs font-semibold">Brain</span>
        <h3 className="text-lg font-bold text-slate-100">Decision Engine (Logic-State Machine)</h3>
      </div>
      <p className="text-xs text-slate-400 mb-5">
        Interprets detected geometry coordinates to calculate instantaneous screen-relative coordinates and outputs instructions to the hardware hands.
      </p>

      {/* Control Configuration Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-lg border border-slate-800 mb-5">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
            Aim Target Priority Logic
          </label>
          <div className="space-y-1.5">
            {[
              { id: 'closest', label: 'Distance: Closest to Crosshair Center' },
              { id: 'highest_confidence', label: 'Confidence: Highest YOLO Score' },
              { id: 'priority_head', label: 'Anatomy: Priority Headshot Hitbox' }
            ].map(strategy => (
              <label
                key={strategy.id}
                className={`flex items-center justify-between p-2 rounded border cursor-pointer text-xs transition-colors ${
                  aimMode === strategy.id
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="strategymode"
                    checked={aimMode === strategy.id}
                    onChange={() => onAimModeChange(strategy.id as any)}
                    className="accent-amber-500 h-3.5 w-3.5"
                  />
                  <span>{strategy.label}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
              Aim Smoothing Interpolation
            </span>
            <span className="text-[11px] font-mono font-bold text-amber-400">{aimSmoothing}ms</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal mb-3">
            Lower latency decreases reaction times. Higher values simulate organic human movement drag, minimizing twitch bans by EAC algorithms.
          </p>
          <input
            type="range"
            min="0"
            max="180"
            step="10"
            value={aimSmoothing}
            onChange={e => onAimSmoothingChange(Number(e.target.value))}
            className="w-full accent-amber-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
            <span>Instantaneous (0ms)</span>
            <span>Organic human-like (180ms)</span>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-900 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-300">Automatic Trigger Bot</span>
              <span className="text-[10px] text-slate-500">Fire clicks immediately on lock target</span>
            </div>
            <button
              onClick={onToggleAutoAim}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autoAimEnabled ? 'bg-amber-500' : 'bg-slate-800'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-slate-950 transition-transform ${
                  autoAimEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Recommended Output Action */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recommendation Box */}
        <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-2">
              Decision State Output
            </div>
            {recommendedTarget ? (
              <div>
                <div className="flex items-center gap-1.5 text-slate-200 font-semibold text-xs">
                  <span className="inline-block w-2-h-2 bg-emerald-500 rounded-full animate-ping"></span>
                  Action Recommended: Target ID {recommendedTarget.id}
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  The YOLO model has confidently resolved a suitable target ({recommendedTarget.className}) situated at coordinate coordinates.
                </p>
                <div className="mt-3 text-[11px] font-mono space-y-1 text-amber-500 bg-amber-500/5 p-2 rounded border border-amber-500/10">
                  <div>X: {Math.round(recommendedTarget.x + recommendedTarget.width / 2)}% | Y: {Math.round(recommendedTarget.y + recommendedTarget.height / 2)}%</div>
                  <div>Relative Target: [Offset: {Math.round(recommendedTarget.x + recommendedTarget.width / 2 - 50)}px, {Math.round(recommendedTarget.y + recommendedTarget.height / 2 - 50)}px]</div>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-[11px] text-slate-400 italic">No recommended action (Awaiting viable target feed...)</div>
              </div>
            )}
          </div>
          {recommendedTarget && !activeTargetId && (
            <button
              onClick={() => onTargetSelect(recommendedTarget!.id)}
              className="mt-4 w-full py-2 bg-slate-900 border border-slate-800 rounded hover:bg-slate-800 transition-colors text-xs text-slate-200 text-center font-semibold"
            >
              Command Aim Target Locked
            </button>
          )}
        </div>

        {/* Current State Indicator */}
        <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-2">
              Active Control Instructions
            </div>
            {activeTarget ? (
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs text-rose-400 font-bold">
                  <Zap className="w-4 h-4 text-rose-500 animate-pulse animate-bounce" />
                  LOCKED ON TARGET (ID: {activeTarget.id})
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Coordinates offset:</span>
                    <span className="font-mono text-slate-200">
                      dx: {Math.round(activeTarget.x + activeTarget.width / 2 - 50)}, dy:{' '}
                      {Math.round(activeTarget.y + activeTarget.height / 2 - 50)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Target anatomy:</span>
                    <span className="font-mono text-slate-200 capitalize">
                      {activeTarget.className.replace('enemy_', '')}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Triggerbot status:</span>
                    <span
                      className={`font-mono text-xs font-semibold ${
                        autoAimEnabled ? 'text-emerald-400' : 'text-slate-500'
                      }`}
                    >
                      {autoAimEnabled ? 'READY / ARMED' : 'DISABLED'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic">
                Awaiting manual aim lock or Strategy Trigger instruction override.
              </div>
            )}
          </div>
          {activeTargetId && (
            <button
              onClick={() => onTargetSelect(null)}
              className="mt-4 w-full py-2 bg-rose-950/20 text-rose-400 border border-rose-900/30 rounded hover:bg-rose-950/40 transition-colors text-xs text-center font-semibold"
            >
              Abort Target Calibration Lock
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
