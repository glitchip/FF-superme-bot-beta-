import React from 'react';
import { HelpCircle, Terminal, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

export const EducationGuideView: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-300">
      <div className="flex items-center gap-2 mb-4">
        <span className="p-1 px-2.5 rounded bg-blue-500/10 text-blue-400 font-mono text-xs font-semibold">Docs</span>
        <h3 className="text-lg font-bold text-slate-100">Educational blueprint: Real-World Architecture</h3>
      </div>
      <p className="text-xs text-slate-400 mb-6 leading-relaxed">
        This sandbox demonstrates a game-agnostic framework structure designed for high-performance screen analytics and computer vision operations. Implementing this on standard systems involves three separate conceptual components:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
        {/* Layer 1 */}
        <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="font-bold text-slate-200 mb-2 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500"></span>
              Perception Layer
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Continuously grabs screen frames from the display subsystem using DXGI Desktop Duplication (Windows) or ADB screencap streams (Android). The frame gets sized down and executed through a trained YOLOv8/v10 inference pipeline to produce coordinate matrices.
            </p>
          </div>
          <div className="mt-4 font-mono text-[9px] text-slate-500">
            Tech stack: Python, OpenCV, PyTorch, TensorRT, Ultralytics YOLO
          </div>
        </div>

        {/* Layer 2 */}
        <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="font-bold text-slate-200 mb-2 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500"></span>
              Decision Engine
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Filters coordinate matrices based on bounding box geometry. Implements target prediction vectors based on linear extrapolation of history frames, prioritizes anatomy sections (such as head vs center mass), and applies smoothing parameters to make cursors act organically.
            </p>
          </div>
          <div className="mt-4 font-mono text-[9px] text-slate-500">
            Tech stack: State Machines, Kalman Filtering, Linear Interpolation (Lerp)
          </div>
        </div>

        {/* Layer 3 */}
        <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="font-bold text-slate-200 mb-2 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              Action Controller
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Receives screen coordinates offsets and issues mouse/touch actions. To bypass anti-cheat mechanisms, developers often utilize low-level direct kernel drivers (Windows C++ Win32 API / DirectInput) or Android shell interfaces via ADB.
            </p>
          </div>
          <div className="mt-4 font-mono text-[9px] text-slate-500">
            Tech stack: Win32 API, ctypes, PyAutoGUI, DirectInput, ADB ADB shell input
          </div>
        </div>
      </div>

      {/* Guide details step validation */}
      <div className="mt-6 p-4 bg-slate-950 rounded-lg border border-slate-800">
        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest font-mono mb-3">
          Step-by-Step Training Instruction Lifecycle
        </h4>
        <ol className="space-y-3.5 text-xs">
          <li className="flex items-start gap-2 text-[11px]">
            <span className="flex items-center justify-center bg-slate-900 border border-slate-700 font-mono font-bold text-[10px] w-5 h-5 rounded shrink-0">1</span>
            <div>
              <strong className="text-slate-300">Assemble Video Assets</strong>
              <p className="text-slate-500">Record in-game frames under divergent conditions—high-contrast direct sunlight, shadows, elevated peaks outposts—and cut them down into clean static JPEG frames.</p>
            </div>
          </li>
          <li className="flex items-start gap-2 text-[11px]">
            <span className="flex items-center justify-center bg-slate-900 border border-slate-700 font-mono font-bold text-[10px] w-5 h-5 rounded shrink-0">2</span>
            <div>
              <strong className="text-slate-300">Coordinate Annotation Annotation</strong>
              <p className="text-slate-500">Upload raw assets into CVAT or Roboflow. Draw tight bounding boxes around targets, assigning label indices (e.g. 0: enemy_standing, 1: enemy_head). Export in YOLO annotation text files format.</p>
            </div>
          </li>
          <li className="flex items-start gap-2 text-[11px]">
            <span className="flex items-center justify-center bg-slate-900 border border-slate-700 font-mono font-bold text-[10px] w-5 h-5 rounded shrink-0">3</span>
            <div>
              <strong className="text-slate-300">GPU Deep Learning Backpropagation</strong>
              <p className="text-slate-500">Instantiate the YOLO notebook on Google Colab, mount Drive datasets, and run training: `yolo task=detect mode=train model=yolov8n.pt data=dataset.yaml epochs=100`. Acquire the custom compiled weights `best.pt` file from the output directory.</p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
};
