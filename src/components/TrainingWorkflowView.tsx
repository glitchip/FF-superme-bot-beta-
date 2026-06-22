import React from 'react';
import { Play, Pause, RefreshCw, Layers, CheckCircle2, AlertTriangle, FileSpreadsheet, Eye, EyeOff, Bot } from 'lucide-react';
import { TrainingConfig, TrainingLogEntry, CustomModel } from '../types';
import { INITIAL_TRAINING_LOGS, INITIAL_CUSTOM_MODELS } from '../data';

interface TrainingProps {
  customModels: CustomModel[];
  onAddCustomModel: (model: CustomModel) => void;
  onActivateModel: (id: string) => void;
  activeModelId: string;
}

export const TrainingWorkflowView: React.FC<TrainingProps> = ({
  customModels,
  onAddCustomModel,
  onActivateModel,
  activeModelId
}) => {
  // Config state
  const [config, setConfig] = React.useState<TrainingConfig>({
    epochs: 100,
    batchSize: 16,
    imageSize: 640,
    learningRate: 0.01,
    augmentations: {
      mosaic: true,
      mixup: false,
      colorJitter: true,
      scale: true
    }
  });

  // Training simulation state
  const [isTraining, setIsTraining] = React.useState(false);
  const [currentEpoch, setCurrentEpoch] = React.useState(0);
  const [trainingLogs, setTrainingLogs] = React.useState<TrainingLogEntry[]>(INITIAL_TRAINING_LOGS);
  const [trainingProgress, setTrainingProgress] = React.useState(0);

  // Form state for creating custom model classes
  const [classesInput, setClassesInput] = React.useState('enemy_standing, enemy_crouching, enemy_head');
  const [modelType, setModelType] = React.useState<'YOLOv8' | 'YOLOv10'>('YOLOv8');
  const [modelNameInput, setModelNameInput] = React.useState('MyCustomModel');

  // Ref or interval tracking
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  const startTrainingSimulation = () => {
    if (isTraining) return;
    setIsTraining(true);
    setCurrentEpoch(1);
    setTrainingProgress(0);
    setTrainingLogs([
      {
        epoch: 1,
        boxLoss: 1.5,
        clsLoss: 2.1,
        dflLoss: 1.4,
        mAP50: 0.32,
        mAP50_95: 0.15,
        elapsedTime: '0s'
      }
    ]);

    let epochCount = 1;
    intervalRef.current = setInterval(() => {
      epochCount += 1;
      setCurrentEpoch(epochCount);

      // Simulate training losses with a noisy descent, mAPs ascending
      const progressFactor = epochCount / 10; // scale standard decay
      const boxLoss = Math.max(0.35, Number((1.5 - progressFactor * 0.12 + Math.random() * 0.08).toFixed(2)));
      const clsLoss = Math.max(0.42, Number((2.1 - progressFactor * 0.17 + Math.random() * 0.1).toFixed(2)));
      const dflLoss = Math.max(0.55, Number((1.4 - progressFactor * 0.09 + Math.random() * 0.05).toFixed(2)));
      const mAP50 = Math.min(0.99, Number((0.32 + progressFactor * 0.068 + Math.random() * 0.02).toFixed(3)));
      const mAP50_95 = Math.min(0.85, Number((0.15 + progressFactor * 0.062 + Math.random() * 0.015).toFixed(3)));

      const timeString = `${Math.floor((epochCount * 13) / 60)}m ${(epochCount * 13) % 60}s`;

      const newLog: TrainingLogEntry = {
        epoch: epochCount,
        boxLoss,
        clsLoss,
        dflLoss,
        mAP50,
        mAP50_95,
        elapsedTime: timeString
      };

      setTrainingLogs(prev => [...prev, newLog]);
      setTrainingProgress(Math.min(100, Math.round((epochCount / 10) * 100)));

      if (epochCount >= 10) {
        clearInterval(intervalRef.current!);
        setIsTraining(false);

        // Auto compile the trained result weights as a mock file store entry
        const finalMap50 = mAP50;
        const finalMap50_95 = mAP50_95;

        const newTargetClasses = classesInput
          .split(',')
          .map(c => c.trim().toLowerCase())
          .filter(c => c.length > 0);

        const trainedModel: CustomModel = {
          id: `custom_${Date.now()}`,
          name: `${modelType}-${modelNameInput} (Trained)`,
          precision: Number((0.85 + Math.random() * 0.12).toFixed(2)),
          recall: Number((0.83 + Math.random() * 0.13).toFixed(2)),
          mAP50: finalMap50,
          fileSize: modelType === 'YOLOv8' ? '12.4 MB' : '28.1 MB',
          epochCompleted: config.epochs,
          targets: newTargetClasses.length > 0 ? newTargetClasses : ['enemy_standing']
        };

        onAddCustomModel(trainedModel);
      }
    }, 1500);
  };

  const stopTrainingSimulation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsTraining(false);
  };

  React.useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="p-1 px-2.5 rounded bg-amber-500/10 text-amber-500 font-mono text-xs font-semibold">Store</span>
        <h3 className="text-lg font-bold text-slate-100">AI Model Training & Model Store</h3>
      </div>
      <p className="text-xs text-slate-400 mb-5">
        To deploy your AI to subsequent games or target scopes, gather game-specific frames, annotate them using CVAT, and train the YOLO weights container.
      </p>

      {/* Model Store & Custom Swapping */}
      <div className="mb-6 p-4 bg-slate-950 rounded-lg border border-slate-800">
        <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono mb-3">
          Available Trained Weights (.pt models)
        </div>
        <div className="space-y-2.5">
          {customModels.map(model => {
            const isActive = activeModelId === model.id;
            return (
              <div
                key={model.id}
                className={`p-3.5 rounded-lg border transition-all ${
                  isActive
                    ? 'bg-amber-500/5 border-amber-500/50 text-amber-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <div className="font-semibold text-sm text-slate-200 flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-amber-500' : 'bg-slate-600'}`}></span>
                      {model.name}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Classes: {model.targets.map(t => `'${t}'`).join(', ')}
                    </div>
                  </div>
                  <div className="flex items-center gap-3自 text-xs font-mono">
                    <div className="text-right">
                      <div className="text-slate-300">mAP50: {model.mAP50.toFixed(3)}</div>
                      <div className="text-[10px] text-slate-500">Filesize: {model.fileSize}</div>
                    </div>
                    <button
                      onClick={() => onActivateModel(model.id)}
                      disabled={isActive}
                      className={`px-3 py-1.5 rounded transition-colors text-xs font-semibold ${
                        isActive
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20 cursor-default'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      }`}
                    >
                      {isActive ? 'Active Engine' : 'Deploy Model'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive training configuration simulator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-xs">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono mb-3">
            Hyperparameters Configuration (YOLOv8/v10)
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="block text-slate-400 mb-1.5">YOLO Architecture Version</label>
              <div className="flex gap-2">
                {['YOLOv8', 'YOLOv10'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setModelType(type as any)}
                    className={`flex-1 py-1.5 rounded font-mono text-center transition-colors border ${
                      modelType === type
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Epochs count</label>
                <input
                  type="number"
                  value={config.epochs}
                  onChange={e => setConfig({ ...config, epochs: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded p-1.5 font-mono text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Image size px</label>
                <input
                  type="number"
                  value={config.imageSize}
                  onChange={e => setConfig({ ...config, imageSize: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded p-1.5 font-mono text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Custom Annotation Labels (separated by comma)</label>
              <input
                type="text"
                value={classesInput}
                onChange={e => setClassesInput(e.target.value)}
                placeholder="enemy_standing, enemy_crouching"
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded p-1.5 font-mono text-xs focus:ring-1 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Export Model Name</label>
              <input
                type="text"
                value={modelNameInput}
                onChange={e => setModelNameInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded p-1.5 font-mono text-xs focus:ring-1 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1.5">Data Augmentation Mixins</label>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                {Object.keys(config.augmentations).map(key => {
                  const val = config.augmentations[key as keyof typeof config.augmentations];
                  return (
                    <label
                      key={key}
                      className="flex items-center gap-1.5 p-1.5 bg-slate-900 border border-slate-900 rounded cursor-pointer hover:border-slate-800"
                    >
                      <input
                        type="checkbox"
                        checked={val}
                        onChange={() =>
                          setConfig({
                            ...config,
                            augmentations: {
                              ...config.augmentations,
                              [key]: !val
                            }
                          })
                        }
                        className="accent-amber-500"
                      />
                      <span className="capitalize">{key}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {isTraining ? (
              <button
                type="button"
                onClick={stopTrainingSimulation}
                className="w-full mt-2 py-2 bg-red-950/20 text-red-400 border border-red-900/40 rounded font-semibold text-center hover:bg-red-950/40 transition-colors"
              >
                Cancel Training Loop
              </button>
            ) : (
              <button
                type="button"
                onClick={startTrainingSimulation}
                className="w-full mt-2 py-2 bg-amber-500 text-slate-950 rounded font-bold text-center hover:bg-amber-400 transition-colors flex items-center justify-center gap-1.5"
              >
                <Bot className="w-4 h-4 cursor-pointer" />
                Launch Google Colab AutoML Session
              </button>
            )}
          </div>
        </div>

        {/* Realtime progress tracker */}
        <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                Training Progression Log (Live Feed)
              </span>
              {isTraining && (
                <span className="text-[10px] bg-amber-500 text-slate-950 px-1 py-0.5 rounded font-bold animate-pulse">
                  GPU RUNNING
                </span>
              )}
            </div>

            {isTraining ? (
              <div className="space-y-4">
                {/* Horizontal Progress Bar */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Compiling weights...</span>
                    <span>{trainingProgress}% (Epoch {currentEpoch}/10)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full transition-all duration-300"
                      style={{ width: `${trainingProgress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Training Stats Table */}
                <div className="bg-slate-900 rounded border border-slate-800 overflow-hidden text-[10px] font-mono">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-950 border-b border-slate-800 text-slate-500">
                        <th className="p-1.5">Epoch</th>
                        <th className="p-1.5">Box Loss</th>
                        <th className="p-1.5 font-bold">mAP50</th>
                        <th className="p-1.5">Recall</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-400">
                      {trainingLogs.slice(-4).map((log, idx) => (
                        <tr key={idx} className="border-b border-slate-950 hover:bg-slate-800/40">
                          <td className="p-1.5">{log.epoch}</td>
                          <td className="p-1.5 text-rose-400">{log.boxLoss}</td>
                          <td className="p-1.5 text-emerald-400 font-bold">{log.mAP50}</td>
                          <td className="p-1.5">{log.mAP50_95}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="text-[10px] text-slate-500 leading-normal flex items-start gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>
                    Upon completion, the synthesized weight file (.pt) is compiled and serialized directly into the local Model Store above.
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 py-6 text-center text-xs text-slate-500">
                <p>Google Colab GPU session is currently unassigned.</p>
                <p className="max-w-[280px] mx-auto text-[11px] text-slate-600">
                  Select your parameters on the left and click "Launch AutoML" to simulate real cloud-based backpropagation weight tuning.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-900 mt-4">
            <div className="text-[11px] text-slate-400 font-mono">
              <span className="text-slate-500">Annotation Standards:</span> COCO/YOLO TXT format with coordinates represented as normalized center indices.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
