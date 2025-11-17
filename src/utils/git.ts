import { simpleGit, SimpleGit, LogResult } from 'simple-git';
import type { CommitStats } from '../types.js';
import { isConventionalCommit, parseConventionalCommit } from './validate.js';

const git: SimpleGit = simpleGit();

/**
 * Vérifie si on est dans un repo Git
 */
export async function isGitRepository(): Promise<boolean> {
  try {
    await git.revparse(['--git-dir']);
    return true;
  } catch {
    return false;
  }
}

/**
 * Vérifie s'il y a des changements à commiter
 */
export async function hasChanges(): Promise<boolean> {
  const status = await git.status();
  return status.files.length > 0;
}

/**
 * Récupère les fichiers modifiés
 */
export async function getModifiedFiles(): Promise<string[]> {
  const status = await git.status();
  return status.files.map(file => file.path);
}

/**
 * Stage tous les fichiers
 */
export async function stageAll(): Promise<void> {
  await git.add('.');
}

/**
 * Crée un commit avec le message donné
 */
export async function createCommit(message: string): Promise<void> {
  await git.commit(message);
}

/**
 * Récupère l'historique des commits
 */
export async function getCommitHistory(maxCount: number = 100): Promise<LogResult> {
  return await git.log({ maxCount });
}

/**
 * Analyse les statistiques des commits
 */
export async function analyzeCommitStats(maxCount: number = 100): Promise<CommitStats> {
  const log = await getCommitHistory(maxCount);
  const commits = log.all;

  let conventional = 0;
  const typeBreakdown: Record<string, number> = {};

  for (const commit of commits) {
    const message = commit.message;

    if (isConventionalCommit(message)) {
      conventional++;

      const parsed = parseConventionalCommit(message);
      if (parsed) {
        typeBreakdown[parsed.type] = (typeBreakdown[parsed.type] || 0) + 1;
      }
    }
  }

  const total = commits.length;
  const nonConventional = total - conventional;
  const percentage = total > 0 ? (conventional / total) * 100 : 0;

  return {
    total,
    conventional,
    nonConventional,
    percentage,
    typeBreakdown,
  };
}

/**
 * Récupère le chemin du dossier .git
 */
export async function getGitDir(): Promise<string> {
  const gitDir = await git.revparse(['--git-dir']);
  return gitDir.trim();
}
