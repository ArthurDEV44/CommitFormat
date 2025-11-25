/**
 * Verifier Agent Prompts - Phase 2
 * Factual accuracy verification against the real diff
 */

import type { DiffAnalysis } from "../../domain/services/DiffAnalyzer.js";

/**
 * Interface pour le résultat de vérification factuelle (Verifier Agent - Phase 2)
 */
export interface VerificationResult {
  factualAccuracy: number; // 0-100: Score de précision factuelle
  hasCriticalIssues: boolean; // true si hallucinations ou erreurs critiques
  issues: Array<{
    type: "hallucination" | "omission" | "inaccuracy";
    severity: "critical" | "major" | "minor";
    description: string;
    evidence: string; // Preuve depuis le diff
  }>;
  verifiedSymbols: string[]; // Symboles mentionnés ET présents dans le diff
  missingSymbols: string[]; // Symboles importants dans le diff mais non mentionnés
  hallucinatedSymbols: string[]; // Symboles mentionnés mais absents du diff
  recommendations: string[]; // Actions pour corriger
  reasoning: string; // Explication de la vérification
}

/**
 * Génère le prompt système pour le Verifier Agent
 * Vérifie la précision factuelle du commit par rapport au diff réel
 */
export function generateVerifierSystemPrompt(): string {
  return `Tu es un VERIFIER strict. Ta tâche : comparer le commit avec le DIFF réel pour détecter hallucinations/erreurs.

VÉRIFICATIONS OBLIGATOIRES:

1. HALLUCINATION (critique):
   - Le commit mentionne des composants/classes/fonctions QUI N'EXISTENT PAS dans le diff
   - Exemple: "Add UserService" mais UserService n'apparaît nulle part

2. OMISSION (major):
   - Le commit OMET des composants MAJEURS du diff
   - Exemple: Diff modifie 3 fichiers importants, commit n'en mentionne qu'1

3. INEXACTITUDE (major/minor):
   - Le commit décrit incorrectement la NATURE du changement
   - Exemple: Dit "refactor" mais c'est clairement une "feature"

Retourne JSON (SANS \`\`\`json):
{
  "factualAccuracy": number (0-100),
  "hasCriticalIssues": boolean,
  "issues": [
    {
      "type": "hallucination" | "omission" | "inaccuracy",
      "severity": "critical" | "major" | "minor",
      "description": "string",
      "evidence": "string"
    }
  ],
  "verifiedSymbols": ["string"],
  "missingSymbols": ["string"],
  "hallucinatedSymbols": ["string"],
  "recommendations": ["string"],
  "reasoning": "string"
}

Règles:
- factualAccuracy = 100 si AUCUNE hallucination, TOUS symboles majeurs mentionnés
- hasCriticalIssues = true si au moins 1 hallucination OU factualAccuracy < 70
- Sois TRÈS strict sur les hallucinations (severity: "critical")`;
}

/**
 * Génère le prompt utilisateur pour le Verifier Agent
 */
export function generateVerifierUserPrompt(
  commit: {
    type: string;
    scope?: string;
    subject: string;
    body?: string;
  },
  diff: string,
  analysis: DiffAnalysis,
): string {
  const parts: string[] = [];

  parts.push("COMMIT À VÉRIFIER:");
  parts.push(`Type: ${commit.type}`);
  parts.push(`Subject: ${commit.subject}`);
  if (commit.body) {
    parts.push(`Body: ${commit.body}`);
  }
  parts.push("");

  parts.push("DIFF RÉEL (source de vérité):");
  parts.push("```");
  // Limiter le diff pour ne pas dépasser les tokens
  const truncatedDiff =
    diff.length > 8000
      ? diff.substring(0, 8000) + "\n... [diff tronqué]"
      : diff;
  parts.push(truncatedDiff);
  parts.push("```");
  parts.push("");

  parts.push("ANALYSE STRUCTURÉE (référence):");
  parts.push(`- Fichiers: ${analysis.summary.filesChanged}`);
  parts.push(
    `- Pattern: ${analysis.changePatterns[0]?.type ?? "unknown"}`,
  );

  if (analysis.modifiedSymbols.length > 0) {
    parts.push(
      `- Symboles RÉELS modifiés (${analysis.modifiedSymbols.length} total):`,
    );
    analysis.modifiedSymbols.slice(0, 10).forEach((sym) => {
      parts.push(`  * ${sym.name} (${sym.type})`);
    });
    if (analysis.modifiedSymbols.length > 10) {
      parts.push(
        `  ... et ${analysis.modifiedSymbols.length - 10} autres`,
      );
    }
  }
  parts.push("");

  parts.push("QUESTIONS DE VÉRIFICATION:");
  parts.push(
    "1. HALLUCINATION: Le commit mentionne-t-il des composants absents du diff?",
  );
  parts.push(
    "2. OMISSION: Le commit omet-il des symboles majeurs du diff?",
  );
  parts.push(
    "3. EXACTITUDE: Le type et la description correspondent-ils au pattern détecté?",
  );
  parts.push("");
  parts.push("Compare rigoureusement le commit avec le diff. Sois STRICT.");

  return parts.join("\n");
}
