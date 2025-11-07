// Auto-generated NAPI wrapper for uzu native module
// Currently supports only Apple Silicon (arm64) on macOS
// Other platforms may be added in future releases

const { createRequire } = require('module');

const require_ = createRequire(__filename);

// Check for Apple Silicon support only
if (process.platform !== 'darwin' || process.arch !== 'arm64') {
  throw new Error(`This package only supports Apple Silicon (arm64) on macOS. Current platform: ${process.platform}-${process.arch}`);
}

let nativeBinding = null;

try {
  nativeBinding = require_('./uzu.node');
} catch (e) {
  throw new Error(`Failed to load native binding: ${e.message}`);
}

// Re-export all runtime exports
const {
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

module.exports = {
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
};