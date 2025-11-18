import { commitIcons } from './theme/colors.js';

export interface CommitType {
  value: string;
  name: string;
  description: string;
}

export interface CommitConfig {
  types?: CommitType[];
  scopes?: string[];
  allowCustomScopes?: boolean;
  maxSubjectLength?: number;
  minSubjectLength?: number;
  ai?: AIConfig;
}

export interface CommitAnswers {
  type: string;
  scope: string;
  subject: string;
  body?: string;
  breaking?: boolean;
  breakingDescription?: string;
}

export interface CommitStats {
  total: number;
  conventional: number;
  nonConventional: number;
  percentage: number;
  typeBreakdown: Record<string, number>;
}

// ============================================
// AI Configuration Types
// ============================================

export type AIProvider = 'ollama' | 'mistral' | 'openai' | 'disabled';

export interface AIConfig {
  enabled?: boolean;
  provider?: AIProvider;

  // Ollama configuration
  ollama?: {
    model?: string;
    baseUrl?: string;
    timeout?: number;
  };

  // Mistral API configuration
  mistral?: {
    apiKey?: string;
    model?: string;
    baseUrl?: string;
  };

  // OpenAI API configuration
  openai?: {
    apiKey?: string;
    model?: string;
    baseUrl?: string;
  };

  // Generation parameters
  temperature?: number;
  maxTokens?: number;

  // Behavior
  autoSuggest?: boolean;  // Suggère automatiquement dans le workflow
  requireConfirmation?: boolean;  // Demande confirmation avant d'utiliser la suggestion
}

export interface AIGeneratedCommit {
  type: string;
  scope?: string;
  subject: string;
  body?: string;
  breaking?: boolean;
  breakingDescription?: string;
  confidence?: number;  // 0-100
  reasoning?: string;   // Pourquoi l'AI a choisi ces valeurs
}

export const DEFAULT_TYPES: CommitType[] = [
  {
    value: 'feat',
    name: `feat:     ${commitIcons.feat} Nouvelle fonctionnalité`,
    description: 'Une nouvelle fonctionnalité',
  },
  {
    value: 'fix',
    name: `fix:      ${commitIcons.fix} Correction de bug`,
    description: 'Une correction de bug',
  },
  {
    value: 'docs',
    name: `docs:     ${commitIcons.docs} Documentation`,
    description: 'Changements de documentation uniquement',
  },
  {
    value: 'style',
    name: `style:    ${commitIcons.style} Style`,
    description: 'Changements qui n\'affectent pas le sens du code (espaces, formatage, etc.)',
  },
  {
    value: 'refactor',
    name: `refactor: ${commitIcons.refactor} Refactoring`,
    description: 'Changement de code qui ne corrige pas de bug ni n\'ajoute de fonctionnalité',
  },
  {
    value: 'perf',
    name: `perf:     ${commitIcons.perf} Performance`,
    description: 'Amélioration des performances',
  },
  {
    value: 'test',
    name: `test:     ${commitIcons.test} Tests`,
    description: 'Ajout ou modification de tests',
  },
  {
    value: 'build',
    name: `build:    ${commitIcons.build} Build`,
    description: 'Changements qui affectent le système de build ou les dépendances',
  },
  {
    value: 'ci',
    name: `ci:       ${commitIcons.ci} CI`,
    description: 'Changements dans les fichiers de configuration CI',
  },
  {
    value: 'chore',
    name: `chore:    ${commitIcons.chore} Chore`,
    description: 'Autres changements qui ne modifient pas les fichiers src ou test',
  },
  {
    value: 'revert',
    name: `revert:   ${commitIcons.revert} Revert`,
    description: 'Annulation d\'un commit précédent',
  },
];

export const DEFAULT_AI_CONFIG: AIConfig = {
  enabled: false,
  provider: 'ollama',
  ollama: {
    model: 'mistral:7b',
    baseUrl: 'http://localhost:11434',
    timeout: 30000,
  },
  mistral: {
    model: 'mistral-small-latest',
    baseUrl: 'https://api.mistral.ai',
  },
  openai: {
    model: 'gpt-4o-mini',
    baseUrl: 'https://api.openai.com',
  },
  temperature: 0.3,
  maxTokens: 500,
  autoSuggest: false,
  requireConfirmation: true,
};

export const DEFAULT_CONFIG: CommitConfig = {
  types: DEFAULT_TYPES,
  scopes: [],
  allowCustomScopes: true,
  maxSubjectLength: 100,
  minSubjectLength: 3,
  ai: DEFAULT_AI_CONFIG,
};
