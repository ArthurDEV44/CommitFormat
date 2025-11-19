/**
 * Repository Interfaces exports
 * Define contracts for data access and external services
 */

export {
  type IGitRepository,
  type FileStatus,
  type CommitInfo,
  type DiffContext,
} from './IGitRepository.js';

export {
  type IAIProvider,
  type AIGenerationContext,
  type AIGenerationResult,
} from './IAIProvider.js';
