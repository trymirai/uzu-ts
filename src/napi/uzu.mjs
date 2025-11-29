// Auto-generated NAPI wrapper for uzu native module
// Currently supports only Apple Silicon (arm64) on macOS
// Other platforms may be added in future releases

import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Check for Apple Silicon support only
if (process.platform !== 'darwin' || process.arch !== 'arm64') {
  throw new Error(`This package only supports Apple Silicon (arm64) on macOS. Current platform: ${process.platform}-${process.arch}`);
}

let nativeBinding = null;

try {
  nativeBinding = require('./uzu.node');
} catch (e) {
  throw new Error(`Failed to load native binding: ${e.message}`);
}

// Re-export all runtime exports as named exports  
export const {
  ChatSession,
  Engine,
  ModelDownloadHandle,
  ProgressStream,
  ProgressUpdate,
  FinishReason,
  ModelDownloadPhase,
  ModelType,
  Role,
  version,
  ChatModel,
  ClassificationFeature,
  Config,
  Message,
  ModelDownloadState,
  Output,
  ParsedText,
  RunConfig,
  RunStats,
  Stats,
  StepStats,
  Text,
  TotalStats,
  AsyncBatchSize,
  ContextLength,
  ContextMode,
  Input,
  LicenseStatus,
  ModelStorageError,
  PrefillStepSize,
  Preset,
  SamplingMethod,
  SamplingPolicy,
  SamplingSeed,
  StorageError
} = nativeBinding;

// Also provide default export
export default nativeBinding;