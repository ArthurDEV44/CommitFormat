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

export const DEFAULT_TYPES: CommitType[] = [
  {
    value: 'feat',
    name: 'feat:     ✨ Nouvelle fonctionnalité',
    description: 'Une nouvelle fonctionnalité',
  },
  {
    value: 'fix',
    name: 'fix:      🐛 Correction de bug',
    description: 'Une correction de bug',
  },
  {
    value: 'docs',
    name: 'docs:     📝 Documentation',
    description: 'Changements de documentation uniquement',
  },
  {
    value: 'style',
    name: 'style:    💄 Style',
    description: 'Changements qui n\'affectent pas le sens du code (espaces, formatage, etc.)',
  },
  {
    value: 'refactor',
    name: 'refactor: ♻️  Refactoring',
    description: 'Changement de code qui ne corrige pas de bug ni n\'ajoute de fonctionnalité',
  },
  {
    value: 'perf',
    name: 'perf:     ⚡️ Performance',
    description: 'Amélioration des performances',
  },
  {
    value: 'test',
    name: 'test:     ✅ Tests',
    description: 'Ajout ou modification de tests',
  },
  {
    value: 'build',
    name: 'build:    📦 Build',
    description: 'Changements qui affectent le système de build ou les dépendances',
  },
  {
    value: 'ci',
    name: 'ci:       👷 CI',
    description: 'Changements dans les fichiers de configuration CI',
  },
  {
    value: 'chore',
    name: 'chore:    🔧 Chore',
    description: 'Autres changements qui ne modifient pas les fichiers src ou test',
  },
  {
    value: 'revert',
    name: 'revert:   ⏪ Revert',
    description: 'Annulation d\'un commit précédent',
  },
];

export const DEFAULT_CONFIG: CommitConfig = {
  types: DEFAULT_TYPES,
  scopes: [],
  allowCustomScopes: true,
  maxSubjectLength: 100,
  minSubjectLength: 3,
};
