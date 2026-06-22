export interface DetectionObject {
  id: string;
  className: 'enemy_standing' | 'enemy_crouching' | 'enemy_head' | 'weapon_crate' | 'player_hud';
  x: number; // percentage width (0-100)
  y: number; // percentage height (0-100)
  width: number; // percentage width
  height: number; // percentage height
  confidence: number;
}

export interface SimulationMetric {
  fps: number;
  inferenceLatency: number; // in ms
  detectedCount: number;
  activeTargetId: string | null;
  aimingVectorX: number;
  aimingVectorY: number;
}

export interface TrainingConfig {
  epochs: number;
  batchSize: number;
  imageSize: number;
  learningRate: number;
  augmentations: {
    mosaic: boolean;
    mixup: boolean;
    colorJitter: boolean;
    scale: boolean;
  };
}

export interface TrainingLogEntry {
  epoch: number;
  boxLoss: number;
  clsLoss: number;
  dflLoss: number;
  mAP50: number;
  mAP50_95: number;
  elapsedTime: string;
}

export interface CustomModel {
  id: string;
  name: string;
  precision: number;
  recall: number;
  mAP50: number;
  fileSize: string;
  epochCompleted: number;
  targets: string[];
}
