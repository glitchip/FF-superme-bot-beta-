import React from 'react';
import { ShieldCheck, Target, Heart, Cpu, BrainCircuit, RefreshCw, Zap, Sliders, ChevronRight, Play, Pause, Smartphone, Monitor } from 'lucide-react';
import { DetectionObject, CustomModel, SimulationMetric } from './types';
import { GAME_STATES, INITIAL_CUSTOM_MODELS } from './data';
import { PerceptionView } from './components/PerceptionView';
import { DecisionEngineView } from './components/DecisionEngineView';
import { ActionControllerView } from './components/ActionControllerView';
import { TrainingWorkflowView } from './components/TrainingWorkflowView';
import { EducationGuideView } from './components/EducationGuideView';

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = React.useState<'live' | 'train' | 'guide'>('live');

  // Master AI Simulation Engine state
  const [isAgentActive, setIsAgentActive] = React.useState(false);

  // Interactive configurations
  const [currentSceneIndex, setCurrentSceneIndex] = React.useState(0);
  const [confidenceThreshold, setConfidenceThreshold] = React.useState(0.70);
  const [activeTargetId, setActiveTargetId] = React.useState<string | null>(null);

  // Decision state metrics
  const [autoAimEnabled, setAutoAimEnabled] = React.useState(true);
  const [aimSmoothing, setAimSmoothing] = React.useState(60);
  const [aimMode, setAimMode] = React.useState<'closest' | 'highest_confidence' | 'priority_head'>('priority_head');

  // Custom models catalog state
  const [customModels, setCustomModels] = React.useState<CustomModel[]>(INITIAL_CUSTOM_MODELS);
  const [activeModelId, setActiveModelId] = React.useState<string>('m2');

  const currentScene = GAME_STATES[currentSceneIndex];

  // Continuous targeting loop when AI Agent is active
  React.useEffect(() => {
    if (!isAgentActive) return;

    const interval = setInterval(() => {
      // Find filtered enemies inside current scene
      const eligible = currentScene.objects.filter(
        obj => obj.confidence >= confidenceThreshold && obj.className.startsWith('enemy')
      );

      if (eligible.length === 0) {
        // Automatically scan next scene if no visible enemies
        setCurrentSceneIndex(prev => (prev + 1) % GAME_STATES.length);
        setActiveTargetId(null);
        return;
      }

      // If no target is selected, pick the recommended priority head hitbox or closest
      if (!activeTargetId || !eligible.some(e => e.id === activeTargetId)) {
        const headTarget = eligible.find(obj => obj.className === 'enemy_head');
        setActiveTargetId(headTarget ? headTarget.id : eligible[0].id);
      } else {
        // Cycle to next enemy target or progress to next battlefield frame
        const currentIdx = eligible.findIndex(e => e.id === activeTargetId);
        if (currentIdx < eligible.length - 1) {
          setActiveTargetId(eligible[currentIdx + 1].id);
        } else {
          setCurrentSceneIndex(prev => (prev + 1) % GAME_STATES.length);
          setActiveTargetId(null);
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isAgentActive, currentSceneIndex, confidenceThreshold, activeTargetId]);

  // Derive coordinates mapping based on currently highlighted target item
  const selectedObject = currentScene.objects.find(obj => obj.id === activeTargetId && obj.confidence >= confidenceThreshold);
  const selectedCoordinates = selectedObject
    ? {
        x: selectedObject.x + selectedObject.width / 2,
        y: selectedObject.y + selectedObject.height / 2
      }
    : null;

  const handleTargetSelect = (id: string | null) => {
    setActiveTargetId(id);
  };

  const handleAddCustomModel = (model: CustomModel) => {
    setCustomModels(prev => [model, ...prev]);
  };

  const handleActivateModel = (id: string) => {
    setActiveModelId(id);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none selection:bg-amber-500/20 selection:text-amber-300">
      {/* Top Navigation Headers */}
      <header className="bg-slate-900 border-b border-slate-800 py-3.5 px-6 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center shadow-lg shadow-amber-500/10">
                <Target className="w-5 h-5 text-slate-950" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-[7px]" title="Neural Processing Active"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500 font-mono bg-amber-500/10 px-1.5 py-0.5 rounded">
                  Framework
                </span>
                <span className="text-[10px] text-slate-400 font-mono">v1.2.0</span>
              </div>
              <h1 className="text-md sm:text-lg font-black tracking-tight text-white mt-0.5">
                Game-Agnostic Neural Agent Sandbox
              </h1>
            </div>
          </div>

          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs text-slate-400 gap-1 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('live')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'live' ? 'bg-amber-500 text-slate-950' : 'hover:text-slate-200'
              }`}
            >
              Live Calibration
            </button>
            <button
              onClick={() => setActiveTab('train')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'train' ? 'bg-amber-500 text-slate-950' : 'hover:text-slate-200'
              }`}
            >
              Model Store & Train
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'guide' ? 'bg-amber-500 text-slate-950' : 'hover:text-slate-200'
              }`}
            >
              Architecture Blueprint
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Tab View switching */}
        {activeTab === 'live' && (
          <div className="space-y-6 animate-[fade-in_0.3s_ease]">
            {/* BIG PROMINENT MASTER START/RUN OVERRIDE BUTTON */}
            <div id="master-pilot-card" className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 border border-amber-500/20 rounded-xl p-5 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -z-10 group-hover:bg-amber-500/10 transition-colors"></div>
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full inline-block ${isAgentActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500 animate-[pulse_1.5s_infinite]'}`} />
                    <span className="text-[10px] uppercase font-mono font-bold text-amber-500 tracking-widest bg-amber-500/5 border border-amber-500/10 px-2 py-0.5 rounded">
                      Inference Engine Status
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2 mt-1">
                    {isAgentActive ? 'AI targeting loop is live and tracking...' : 'AI targeting engine is currently offline'}
                  </h2>
                  <p className="text-xs text-slate-400 max-w-xl">
                    Launching the engine initiates automatic real-time computer vision framegrabbing simulation. The AI will scan the selected battlefield, calculate screen center relative offsets, and simulate driver command mouse clicks immediately.
                  </p>
                </div>

                <div className="w-full lg:w-auto shrink-0">
                  <button
                    id="master-start-stop-btn"
                    onClick={() => setIsAgentActive(!isAgentActive)}
                    className={`w-full lg:w-auto px-8 py-3.5 rounded-lg flex items-center justify-center gap-3 font-extrabold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-lg outline-none ${
                      isAgentActive
                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/20 border border-rose-500'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-950/20 border border-emerald-400'
                    }`}
                  >
                    {isAgentActive ? (
                      <>
                        <Pause className="w-4 h-4 cursor-pointer" fill="currentColor" />
                        STOP AI TARGETING ENGINE
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 cursor-pointer" fill="currentColor" />
                        LAUNCH AUTOMATED AGENT MATCHPOINT
                      </>
                    )}
                  </button>
                  <div className="text-[10px] text-center text-slate-500 font-mono mt-1.5 uppercase">
                    {isAgentActive ? '🔴 Continuous Framegrabbing Active' : '⚪ Engine Standing By'}
                  </div>
                </div>
              </div>

              {/* Status Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 pt-4 border-t border-slate-900 text-[11px] font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Video source:</span>
                  <span className="text-slate-200 font-semibold">{currentScene.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Processing weight:</span>
                  <span className="text-amber-400 font-semibold uppercase">{activeModelId === 'm2' ? 'YOLOv10 Deep-Net' : 'Custom WeightsLoaded'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Inference Frequency:</span>
                  <span className={`${isAgentActive ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>{isAgentActive ? '12.4ms (60 FPS)' : '0ms (Paused)'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Trigger bot clicks:</span>
                  <span className="text-slate-300 font-semibold">{autoAimEnabled ? 'READY / ARMED' : 'DISABLED'}</span>
                </div>
              </div>
            </div>

            {/* Dashboard top stats / controls bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-900 border border-slate-800 p-5 rounded-xl">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">
                  Input Stream Selection
                </label>
                <div className="space-y-1.5">
                  {GAME_STATES.map((scene, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentSceneIndex(idx);
                        setActiveTargetId(null);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded text-left transition-colors text-xs border ${
                        currentSceneIndex === idx
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
                      }`}
                    >
                      <span>{scene.title}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                    YOLO Confidence Filter
                  </label>
                  <span className="text-xs font-bold text-amber-500 font-mono">{(confidenceThreshold * 100).toFixed(0)}%</span>
                </div>
                <p className="text-[11px] text-slate-500 mb-3.5 leading-normal">
                  Suppresses bounding boxes below the custom threshold. Useful for removing screen noise and HUD false detections.
                </p>
                <input
                  type="range"
                  min="0.50"
                  max="0.95"
                  step="0.05"
                  value={confidenceThreshold}
                  onChange={e => {
                    setConfidenceThreshold(Number(e.target.value));
                    setActiveTargetId(null); // Reset highlighted targets on adjust
                  }}
                  className="w-full accent-amber-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>High Sensitivity (50%)</span>
                  <span>Strict Precision (95%)</span>
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">
                    Active System Weights
                  </label>
                  <div className="p-3 bg-slate-950 rounded border border-slate-800 text-xs">
                    <div className="font-semibold text-slate-200">
                      {customModels.find(m => m.id === activeModelId)?.name || 'YOLOv10 Deep-Net'}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 font-mono">
                      Output mapping size: [640x640] tensors. Custom game targets enabled.
                    </div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 leading-normal mt-2">
                  Double-click or press buttons on bounding boxes directly to lock active system aim cursors.
                </div>
              </div>
            </div>

            {/* Main Interactive Layer Stack */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PerceptionView
                currentScene={currentScene}
                confidenceThreshold={confidenceThreshold}
                onTargetSelect={handleTargetSelect}
                activeTargetId={activeTargetId}
                selectedCoordinates={selectedCoordinates}
              />

              <div className="space-y-6">
                <DecisionEngineView
                  currentScene={currentScene}
                  confidenceThreshold={confidenceThreshold}
                  activeTargetId={activeTargetId}
                  onTargetSelect={handleTargetSelect}
                  autoAimEnabled={autoAimEnabled}
                  onToggleAutoAim={() => setAutoAimEnabled(!autoAimEnabled)}
                  aimSmoothing={aimSmoothing}
                  onAimSmoothingChange={setAimSmoothing}
                  aimMode={aimMode}
                  onAimModeChange={setAimMode}
                />

                <ActionControllerView
                  autoAimEnabled={autoAimEnabled}
                  activeTargetId={activeTargetId}
                  selectedCoordinates={selectedCoordinates}
                  aimSmoothing={aimSmoothing}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'train' && (
          <div className="animate-[fade-in_0.3s_ease]">
            <TrainingWorkflowView
              customModels={customModels}
              onAddCustomModel={handleAddCustomModel}
              onActivateModel={handleActivateModel}
              activeModelId={activeModelId}
            />
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="animate-[fade-in_0.3s_ease]">
            <EducationGuideView />
          </div>
        )}
      </main>

      {/* Persistent Disclaimer & Core Integrity Info Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-4 px-6 text-xs text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" />
            <span>Educational sandbox designed to illustrate computer vision state machines.</span>
          </div>
          <div className="font-mono text-[10px] text-slate-500">
            System status: Sandbox offline emulation mode | Hardware Abstraction layer safe
          </div>
        </div>
      </footer>
    </div>
  );
}
