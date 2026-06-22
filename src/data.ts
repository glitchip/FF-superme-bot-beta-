import { DetectionObject, TrainingLogEntry } from './types';

export const GAME_STATES = [
  {
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800',
    title: 'Peak Outpost Combat Scene',
    description: 'Active battle situation inside a warehouse complex. Enemy positions span multiple elevations.',
    objects: [
      { id: '1', className: 'enemy_standing', x: 42, y: 35, width: 8, height: 22, confidence: 0.91 },
      { id: '2', className: 'enemy_head', x: 44, y: 36, width: 3, height: 4, confidence: 0.94 },
      { id: '3', className: 'enemy_crouching', x: 68, y: 52, width: 10, height: 16, confidence: 0.85 }
    ] as DetectionObject[]
  },
  {
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800',
    title: 'Bermuda Foothills & Shrubbery',
    description: 'Open country engagement with long-range targets obscured by tree trunks and shadows.',
    objects: [
      { id: '4', className: 'enemy_crouching', x: 25, y: 45, width: 6, height: 12, confidence: 0.87 },
      { id: '5', className: 'enemy_standing', x: 55, y: 40, width: 5, height: 15, confidence: 0.74 }
    ] as DetectionObject[]
  },
  {
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=800',
    title: 'Kalahari Desert Dunes',
    description: 'Desert survival scenario with heavy dust interference and high sun glare reducing contrast.',
    objects: [
      { id: '6', className: 'enemy_standing', x: 48, y: 48, width: 4, height: 10, confidence: 0.89 },
      { id: '7', className: 'enemy_standing', x: 78, y: 42, width: 5, height: 12, confidence: 0.95 },
      { id: '8', className: 'enemy_head', x: 79, y: 43, width: 2, height: 3, confidence: 0.96 }
    ] as DetectionObject[]
  }
];

export const INITIAL_TRAINING_LOGS: TrainingLogEntry[] = [
  { epoch: 1, boxLoss: 1.42, clsLoss: 1.85, dflLoss: 1.25, mAP50: 0.452, mAP50_95: 0.210, elapsedTime: '2m 14s' },
  { epoch: 2, boxLoss: 1.28, clsLoss: 1.54, dflLoss: 1.12, mAP50: 0.589, mAP50_95: 0.315, elapsedTime: '2m 09s' },
  { epoch: 3, boxLoss: 1.15, clsLoss: 1.32, dflLoss: 1.01, mAP50: 0.694, mAP50_95: 0.402, elapsedTime: '2m 11s' },
  { epoch: 4, boxLoss: 1.01, clsLoss: 1.11, dflLoss: 0.92, mAP50: 0.768, mAP50_95: 0.485, elapsedTime: '2m 10s' },
  { epoch: 5, boxLoss: 0.89, clsLoss: 0.94, dflLoss: 0.85, mAP50: 0.831, mAP50_95: 0.540, elapsedTime: '2m 12s' },
  { epoch: 6, boxLoss: 0.78, clsLoss: 0.81, dflLoss: 0.79, mAP50: 0.885, mAP50_95: 0.612, elapsedTime: '2m 08s' },
  { epoch: 7, boxLoss: 0.69, clsLoss: 0.72, dflLoss: 0.72, mAP50: 0.914, mAP50_95: 0.655, elapsedTime: '2m 13s' },
  { epoch: 8, boxLoss: 0.62, clsLoss: 0.64, dflLoss: 0.68, mAP50: 0.932, mAP50_95: 0.691, elapsedTime: '2m 09s' },
  { epoch: 9, boxLoss: 0.55, clsLoss: 0.58, dflLoss: 0.64, mAP50: 0.948, mAP50_95: 0.718, elapsedTime: '2m 11s' },
  { epoch: 10, boxLoss: 0.48, clsLoss: 0.51, dflLoss: 0.59, mAP50: 0.962, mAP50_95: 0.742, elapsedTime: '2m 10s' }
];

export const INITIAL_CUSTOM_MODELS = [
  { id: 'm1', name: 'YOLOv8-FF-Nano (Fast)', precision: 0.92, recall: 0.89, mMAP: 0.912, mAP50: 0.915, fileSize: '6.2 MB', epochCompleted: 100, targets: ['enemy_standing', 'enemy_crouching'] },
  { id: 'm2', name: 'YOLOv10-FF-Medium (Precise)', precision: 0.96, recall: 0.94, mMAP: 0.951, mAP50: 0.958, fileSize: '32.4 MB', epochCompleted: 100, targets: ['enemy_standing', 'enemy_crouching', 'enemy_head'] }
];
