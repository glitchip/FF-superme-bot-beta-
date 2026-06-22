import React from 'react';
import { Smartphone, Monitor, ShieldCheck, Zap, ToggleLeft, Activity, PlaySquare } from 'lucide-react';

interface ActionProps {
  autoAimEnabled: boolean;
  activeTargetId: string | null;
  selectedCoordinates: { x: number; y: number } | null;
  aimSmoothing: number;
}

export const ActionControllerView: React.FC<ActionProps> = ({
  autoAimEnabled,
  activeTargetId,
  selectedCoordinates,
  aimSmoothing
}) => {
  const [deviceType, setDeviceType] = React.useState<'adb' | 'directinput'>('adb');
  const [apiLogs, setApiLogs] = React.useState<string[]>([
    '[INIT] Abstraction Controller Layer loaded',
    '[STANDBY] Awaiting logical command inputs...'
  ]);
  const [isFiring, setIsFiring] = React.useState(false);

  // Periodic simulated low-level log output based on active state
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeTargetId && selectedCoordinates) {
      interval = setInterval(() => {
        const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
        const randDelay = Math.floor(Math.random() * 5) + 3;

        const newLogs = [];
        if (deviceType === 'adb') {
          // ADB Mobile Commands
          newLogs.push(`[${timestamp}] [ADB_SEND] shell input touchscreen swipe 960 540 ${Math.round(selectedCoordinates.x * 19.2)} ${Math.round(selectedCoordinates.y * 10.8)} ${aimSmoothing}ms`);
          if (autoAimEnabled) {
            newLogs.push(`[${timestamp}] [ADB_SEND] shell input tap 1550 820 (Virtual Fire Trigger)`);
            setIsFiring(true);
            setTimeout(() => setIsFiring(false), 150);
          }
        } else {
          // PC DirectInput Mouse Event APIs
          newLogs.push(`[${timestamp}] [WIN_API] mouse_event(MOUSEEVENTF_MOVE, dx: ${Math.round((selectedCoordinates.x - 50) * 8)}, dy: ${Math.round((selectedCoordinates.y - 50) * 8)})`);
          if (autoAimEnabled) {
            newLogs.push(`[${timestamp}] [WIN_API] keybd_event(VK_LBUTTON, click_down, click_up)`);
            setIsFiring(true);
            setTimeout(() => setIsFiring(false), 150);
          }
        }

        setApiLogs(prev => [newLogs[0], ...(newLogs[1] ? [newLogs[1]] : []), ...prev.slice(0, 10)]);
      }, 1400);
    } else {
      interval = setInterval(() => {
        const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
        setApiLogs(prev => [`[${timestamp}] [HEARTBEAT] No target lock. Low-level driver awaiting coordinate packet...`, ...prev.slice(0, 10)]);
      }, 4000);
    }

    return () => clearInterval(interval);
  }, [activeTargetId, selectedCoordinates, deviceType, autoAimEnabled, aimSmoothing]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="p-1 px-2.5 rounded bg-rose-500/10 text-rose-500 font-mono text-xs font-semibold">Hands</span>
          <h3 className="text-lg font-bold text-slate-100">Action Controller (Hardware Abstraction)</h3>
        </div>
        <div className="flex bg-slate-950 p-0.5 rounded border border-slate-800 text-xs">
          <button
            onClick={() => setDeviceType('adb')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium transition-colors ${
              deviceType === 'adb' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'text-slate-400'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            ADB (Android Mobile)
          </button>
          <button
            onClick={() => setDeviceType('directinput')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium transition-colors ${
              deviceType === 'directinput' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'text-slate-400'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            DirectInput (PC OS)
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-400 mb-5">
        Transmutes decisions into platform-compliant hardware/virtual events. Swap drivers dynamically below:
      </p>

      {/* Driver status visualizer card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-center">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Driver Status</div>
          <div className="text-xs font-bold text-emerald-400 mt-1 flex items-center justify-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
            ACTIVE / SECURE
          </div>
        </div>
        <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-center">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Simulation Mode</div>
          <div className="text-xs font-bold text-slate-300 mt-1 uppercase">
            {deviceType === 'adb' ? 'Android Shell Tap' : 'WinAPI Virtual Mouse'}
          </div>
        </div>
        <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-center relative overflow-hidden">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Hardware Trigger-Bot</div>
          <div
            className={`text-xs font-bold mt-1 transition-all ${
              isFiring ? 'text-red-500 scale-110' : 'text-slate-400'
            }`}
          >
            {isFiring ? '🔥 CLICK_DOWN (FIRE)' : 'IDLE WAIT'}
          </div>
          {isFiring && <div className="absolute inset-x-0 bottom-0 h-1 bg-red-500 animate-pulse"></div>}
        </div>
      </div>

      {/* Driver Console Shell Log */}
      <div className="bg-slate-950 rounded-lg border border-slate-950 overflow-hidden">
        <div className="flex justify-between items-center bg-slate-900 px-4 py-2 border-b border-slate-950/40 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded bg-red-500"></span>
            <span>driver_console_stdout.log</span>
          </div>
          <button
            onClick={() => setApiLogs([])}
            className="text-[10px] bg-slate-950 hover:bg-slate-800 px-2 py-0.5 rounded text-slate-400 transition-colors"
          >
            Clear Shell Output
          </button>
        </div>
        <div className="p-4 font-mono text-[11px] text-slate-400 space-y-1.5 max-h-56 overflow-y-auto select-text scrollbar-thin scrollbar-thumb-slate-800">
          {apiLogs.length === 0 ? (
            <div className="text-slate-600 italic">Terminals cleared. Waiting for actions...</div>
          ) : (
            apiLogs.map((log, index) => {
              let colorClass = 'text-slate-400';
              if (log.includes('[ADB_SEND]') || log.includes('[WIN_API]')) {
                colorClass = 'text-amber-300';
              } else if (log.includes('tap') || log.includes('VK_LBUTTON')) {
                colorClass = 'text-rose-400 font-semibold';
              } else if (log.includes('[INIT]') || log.includes('[HEARTBEAT]')) {
                colorClass = 'text-slate-500';
              }
              return (
                <div key={index} className={`${colorClass} hover:bg-slate-900/40 px-1 rounded transition-colors`}>
                  {log}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
