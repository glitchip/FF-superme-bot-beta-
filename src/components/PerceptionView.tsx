import React from 'react';
import { Play, Pause, RefreshCw, Layers, ShieldAlert, Cpu, Heart, Target } from 'lucide-react';
import { DetectionObject, SimulationMetric } from '../types';

interface PerceptionProps {
  currentScene: { image: string; title: string; description: string; objects: DetectionObject[] };
  confidenceThreshold: number;
  onTargetSelect: (id: string | null) => void;
  activeTargetId: string | null;
  selectedCoordinates: { x: number; y: number } | null;
}

export const PerceptionView: React.FC<PerceptionProps> = ({
  currentScene,
  confidenceThreshold,
  onTargetSelect,
  activeTargetId,
  selectedCoordinates
}) => {
  const [showBoundingBoxes, setShowBoundingBoxes] = React.useState(true);
  const [showConfidenceLabels, setShowConfidenceLabels] = React.useState(true);
  const [showHUDOverlay, setShowHUDOverlay] = React.useState(true);

  // Filter objects by confidence threshold
  const filteredObjects = currentScene.objects.filter(obj => obj.confidence >= confidenceThreshold);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Perception Layer (YOLO Real-Time Inference)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Simulated YOLOv8/v10 computer vision object classification & bounding box localization
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
            className={`px-2.5 py-1.5 rounded font-medium border transition-colors ${
              showBoundingBoxes
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-slate-800 text-slate-400 border-transparent'
            }`}
          >
            Bounding Boxes
          </button>
          <button
            onClick={() => setShowConfidenceLabels(!showConfidenceLabels)}
            className={`px-2.5 py-1.5 rounded font-medium border transition-colors ${
              showConfidenceLabels
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-slate-800 text-slate-400 border-transparent'
            }`}
          >
            Labels & Scores
          </button>
          <button
            onClick={() => setShowHUDOverlay(!showHUDOverlay)}
            className={`px-2.5 py-1.5 rounded font-medium border transition-colors ${
              showHUDOverlay
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-800 text-slate-400 border-transparent'
            }`}
          >
            Crosshair HUD
          </button>
        </div>
      </div>

      {/* Frame Viewer Container */}
      <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-slate-950 bg-slate-950 group select-none">
        <img
          src={currentScene.image}
          alt={currentScene.title}
          className="w-full h-full object-cover opacity-85 transition-opacity"
          referrerPolicy="no-referrer"
        />

        {/* HUD Crosshair Center */}
        {showHUDOverlay && (
          <div className="absolute inset-x-0 inset-y-0 pointer-events-none flex items-center justify-center">
            {/* Outer Circle */}
            <div className="w-24 h-24 rounded-full border border-teal-500/30 flex items-center justify-center relative">
              {/* Inner Circle */}
              <div className="w-10 h-10 rounded-full border border-teal-400/50 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
              </div>
              {/* Tick marks */}
              <div className="absolute top-0 w-0.5 h-2 bg-teal-400/60"></div>
              <div className="absolute bottom-0 w-0.5 h-2 bg-teal-400/60"></div>
              <div className="absolute left-0 w-2 h-0.5 bg-teal-400/60"></div>
              <div className="absolute right-0 w-2 h-0.5 bg-teal-400/60"></div>
            </div>
            {/* Diagnostics label */}
            <div className="absolute bottom-4 left-4 font-mono text-[10px] text-teal-400/80 bg-slate-950/80 px-2 py-1 rounded border border-teal-500/20">
              HUD FEED: 1920x1080 @ 60HZ
            </div>
          </div>
        )}

        {/* Dynamic Aim Vector Path Line */}
        {selectedCoordinates && (
          <svg className="absolute inset-0 pointer-events-none w-full h-full z-10">
            <line
              x1="50%"
              y1="50%"
              x2={`${selectedCoordinates.x}%`}
              y2={`${selectedCoordinates.y}%`}
              stroke="#f43f5e"
              strokeWidth="2"
              strokeDasharray="4 2"
              className="animate-[dash_10s_linear_infinite]"
            />
            <circle
              cx={`${selectedCoordinates.x}%`}
              cy={`${selectedCoordinates.y}%`}
              r="4"
              fill="#f43f5e"
              className="animate-ping"
            />
          </svg>
        )}

        {/* Bounding Box Renderings */}
        {showBoundingBoxes &&
          filteredObjects.map(obj => {
            const isActive = activeTargetId === obj.id;
            const borderColors = {
              enemy_standing: isActive ? 'border-rose-500 ring-2 ring-rose-500/45' : 'border-rose-400',
              enemy_crouching: isActive ? 'border-orange-500 ring-2 ring-orange-500/45' : 'border-orange-400',
              enemy_head: isActive ? 'border-red-600 ring-2 ring-red-600/45' : 'border-red-500',
              weapon_crate: 'border-yellow-400',
              player_hud: 'border-blue-400'
            };

            const classLabels = {
              enemy_standing: 'Enemy (Standing)',
              enemy_crouching: 'Enemy (Crouched)',
              enemy_head: 'HITBOX: HEAD',
              weapon_crate: 'Weapon Crate',
              player_hud: 'HUD Element'
            };

            const bgColors = {
              enemy_standing: isActive ? 'bg-rose-950/40' : 'bg-rose-500/10',
              enemy_crouching: isActive ? 'bg-orange-950/40' : 'bg-orange-500/10',
              enemy_head: isActive ? 'bg-red-950/50' : 'bg-red-500/20',
              weapon_crate: 'bg-yellow-500/10',
              player_hud: 'bg-blue-500/10'
            };

            return (
              <div
                key={obj.id}
                onClick={() => onTargetSelect(isActive ? null : obj.id)}
                className={`absolute cursor-pointer rounded-sm border select-none transition-all duration-150 ${
                  bgColors[obj.className]
                } ${borderColors[obj.className]}`}
                style={{
                  left: `${obj.x}%`,
                  top: `${obj.y}%`,
                  width: `${obj.width}%`,
                  height: `${obj.height}%`
                }}
              >
                {/* Confidence Label / Name tag */}
                {showConfidenceLabels && (
                  <div
                    className={`absolute -top-5 left-0 px-1 py-0.5 rounded text-[9px] font-bold text-white whitespace-nowrap z-20 flex items-center gap-1 ${
                      isActive ? 'bg-rose-600' : 'bg-slate-900/90 border border-slate-700'
                    }`}
                  >
                    {isActive && <Target className="w-2.5 h-2.5 text-yellow-300" />}
                    <span>{classLabels[obj.className]}</span>
                    <span className="text-emerald-400">{(obj.confidence * 100).toFixed(0)}%</span>
                  </div>
                )}

                {/* Inside crosshairs corner accents */}
                {isActive && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full relative">
                      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-yellow-300"></div>
                      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-yellow-300"></div>
                      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-yellow-300"></div>
                      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-yellow-300"></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* Frame Info & Target Selector Assistance list */}
      <div className="mt-4 p-3 bg-slate-950 rounded-lg border border-slate-800">
        <div className="text-xs font-semibold text-slate-300 mb-2">Detected Objects in Sight:</div>
        {filteredObjects.length === 0 ? (
          <div className="text-xs text-slate-500 italic py-1 text-center">
            No objects detected above current confidence limit. Try lowering the threshold.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {filteredObjects.map(obj => (
              <button
                key={obj.id}
                onClick={() => onTargetSelect(activeTargetId === obj.id ? null : obj.id)}
                className={`flex items-center justify-between p-2 rounded text-left transition-colors text-xs border ${
                  activeTargetId === obj.id
                    ? 'bg-rose-500/15 border-rose-500/50 text-rose-300'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      obj.className === 'enemy_head'
                        ? 'bg-red-500'
                        : obj.className.startsWith('enemy')
                        ? 'bg-rose-400'
                        : 'bg-yellow-400'
                    }`}
                  ></span>
                  <span className="font-mono">ID:{obj.id}</span>
                  <span className="capitalize">{obj.className.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-300 font-mono">{(obj.confidence * 100).toFixed(0)}%</span>
                  {activeTargetId === obj.id ? (
                    <span className="text-[10px] bg-rose-500 text-white px-1 rounded">Targeted</span>
                  ) : (
                    <span className="text-[9px] text-slate-500 px-1 border border-slate-700 rounded hover:bg-slate-800">
                      Aim
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-center">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Resolution</div>
          <div className="text-sm font-bold text-slate-200 mt-0.5">1920 x 1080</div>
        </div>
        <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-center">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Inference Time</div>
          <div className="text-sm font-bold text-amber-400 mt-0.5">~12.4 ms</div>
        </div>
        <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-center">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">YOLO Architecture</div>
          <div className="text-sm font-bold text-slate-200 mt-0.5">v8 / v10 Standard</div>
        </div>
        <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-center">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Input Device</div>
          <div className="text-sm font-bold text-emerald-400 mt-0.5">Screen Framegrab</div>
        </div>
      </div>
    </div>
  );
};
