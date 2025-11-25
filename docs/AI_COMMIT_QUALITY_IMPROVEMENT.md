# Amélioration de la Qualité des Messages de Commit - Gortex CLI

> **Date**: 2025-11-25
> **Version**: 1.0
> **Objectif**: Proposer des pistes d'implémentation concrètes pour maximiser la qualité des messages de commit générés par Gortex CLI

---

## Table des Matières

1. [Résumé Exécutif](#résumé-exécutif)
2. [État des Lieux - Analyse de l'Implémentation Actuelle](#état-des-lieux---analyse-de-limplémentation-actuelle)
3. [Meilleures Pratiques Identifiées (2025)](#meilleures-pratiques-identifiées-2025)
4. [Approches Agentiques pour la Génération de Commits](#approches-agentiques-pour-la-génération-de-commits)
5. [Optimisations pour Environnements à Ressources Limitées](#optimisations-pour-environnements-à-ressources-limitées)
6. [Recommandations d'Implémentation](#recommandations-dimplémentation)
7. [Feuille de Route Progressive](#feuille-de-route-progressive)
8. [Références et Sources](#références-et-sources)

---

## Résumé Exécutif

### Points Clés

L'analyse approfondie révèle que **Gortex CLI dispose déjà d'une architecture solide** avec plusieurs techniques avancées :
- ✅ Analyse structurée de diff (DiffAnalyzer)
- ✅ Chain-of-Thought reasoning
- ✅ Self-verification
- ✅ Few-shot learning avec exemples annotés
- ✅ Détection de patterns de changement

### Opportunités d'Amélioration Identifiées

Les recherches 2025 mettent en évidence **trois axes majeurs** d'amélioration :

1. **Approche Agentique Multi-Étapes** (Impact: 🔥🔥🔥 Élevé)
   - Workflow itératif avec réflexion et correction
   - Meilleure compréhension du contexte architectural
   - Performance prouvée sur des tâches complexes

2. **Modèles Légers Optimisés** (Impact: 🔥🔥 Moyen-Élevé)
   - SmolLM-135M, TinyLlama-1.1B pour machines limitées
   - Quantification et optimisation pour edge devices
   - Latence réduite (3-8 secondes vs 15-30 secondes)

3. **Analyse de Diff Avancée** (Impact: 🔥🔥 Moyen)
   - Parsing AST avec Tree-Sitter ou Difftastic
   - Analyse sémantique vs syntaxique
   - Détection précise des refactorings et impacts

---

## État des Lieux - Analyse de l'Implémentation Actuelle

### Architecture Actuelle

Gortex CLI utilise une **approche en pipeline** sophistiquée :

```
┌──────────────────┐
│  Staged Changes  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐     1. DIFF ANALYSIS
│   DiffAnalyzer   │────► Extraction de symboles (classes, fonctions)
└────────┬─────────┘     Detection de patterns (feat, fix, refactor)
         │                Analyse de complexité
         ▼                Relationships entre fichiers
┌──────────────────┐
│ Chain-of-Thought │────► 2. REASONING ANALYSIS
│   (Optional)     │      Contexte architectural
└────────┬─────────┘      Intention du changement
         │                Nature et symboles clés
         ▼
┌──────────────────┐     3. COMMIT GENERATION
│  AI Generation   │────► Prompt structuré avec contexte
│  (Ollama/etc)    │      Few-shot examples
└────────┬─────────┘      Project style analysis
         │
         ▼
┌──────────────────┐     4. SELF-VERIFICATION
│  Verification    │────► Validation qualité
│   (Optional)     │      Amélioration itérative
└────────┬─────────┘      Vérification contraintes (100 chars)
         │
         ▼
┌──────────────────┐
│  Final Commit    │
│    Message       │
└──────────────────┘
```

### Points Forts de l'Implémentation Actuelle

#### 1. Analyse de Diff Structurée (DiffAnalyzer)

**Localisation**: `src/domain/services/DiffAnalyzer.ts`

**Capacités actuelles**:
- ✅ Extraction de symboles modifiés (fonctions, classes, interfaces, types, constantes)
- ✅ Détection de 11 patterns de changement (test, bug fix, refactoring, feature, docs, etc.)
- ✅ Analyse de relations entre fichiers (imports)
- ✅ Évaluation de complexité (simple, moderate, complex)
- ✅ Classification d'importance des fichiers (high, medium, low)
- ✅ Support multi-langages (TypeScript, JavaScript, Python, Go)

**Exemple de sortie**:
```typescript
{
  modifiedSymbols: [
    { file: "src/domain/services/DiffAnalyzer.ts", name: "DiffAnalyzer", type: "class" },
    { file: "src/domain/services/DiffAnalyzer.ts", name: "analyze", type: "method" }
  ],
  changePatterns: [
    { type: "feature_addition", description: "New 2 classes or services", confidence: 0.8, count: 150 },
    { type: "test_addition", description: "Added 5 test cases", confidence: 0.5, count: 5 }
  ],
  complexity: "moderate",
  summary: { filesChanged: 3, linesAdded: 150, linesRemoved: 20, totalChanges: 170 }
}
```

#### 2. Prompt Engineering Avancé

**Localisation**: `src/ai/prompts/commit-message.ts`

**Techniques utilisées**:
- ✅ **Structured Context**: XML-like tags pour organiser l'information
- ✅ **Few-Shot Learning**: Exemples annotés de qualité avec scores
- ✅ **Project Style Analysis**: Apprentissage du style du projet
- ✅ **Semantic Guidelines**: Règles strictes pour éviter messages techniques
- ✅ **Reasoning Analysis**: Intégration Chain-of-Thought optionnelle

**Exemple de prompt système**:
```
Tu es un assistant expert en Git et Conventional Commits.

IMPORTANT: Tu recevras une analyse structurée du diff qui identifie:
- Les fonctions, classes et symboles modifiés (avec leurs NOMS EXACTS)
- Les patterns de changement détectés
- Les relations entre fichiers
- La complexité globale

RÈGLES STRICTES pour un message SÉMANTIQUE:
1. FOCUS SUR LE CONCEPT, pas les chemins de fichiers
   ❌ INTERDIT: "update src/domain/services/DiffAnalyzer.ts"
   ✅ REQUIS: "structured diff analysis for AI commit generation"
2. NOMME les composants/classes/systèmes créés ou modifiés
3. DÉCRIS la transformation ou l'intention
```

#### 3. Chain-of-Thought Reasoning (Optionnel)

**Capacité**: Analyse intermédiaire pour guider la génération

**Structure**:
```typescript
interface ReasoningAnalysis {
  architecturalContext: string;    // Couche/Module affecté
  changeIntention: string;          // Pourquoi le changement
  changeNature: string;             // Type et impact
  keySymbols: string[];             // Symboles centraux
  suggestedType: string;            // Type de commit suggéré
  complexityJustification: string;  // Justification
}
```

#### 4. Self-Verification (Optionnel)

**Capacité**: Évaluation et amélioration post-génération

**Critères vérifiés**:
- Subject sémantique (pas de généralisations)
- Limite 100 caractères stricte
- Body expliquant le POURQUOI
- Symboles clés mentionnés
- Type cohérent avec pattern détecté

### Limites de l'Approche Actuelle

Malgré la qualité de l'implémentation, plusieurs **limitations** peuvent être identifiées :

1. **Analyse de Diff Basée sur Regex** ⚠️
   - Parsing ligne par ligne avec expressions régulières
   - Pas de compréhension structurelle du code (AST)
   - Difficulté à détecter des refactorings complexes
   - Limitations multi-langages

2. **Workflow Séquentiel Non-Itératif** ⚠️
   - Une seule passe de génération (avec verification optionnelle)
   - Pas de boucle de raffinement automatique
   - Pas d'auto-critique approfondie

3. **Dépendance aux Modèles Disponibles** ⚠️
   - Performance liée à la qualité du modèle (Ollama/Mistral/OpenAI)
   - Pas d'optimisation pour modèles légers spécifiques
   - Configuration fixe (température, etc.)

4. **Contexte Limité pour Grands Diffs** ⚠️
   - Risque de dépassement du context window
   - Pas de résumé sémantique pour très gros diffs
   - Analyse peut devenir superficielle

---

## Meilleures Pratiques Identifiées (2025)

### 1. Standards de Qualité - Consensus Communauté

D'après les recherches récentes, les développeurs s'accordent sur plusieurs principes :

#### A. Le Rôle de l'IA : Assistance vs Remplacement

> **Citation clé (2025)**: "A key distinction emerged between using AI to review and enhance human-written commit messages versus completely outsourcing the writing of commit messages to AI, with many developers expressing openness to the former while strongly opposing the latter."

**Implication pour Gortex CLI**:
- ✅ Maintenir l'approche interactive avec confirmation utilisateur
- ✅ Offrir des suggestions que l'utilisateur peut éditer
- ❌ Ne pas automatiser complètement sans review humaine

#### B. Conventional Commits comme Fondation

> **Standard**: "The Conventional Commits specification is a lightweight convention on top of commit messages that provides an easy set of rules for creating an explicit commit history."

**Gortex CLI implémente déjà**: ✅
- Format `<type>(<scope>): <subject>`
- Validation en temps réel
- Types standardisés (feat, fix, refactor, etc.)

#### C. Contexte et Intention > Détails d'Implémentation

> **Principe**: "Commit messages should focus on higher-level context that isn't obvious from the code changes themselves."

**Exemples de qualité**:
```
❌ BAD:  "update UserService.ts and add tests"
✅ GOOD: "add email validation in user registration flow"

❌ BAD:  "refactor code"
✅ GOOD: "extract UserValidator class from UserService for testability"

❌ BAD:  "fix bug in authentication"
✅ GOOD: "fix JWT token expiration check in refresh flow"
```

**Gortex CLI implémente**: ✅ (via semantic guidelines)

#### D. Review Humaine Obligatoire

> **Consensus**: "It's important to review the generated messages to ensure they accurately represent your changes."

**Best practice**:
- Toujours montrer le message avant commit
- Permettre édition facile
- Expliquer le raisonnement (field `reasoning`)

**Gortex CLI implémente**: ✅ (workflow interactif)

### 2. Techniques d'Amélioration de Qualité

#### A. Structured Output (JSON)

> **Technique**: "Structured output involves asking the model to respond in a particular JSON format, which allows for programmatic extraction of commit message components."

**Avantage**:
- Parsing fiable
- Validation automatique
- Métadonnées riches (confidence, reasoning)

**Gortex CLI implémente**: ✅

#### B. Few-Shot Learning avec Exemples de Qualité

> **Technique**: "Many AI tools analyze staged files and create conventional commit messages that follow best practices."

**Format recommandé** (déjà implémenté):
```xml
<few_shot_examples>
  <example quality="5/5">
    <change_summary>Added DiffAnalyzer service for structured diff analysis</change_summary>
    <commit_message>
      <type>feat</type>
      <scope>ai</scope>
      <subject>structured diff analysis for AI commit generation</subject>
      <body>
        Introduce DiffAnalyzer service to extract meaningful metadata from diffs.

        The analyzer detects modified symbols, change patterns, and file relationships
        to provide structured context for AI-generated commit messages.
      </body>
    </commit_message>
    <reasoning>
      This is a feature addition introducing a new service. The subject focuses
      on the capability (structured diff analysis) rather than file names.
      The body explains why and how it improves AI generation.
    </reasoning>
  </example>
</few_shot_examples>
```

**Gortex CLI implémente**: ✅ (via `commit-samples.ts`)

#### C. Analysis Avant Génération

> **Research**: "Researchers use encoder-decoder architectures, similar to those used for code summarization, to generate commit messages from git diffs."

**Approche en 2 étapes**:
1. **Comprendre** (Analysis): Extraire structure, patterns, symboles
2. **Synthétiser** (Generation): Créer message basé sur compréhension

**Gortex CLI implémente**: ✅ (DiffAnalyzer → AI Generation)

#### D. Limitations des Diffs

> **Caveat**: "Diffs don't convey intention or downstream effects, which can limit the quality of AI-generated messages for complex changes."

**Solutions**:
- Analyser l'historique récent (contexte projet)
- Détecter les patterns architecturaux
- Identifier les fichiers critiques (domain vs infra)
- **Considérer AST analysis** pour mieux comprendre

---

## Approches Agentiques pour la Génération de Commits

### 1. Qu'est-ce qu'un Workflow Agentique ?

> **Définition (2025)**: "An agentic workflow is a series of connected steps dynamically executed by an agent, or series of agents, to achieve a specific task or goal. The agentic workflow takes LLMs beyond just reacting to prompts. Instead, it turns them into proactive problem-solvers."

### 2. Caractéristiques Clés

#### A. Comportement Proactif

**Différence avec approche classique**:
```
Approche Classique (Gortex actuel):
User Input → Analyze → Generate → [Optional Verify] → Output

Approche Agentique:
User Input → Agent {
  1. Analyze
  2. Plan generation strategy
  3. Generate initial draft
  4. Self-critique
  5. Refine based on critique
  6. Validate against rules
  7. Re-generate if needed (loop)
} → Output
```

#### B. Décomposition en Sous-Tâches

**Exemple pour commit generation**:
1. **Agent Analyzer**: Comprend le diff structurellement
2. **Agent Reasoner**: Identifie l'intention et le contexte
3. **Agent Writer**: Rédige le message
4. **Agent Critic**: Évalue qualité et suggère améliorations
5. **Agent Refiner**: Applique corrections

#### C. Adaptation Dynamique

L'agent peut décider de :
- Demander plus de contexte si nécessaire
- Choisir entre plusieurs stratégies (feature vs refactor)
- Ajuster le niveau de détail selon complexité

### 3. Patterns de Design Agentiques (Andrew Ng)

> **Source**: "Andrew then presented four common agentic design patterns: Reflection, Tool use, Planning, and Multiagent collaboration."

#### Pattern 1: Reflection (Auto-Critique)

**Application à Gortex CLI**:
```typescript
// Phase 1: Generate
const initialCommit = await aiProvider.generateCommitMessage(context);

// Phase 2: Reflect
const reflection = await aiProvider.reflect({
  prompt: "Review this commit message. Does it capture the architectural intent?",
  commit: initialCommit,
  analysis: diffAnalysis
});

// Phase 3: Refine (if needed)
if (reflection.needsImprovement) {
  const refinedCommit = await aiProvider.refine(initialCommit, reflection.feedback);
  return refinedCommit;
}
```

**Avantage**:
- Détection automatique de messages génériques
- Correction sans intervention humaine initiale
- Meilleure qualité finale

**⚠️ Trade-off**: +1 appel LLM (latence et coût)

#### Pattern 2: Tool Use (Agents avec Outils)

**Application à Gortex CLI**:

L'agent peut utiliser des outils spécialisés :
```typescript
// Outils disponibles pour l'agent
const tools = {
  analyzeDiff: (files: string[]) => diffAnalyzer.analyze(diff, files),
  parseAST: (file: string) => astParser.parse(file),
  queryGitHistory: (query: string) => git.log({ ...query }),
  searchCodebase: (symbol: string) => grep.search(symbol),
  getFileImportance: (file: string) => calculateImportance(file)
};

// L'agent décide quels outils utiliser
const agentDecision = await agent.decidePlan(diff);
// → "I need to understand the architectural layer first"
const layerInfo = await tools.getFileImportance(files[0]);
// → "domain/services → high importance, core business logic"
```

**Avantage**:
- Meilleure compréhension contextuelle
- Décisions éclairées
- Extensibilité

#### Pattern 3: Planning (Planification)

**Application à Gortex CLI**:
```typescript
// Agent analyse et planifie
const plan = await agent.planCommitGeneration({
  diff,
  analysis: diffAnalysis,
  complexity: "complex"
});

// Plan généré:
// 1. Identify dominant pattern (feature_addition)
// 2. Extract key components (DiffAnalyzer, AIProvider)
// 3. Determine architectural impact (new domain service)
// 4. Craft subject focusing on capability
// 5. Write body explaining why and how
// 6. Verify against semantic rules

// Exécution du plan
for (const step of plan.steps) {
  await agent.executeStep(step);
}
```

**Avantage**:
- Approche structurée
- Traçabilité du raisonnement
- Meilleure qualité pour changements complexes

#### Pattern 4: Multi-Agent Collaboration

**Application à Gortex CLI**:
```typescript
// Équipe d'agents spécialisés
const team = {
  analyzer: new AnalyzerAgent(),    // Expert en analyse de code
  architect: new ArchitectAgent(),  // Expert en architecture
  writer: new WriterAgent(),        // Expert en rédaction
  reviewer: new ReviewerAgent()     // Expert en qualité
};

// Workflow collaboratif
const analysis = await team.analyzer.analyze(diff);
const archContext = await team.architect.identifyContext(analysis);
const draftMessage = await team.writer.compose(analysis, archContext);
const review = await team.reviewer.evaluate(draftMessage);

if (review.approved) {
  return draftMessage;
} else {
  return team.writer.revise(draftMessage, review.feedback);
}
```

**Avantage**:
- Spécialisation (meilleure qualité par domaine)
- Division du travail
- Vérifications croisées

**⚠️ Trade-off**: Complexité accrue, plusieurs appels LLM

### 4. Cas d'Usage : Anthropic Claude Code

> **Citation**: "These assistants can also be enabled with permissions to make changes to an existing code base by creating commits and PRs, like Anthropic's Claude Code, an important step in automating the software development process."

**Ce que Claude Code fait bien**:
- Commits contextuels basés sur l'intention de l'utilisateur
- Analyse architecturale approfondie
- Messages détaillés et informatifs
- Format Conventional Commits strict

**Exemple de commit Claude Code**:
```
feat(ai): structured diff analysis for AI commit generation

Introduce DiffAnalyzer service to extract meaningful metadata from diffs.

The analyzer detects:
- Modified symbols (functions, classes, types)
- Change patterns (feat, fix, refactor, test)
- File relationships and importance
- Complexity assessment

This structured analysis provides rich context to guide AI-generated
commit messages, enabling more accurate and semantic descriptions.

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

**Caractéristiques observées**:
- Subject sémantique (capability-focused)
- Body structuré avec listes
- Explication du "pourquoi"
- Signature AI claire

### 5. Recommandations pour Gortex CLI

#### Option A: Reflection Pattern (Impact/Coût: ⚖️ Optimal)

**Implémentation**:
```
[Génération] → [Réflexion] → [Raffinement si nécessaire] → [Output]
```

**Avantages**:
- ✅ Simple à implémenter (extension du système actuel)
- ✅ +1 seul appel LLM (acceptable)
- ✅ Amélioration qualité significative
- ✅ Compatible machines limitées

**Implémentation suggérée**:
1. Réutiliser le système de verification actuel
2. Transformer en étape de reflection obligatoire
3. Automatiser le raffinement (au lieu de retour utilisateur)
4. Garder validation finale humaine

#### Option B: Planning + Reflection (Impact: Élevé, Coût: 🔥🔥)

**Implémentation**:
```
[Planification] → [Génération guidée] → [Réflexion] → [Output]
```

**Avantages**:
- ✅ Meilleure qualité pour diffs complexes
- ✅ Raisonnement structuré
- ✅ Traçabilité

**Inconvénients**:
- ⚠️ +2 appels LLM
- ⚠️ Latence augmentée (~15-20s avec Ollama)
- ⚠️ Complexité implémentation

**Recommandation**: Activer conditionnellement pour `complexity: "complex"`

#### Option C: Multi-Agent (Impact: Très Élevé, Coût: 🔥🔥🔥)

**⚠️ NON RECOMMANDÉ pour Gortex CLI**

**Raisons**:
- Trop de latence (4-5 appels LLM)
- Complexité architecturale élevée
- Marginal gain vs coût
- Inadapté pour machines limitées

---

## Optimisations pour Environnements à Ressources Limitées

### 1. Modèles Légers pour Edge Devices

#### A. État de l'Art 2025

> **Research**: "Lightweight models such as Yi and Phi achieve sufficient throughput and latency for edge settings, presenting a viable solution for distributed intelligence without specialized accelerators."

**Modèles recommandés pour commit generation**:

| Modèle | Taille | Latence | Qualité | Use Case |
|--------|--------|---------|---------|----------|
| **SmolLM-135M** | 135M params | 3-5s | ⭐⭐⭐ | Ultra-light, quick commits |
| **TinyLlama-1.1B** | 1.1B params | 5-8s | ⭐⭐⭐⭐ | Light, balanced quality |
| **Llama 3.2:3B** | 3B params | 8-12s | ⭐⭐⭐⭐⭐ | Best quality/size ratio |
| **Phi-2** | 2.7B params | 7-10s | ⭐⭐⭐⭐ | Strong reasoning |
| **Gemma 2B** | 2B params | 6-9s | ⭐⭐⭐⭐ | Optimized for Arm |

**Comparaison avec modèles lourds**:
- Llama 3 8B: 15-30s
- Mistral 7B: 20-35s
- GPT-4 (API): 3-8s mais coût + dépendance internet

#### B. Techniques d'Optimisation

##### 1. Quantification

> **Technique**: "Model compression methods include pruning, parameter sharing, quantization, knowledge distillation, and low-rank factorization."

**Impact sur Gortex CLI**:
```bash
# Avant (FP16)
ollama run llama3:8b  # ~16GB RAM, 25s

# Après (Q4_K_M quantization)
ollama run llama3:8b-q4  # ~4.5GB RAM, 15s

# Après (Q8 quantization - meilleur ratio)
ollama run llama3:8b-q8  # ~8GB RAM, 18s
```

**Recommandation pour Gortex CLI**:
- Configuration par défaut: `llama3.2:3b-q8`
- Configuration light: `tinyllama:1.1b-q4`
- Configuration pro: `llama3:8b-q8` ou `mistral:7b-q8`

##### 2. Context Window Optimization

**Problème**: Grands diffs dépassent context window

**Solutions**:
```typescript
// 1. Résumé sémantique pour gros diffs
if (diff.length > 8000 chars) {
  const summary = await generateSemanticSummary(diff, analysis);
  context.semanticSummary = summary;
  // Ne pas envoyer le diff complet, seulement le summary
}

// 2. Priorisation des fichiers importants
const priorityFiles = analysis.fileChanges
  .filter(f => f.importance === "high")
  .map(f => f.path);

// Envoyer seulement le diff des fichiers prioritaires
const focusedDiff = extractDiffForFiles(diff, priorityFiles);
```

##### 3. Prompt Compression

**Optimisation des prompts**:
```typescript
// ❌ AVANT (verbose)
const verbosePrompt = `
You are an expert in Git and Conventional Commits.
Your task is to generate a commit message in the Conventional Commits format.
The response format must be a valid JSON object containing the following fields:
- "type": string (must be one of: feat, fix, docs, style, refactor, perf, test, build, ci, chore)
- "scope": string (optional, concise)
...
`;

// ✅ APRÈS (concis, même efficacité)
const compactPrompt = `Expert Git + Conventional Commits. Generate JSON: {type, scope, subject, body, breaking, confidence, reasoning}. Rules: semantic (no file paths), use exact symbol names, explain why in body if complex.`;
```

**Gain**: -40% tokens, même compréhension

##### 4. Caching Intelligent

**Implémentation**:
```typescript
// Cache des analyses répétitives
const analysisCache = new LRUCache<string, DiffAnalysis>({
  max: 100,
  ttl: 1000 * 60 * 30  // 30 minutes
});

// Cache basé sur hash du diff
const diffHash = crypto.createHash('sha256').update(diff).digest('hex');

let analysis = analysisCache.get(diffHash);
if (!analysis) {
  analysis = await diffAnalyzer.analyze(diff, files);
  analysisCache.set(diffHash, analysis);
}
```

##### 5. Inference Framework Optimization

> **Framework**: "Framework-level optimizations focus on lightweight frameworks, with PyTorch extending capabilities to edge computing via ExecuTorch."

**Pour Ollama (backend de Gortex CLI)**:
- Utiliser `llama.cpp` avec optimisations natives
- Activer Metal (macOS) / CUDA (Linux+GPU) / ROCm (AMD)
- Configurer `num_thread` selon CPU

**Configuration Ollama optimisée**:
```json
{
  "model": "llama3.2:3b-q8",
  "options": {
    "num_thread": 8,        // Adapter selon CPU
    "num_gpu": 1,           // Si GPU disponible
    "num_ctx": 4096,        // Context window réduit
    "temperature": 0.3,
    "top_p": 0.9,
    "repeat_penalty": 1.1,
    "num_predict": 512      // Limite output (commits courts)
  }
}
```

### 2. Stratégies Adaptatives

#### A. Détection des Ressources

```typescript
// Détecter capacités de la machine
const systemResources = {
  totalRAM: os.totalmem(),
  availableRAM: os.freemem(),
  cpuCores: os.cpus().length,
  hasGPU: await detectGPU()
};

// Adapter configuration
if (systemResources.availableRAM < 4 * 1024 * 1024 * 1024) {
  // < 4GB RAM
  config.ai.model = "tinyllama:1.1b-q4";
  config.ai.enableChainOfThought = false;
  config.ai.enableVerification = false;
} else if (systemResources.availableRAM < 8 * 1024 * 1024 * 1024) {
  // < 8GB RAM
  config.ai.model = "llama3.2:3b-q8";
  config.ai.enableChainOfThought = false;
  config.ai.enableVerification = true;
} else {
  // >= 8GB RAM
  config.ai.model = "llama3:8b-q8";
  config.ai.enableChainOfThought = true;
  config.ai.enableVerification = true;
}
```

#### B. Modes de Performance

```typescript
// Mode sélectionnable par l'utilisateur
type PerformanceMode = "fast" | "balanced" | "quality";

const configurations: Record<PerformanceMode, AIConfig> = {
  fast: {
    model: "smollm:135m",
    enableChainOfThought: false,
    enableVerification: false,
    enableReflection: false,
    maxTokens: 256,
    temperature: 0.2,
    expectedLatency: "3-5s"
  },
  balanced: {
    model: "llama3.2:3b-q8",
    enableChainOfThought: false,
    enableVerification: true,
    enableReflection: true,
    maxTokens: 512,
    temperature: 0.3,
    expectedLatency: "12-18s"
  },
  quality: {
    model: "llama3:8b-q8",
    enableChainOfThought: true,
    enableVerification: true,
    enableReflection: true,
    maxTokens: 1024,
    temperature: 0.3,
    expectedLatency: "25-40s"
  }
};
```

#### C. Fallback Progressif

```typescript
// Si timeout ou erreur, fallback vers modèle plus léger
async function generateWithFallback(context: CommitContext): Promise<AIGeneratedCommit> {
  const models = ["llama3:8b-q8", "llama3.2:3b-q8", "tinyllama:1.1b-q4"];

  for (const model of models) {
    try {
      return await generateCommit(context, { model, timeout: 30000 });
    } catch (error) {
      if (isLastModel(model, models)) {
        throw error;
      }
      console.warn(`Model ${model} failed, trying lighter model...`);
    }
  }
}
```

### 3. Benchmarks de Performance

**Tests recommandés** (à implémenter):

```typescript
// Benchmark suite
const benchmarks = [
  { name: "Simple commit (1 file, 20 lines)", complexity: "simple" },
  { name: "Moderate commit (3 files, 100 lines)", complexity: "moderate" },
  { name: "Complex commit (10 files, 500 lines)", complexity: "complex" }
];

// Pour chaque modèle
const models = [
  "smollm:135m",
  "tinyllama:1.1b",
  "llama3.2:3b",
  "llama3:8b"
];

// Mesurer
for (const model of models) {
  for (const benchmark of benchmarks) {
    const { latency, quality, memory } = await runBenchmark(model, benchmark);
    results.push({ model, benchmark, latency, quality, memory });
  }
}

// Résultats attendus (estimations):
// smollm:135m      - Simple: 3s, Quality: 6/10, Memory: 500MB
// tinyllama:1.1b   - Simple: 5s, Quality: 7/10, Memory: 1.2GB
// llama3.2:3b      - Simple: 8s, Quality: 8.5/10, Memory: 3GB
// llama3:8b        - Simple: 15s, Quality: 9/10, Memory: 6GB
```

---

## Recommandations d'Implémentation

### 1. Architecture Cible Proposée

```
┌─────────────────────────────────────────────────────────────┐
│                    USER REQUEST                              │
│                 (gortex commit)                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              RESOURCE DETECTION                              │
│  Detect: RAM, CPU, GPU → Select optimal config              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│           DIFF ANALYSIS (Enhanced)                           │
│  • Current: Regex-based DiffAnalyzer                         │
│  • NEW: Optional AST-based analysis (Tree-Sitter)           │
│  • Output: Structured DiffAnalysis                           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│         AGENTIC WORKFLOW (NEW)                               │
│  ┌─────────────────────────────────────┐                    │
│  │  1. PLANNING (if complex)           │                    │
│  │     - Analyze complexity             │                    │
│  │     - Determine generation strategy  │                    │
│  └─────────────┬───────────────────────┘                    │
│                │                                             │
│                ▼                                             │
│  ┌─────────────────────────────────────┐                    │
│  │  2. GENERATION                       │                    │
│  │     - Enhanced prompt with analysis  │                    │
│  │     - Few-shot examples              │                    │
│  │     - Project style                  │                    │
│  └─────────────┬───────────────────────┘                    │
│                │                                             │
│                ▼                                             │
│  ┌─────────────────────────────────────┐                    │
│  │  3. REFLECTION (NEW - mandatory)    │                    │
│  │     - Self-critique generated commit │                    │
│  │     - Check semantic quality         │                    │
│  │     - Validate against analysis      │                    │
│  └─────────────┬───────────────────────┘                    │
│                │                                             │
│                ▼                                             │
│  ┌─────────────────────────────────────┐                    │
│  │  4. REFINEMENT (if needed)          │                    │
│  │     - Apply reflection feedback      │                    │
│  │     - Re-generate improved version   │                    │
│  │     - Max 2 iterations               │                    │
│  └─────────────┬───────────────────────┘                    │
│                │                                             │
└────────────────┼─────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│              USER CONFIRMATION                               │
│  Display: commit, reasoning, confidence                      │
│  Allow: Accept / Edit / Regenerate                           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  GIT COMMIT                                  │
└─────────────────────────────────────────────────────────────┘
```

### 2. Changements Techniques Détaillés

#### A. Nouveau Service: AgenticCommitGenerator

**Localisation proposée**: `src/application/use-cases/AgenticCommitGenerationUseCase.ts`

**Responsabilités**:
- Orchestrer le workflow agentique (planning, generation, reflection, refinement)
- Gérer les itérations de raffinement
- Adapter stratégie selon complexité et ressources

**Interface**:
```typescript
export interface IAgenticCommitGenerator {
  /**
   * Generates a commit message using agentic workflow
   * @param context Commit context (diff, files, branch, etc.)
   * @param options Generation options (mode, maxIterations, etc.)
   * @returns AI-generated commit with metadata
   */
  generateCommit(
    context: CommitContext,
    options?: AgenticGenerationOptions
  ): Promise<AgenticCommitResult>;
}

export interface AgenticGenerationOptions {
  mode: "fast" | "balanced" | "quality";
  maxIterations?: number;  // Max reflection-refinement cycles
  enablePlanning?: boolean;
  enableReflection?: boolean;
  fallbackOnError?: boolean;
}

export interface AgenticCommitResult extends AIGeneratedCommit {
  iterations: number;  // Number of refinement cycles
  reflections: ReflectionFeedback[];  // All reflection steps
  planningTrace?: PlanningTrace;  // If planning was used
  performance: {
    totalLatency: number;
    modelUsed: string;
    tokensUsed: number;
  };
}

export interface ReflectionFeedback {
  iteration: number;
  issues: string[];
  improvements: string[];
  decision: "accept" | "refine";
  reasoning: string;
}

export interface PlanningTrace {
  complexity: "simple" | "moderate" | "complex";
  strategy: string;
  steps: string[];
  reasoning: string;
}
```

**Implémentation**:
```typescript
export class AgenticCommitGenerationUseCase implements IAgenticCommitGenerator {
  constructor(
    private readonly aiProvider: IAIProvider,
    private readonly diffAnalyzer: DiffAnalyzer,
    private readonly configService: IConfigService
  ) {}

  async generateCommit(
    context: CommitContext,
    options?: AgenticGenerationOptions
  ): Promise<AgenticCommitResult> {
    const startTime = Date.now();
    const opts = this.mergeOptions(options);

    // 1. Analyze diff (existing logic)
    const analysis = await this.diffAnalyzer.analyze(
      context.diff,
      context.files
    );

    // 2. Optional planning (for complex commits)
    let planningTrace: PlanningTrace | undefined;
    if (opts.enablePlanning && analysis.complexity === "complex") {
      planningTrace = await this.planGeneration(context, analysis);
    }

    // 3. Initial generation
    let currentCommit = await this.generateInitialCommit(
      context,
      analysis,
      planningTrace
    );

    const reflections: ReflectionFeedback[] = [];
    let iterations = 1;

    // 4. Reflection-Refinement loop
    if (opts.enableReflection) {
      let shouldRefine = true;

      while (shouldRefine && iterations < opts.maxIterations!) {
        const reflection = await this.reflectOnCommit(
          currentCommit,
          analysis,
          planningTrace
        );

        reflections.push(reflection);

        if (reflection.decision === "accept") {
          shouldRefine = false;
        } else {
          currentCommit = await this.refineCommit(
            currentCommit,
            reflection,
            analysis
          );
          iterations++;
        }
      }
    }

    const totalLatency = Date.now() - startTime;

    return {
      ...currentCommit,
      iterations,
      reflections,
      planningTrace,
      performance: {
        totalLatency,
        modelUsed: this.configService.get("ai.model"),
        tokensUsed: this.estimateTokens(context, reflections)
      }
    };
  }

  private async planGeneration(
    context: CommitContext,
    analysis: DiffAnalysis
  ): Promise<PlanningTrace> {
    const planningPrompt = this.buildPlanningPrompt(context, analysis);
    const planningResponse = await this.aiProvider.generateCompletion({
      systemPrompt: "You are a planning agent. Analyze the commit and create a generation strategy.",
      userPrompt: planningPrompt,
      temperature: 0.2
    });

    return this.parsePlanningResponse(planningResponse);
  }

  private async reflectOnCommit(
    commit: AIGeneratedCommit,
    analysis: DiffAnalysis,
    planning?: PlanningTrace
  ): Promise<ReflectionFeedback> {
    const reflectionPrompt = this.buildReflectionPrompt(
      commit,
      analysis,
      planning
    );

    const reflectionResponse = await this.aiProvider.generateCompletion({
      systemPrompt: generateReflectionSystemPrompt(),
      userPrompt: reflectionPrompt,
      temperature: 0.3
    });

    return this.parseReflectionResponse(reflectionResponse);
  }

  private async refineCommit(
    commit: AIGeneratedCommit,
    reflection: ReflectionFeedback,
    analysis: DiffAnalysis
  ): Promise<AIGeneratedCommit> {
    const refinementPrompt = this.buildRefinementPrompt(
      commit,
      reflection,
      analysis
    );

    const refinedResponse = await this.aiProvider.generateCommitMessage({
      ...this.buildContext(analysis),
      additionalInstructions: refinementPrompt
    });

    return refinedResponse;
  }

  private mergeOptions(
    options?: AgenticGenerationOptions
  ): Required<AgenticGenerationOptions> {
    return {
      mode: options?.mode ?? "balanced",
      maxIterations: options?.maxIterations ?? 2,
      enablePlanning: options?.enablePlanning ?? false,
      enableReflection: options?.enableReflection ?? true,
      fallbackOnError: options?.fallbackOnError ?? true
    };
  }

  // ... helper methods
}
```

#### B. Enhanced DiffAnalyzer avec AST Support

**Localisation**: `src/domain/services/DiffAnalyzer.ts` (extension)

**Nouvelle fonctionnalité**: Support optionnel d'analyse AST

```typescript
import { DiffAnalyzer } from "./DiffAnalyzer.js";
import { IASTDiffAnalyzer, TreeSitterAnalyzer } from "./ASTDiffAnalyzer.js";

export class EnhancedDiffAnalyzer extends DiffAnalyzer {
  private astAnalyzer?: IASTDiffAnalyzer;

  constructor(enableAST: boolean = false) {
    super();

    if (enableAST) {
      try {
        this.astAnalyzer = new TreeSitterAnalyzer();
      } catch (error) {
        console.warn("AST analyzer not available, falling back to regex-based analysis");
      }
    }
  }

  async analyze(diff: string, stagedFiles: string[]): Promise<DiffAnalysis> {
    // Base analysis (regex-based)
    const baseAnalysis = await super.analyze(diff, stagedFiles);

    // Enhanced AST analysis if available
    if (this.astAnalyzer) {
      const astAnalysis = await this.performASTAnalysis(diff, stagedFiles);
      return this.mergeAnalyses(baseAnalysis, astAnalysis);
    }

    return baseAnalysis;
  }

  private async performASTAnalysis(
    diff: string,
    files: string[]
  ): Promise<ASTAnalysis> {
    // AST-based analysis for better refactoring detection
    // Détecte: extract method, rename, move class, etc.
    // Implementation détaillée dans ASTDiffAnalyzer.ts
  }
}
```

**Nouvelle interface**: `src/domain/services/ASTDiffAnalyzer.ts`

```typescript
export interface IASTDiffAnalyzer {
  /**
   * Analyzes code changes using AST parsing
   * Detects refactorings, renames, moves, etc.
   */
  analyzeFileAST(
    filePath: string,
    oldContent: string,
    newContent: string
  ): Promise<ASTAnalysis>;

  supportsFile(filePath: string): boolean;
}

export interface ASTAnalysis {
  refactorings: Refactoring[];
  structuralChanges: StructuralChange[];
  semanticImpact: SemanticImpact[];
}

export interface Refactoring {
  type: "extract_method" | "rename" | "move_class" | "inline" | "extract_variable";
  before: string;
  after: string;
  confidence: number;
}

export interface StructuralChange {
  type: "signature_change" | "visibility_change" | "inheritance_change";
  symbol: string;
  impact: "breaking" | "non-breaking";
}

export interface SemanticImpact {
  symbol: string;
  changeType: "behavior" | "contract" | "dependency";
  description: string;
}
```

**Implémentation Tree-Sitter** (optionnelle, pour TypeScript):

```typescript
import Parser from "tree-sitter";
import TypeScript from "tree-sitter-typescript";

export class TreeSitterAnalyzer implements IASTDiffAnalyzer {
  private parser: Parser;

  constructor() {
    this.parser = new Parser();
    this.parser.setLanguage(TypeScript);
  }

  async analyzeFileAST(
    filePath: string,
    oldContent: string,
    newContent: string
  ): Promise<ASTAnalysis> {
    const oldTree = this.parser.parse(oldContent);
    const newTree = this.parser.parse(newContent);

    // Compare ASTs
    const refactorings = this.detectRefactorings(oldTree, newTree);
    const structuralChanges = this.detectStructuralChanges(oldTree, newTree);
    const semanticImpact = this.assessSemanticImpact(oldTree, newTree);

    return {
      refactorings,
      structuralChanges,
      semanticImpact
    };
  }

  supportsFile(filePath: string): boolean {
    return filePath.endsWith(".ts") || filePath.endsWith(".tsx");
  }

  private detectRefactorings(oldTree: Parser.Tree, newTree: Parser.Tree): Refactoring[] {
    // Detect method extractions, renames, etc.
    // Use tree-diff algorithm
  }

  // ... other methods
}
```

#### C. Resource-Aware Configuration Service

**Localisation**: `src/infrastructure/services/ResourceAwareConfigService.ts`

```typescript
import os from "node:os";
import type { Config } from "../../types.js";

export interface SystemResources {
  totalRAM: number;
  availableRAM: number;
  cpuCores: number;
  hasGPU: boolean;
  platform: string;
}

export class ResourceAwareConfigService {
  /**
   * Detects system resources and adapts AI configuration
   */
  async getOptimalConfig(userConfig: Config): Promise<Config> {
    const resources = await this.detectResources();
    const optimizedConfig = this.adaptToResources(userConfig, resources);

    return optimizedConfig;
  }

  private async detectResources(): Promise<SystemResources> {
    const totalRAM = os.totalmem();
    const availableRAM = os.freemem();
    const cpuCores = os.cpus().length;
    const hasGPU = await this.detectGPU();
    const platform = os.platform();

    return {
      totalRAM,
      availableRAM,
      cpuCores,
      hasGPU,
      platform
    };
  }

  private adaptToResources(
    baseConfig: Config,
    resources: SystemResources
  ): Config {
    const config = { ...baseConfig };

    // Adapter le modèle selon RAM disponible
    const availableGB = resources.availableRAM / (1024 ** 3);

    if (availableGB < 4) {
      // Low-end: ultra-light model
      config.ai.ollama.model = "tinyllama:1.1b-q4";
      config.ai.enableChainOfThought = false;
      config.ai.enableReflection = false;
    } else if (availableGB < 8) {
      // Mid-range: balanced
      config.ai.ollama.model = "llama3.2:3b-q8";
      config.ai.enableChainOfThought = false;
      config.ai.enableReflection = true;
    } else {
      // High-end: quality
      config.ai.ollama.model = "llama3:8b-q8";
      config.ai.enableChainOfThought = true;
      config.ai.enableReflection = true;
    }

    // Adapter timeout selon CPU
    if (resources.cpuCores <= 4) {
      config.ai.timeout = 60000;  // 60s
    } else {
      config.ai.timeout = 30000;  // 30s
    }

    return config;
  }

  private async detectGPU(): Promise<boolean> {
    // Détection basique via node-os-utils ou similaire
    // Peut être étendu avec nvidia-smi, rocm-smi, etc.
    return false;
  }
}
```

#### D. Nouveaux Prompts pour Reflection

**Localisation**: `src/ai/prompts/commit-message.ts` (ajouts)

```typescript
/**
 * Génère le prompt système pour la réflexion agentique
 */
export function generateAgenticReflectionSystemPrompt(): string {
  return `Tu es un agent de réflexion expert en qualité de messages de commit.

Ta tâche est d'évaluer un message de commit généré et de décider s'il nécessite des améliorations.

Évalue selon ces critères STRICTS:
1. Subject SÉMANTIQUE (mentionne composants/concepts, PAS chemins de fichiers)
2. Subject MAXIMUM 100 caractères
3. Body explique le POURQUOI (intention, raison du changement)
4. Symboles clés mentionnés (classes/fonctions modifiées)
5. Type cohérent avec le pattern de changement
6. Clarté et précision

Réponds en JSON:
{
  "decision": "accept" | "refine",
  "issues": string[],  // Problèmes détectés
  "improvements": string[],  // Suggestions d'amélioration
  "reasoning": string  // Explication de ta décision
}

Règles de décision:
- "accept" si le message est de HAUTE qualité (8+/10)
- "refine" si des améliorations significatives sont possibles (< 8/10)

IMPORTANT: Sois exigeant. Un commit de qualité médiocre doit être raffiné.`;
}

/**
 * Génère le prompt utilisateur pour la réflexion
 */
export function generateAgenticReflectionUserPrompt(
  commit: AIGeneratedCommit,
  analysis: DiffAnalysis,
  planning?: PlanningTrace
): string {
  const parts: string[] = [];

  parts.push("Évalue ce message de commit généré:");
  parts.push("");
  parts.push(`Type: ${commit.type}`);
  parts.push(`Scope: ${commit.scope ?? "(none)"}`);
  parts.push(`Subject: ${commit.subject}`);
  parts.push(`Body: ${commit.body ?? "(none)"}`);
  parts.push(`Reasoning: ${commit.reasoning}`);
  parts.push("");

  parts.push("CONTEXTE DE L'ANALYSE:");
  parts.push(`- Complexité: ${analysis.complexity}`);
  parts.push(`- Fichiers modifiés: ${analysis.summary.filesChanged}`);
  parts.push(`- Pattern dominant: ${analysis.changePatterns[0]?.description ?? "N/A"}`);

  if (analysis.modifiedSymbols.length > 0) {
    parts.push(`- Symboles modifiés (${analysis.modifiedSymbols.length}):`);
    analysis.modifiedSymbols.slice(0, 5).forEach(sym => {
      parts.push(`  * ${sym.name} (${sym.type})`);
    });
  }

  if (planning) {
    parts.push("");
    parts.push("PLAN DE GÉNÉRATION UTILISÉ:");
    parts.push(`- Stratégie: ${planning.strategy}`);
    parts.push(`- Étapes: ${planning.steps.join(", ")}`);
  }

  parts.push("");
  parts.push("QUESTIONS À TE POSER:");
  parts.push("1. Le subject capture-t-il l'ESSENCE du changement (pas juste 'update X')?");
  parts.push("2. Les symboles importants sont-ils mentionnés?");
  parts.push("3. Le body explique-t-il le POURQUOI (si complexité > simple)?");
  parts.push("4. Le type correspond-il au pattern dominant?");
  parts.push("5. Le message est-il clair pour quelqu'un qui n'a pas vu le diff?");
  parts.push("");
  parts.push("Décide: accept ou refine?");

  return parts.join("\n");
}

/**
 * Génère le prompt pour le raffinement basé sur la réflexion
 */
export function generateRefinementPrompt(
  originalCommit: AIGeneratedCommit,
  reflection: ReflectionFeedback
): string {
  const parts: string[] = [];

  parts.push("Le commit précédent nécessite des améliorations:");
  parts.push("");
  parts.push("COMMIT ORIGINAL:");
  parts.push(`${originalCommit.type}${originalCommit.scope ? `(${originalCommit.scope})` : ""}: ${originalCommit.subject}`);
  if (originalCommit.body) {
    parts.push("");
    parts.push(originalCommit.body);
  }
  parts.push("");

  parts.push("PROBLÈMES IDENTIFIÉS:");
  reflection.issues.forEach((issue, i) => {
    parts.push(`${i + 1}. ${issue}`);
  });
  parts.push("");

  parts.push("AMÉLIORATIONS SUGGÉRÉES:");
  reflection.improvements.forEach((improvement, i) => {
    parts.push(`${i + 1}. ${improvement}`);
  });
  parts.push("");

  parts.push("RAISONNEMENT:");
  parts.push(reflection.reasoning);
  parts.push("");

  parts.push("INSTRUCTIONS:");
  parts.push("Génère une VERSION AMÉLIORÉE du commit qui:");
  parts.push("- Corrige TOUS les problèmes identifiés");
  parts.push("- Applique les améliorations suggérées");
  parts.push("- Maintient les éléments déjà bons");
  parts.push("- Reste fidèle au format Conventional Commits");
  parts.push("");
  parts.push("Réponds au format JSON comme précédemment.");

  return parts.join("\n");
}
```

### 3. Modifications de Configuration

**Localisation**: `.gortexrc` (exemple étendu)

```json
{
  "ai": {
    "enabled": true,
    "provider": "ollama",

    "ollama": {
      "model": "llama3.2:3b-q8",
      "baseUrl": "http://localhost:11434",
      "timeout": 30000
    },

    "performanceMode": "balanced",

    "features": {
      "enableChainOfThought": false,
      "enableReflection": true,
      "enablePlanning": false,
      "enableASTAnalysis": false,
      "maxReflectionIterations": 2
    },

    "resourceAdaptive": true,
    "fallbackModel": "tinyllama:1.1b-q4",

    "temperature": 0.3,
    "autoSuggest": false,
    "requireConfirmation": true
  }
}
```

**Nouveau fichier de configuration avancée**: `.gortexrc.advanced.json`

```json
{
  "ai": {
    "modelPresets": {
      "fast": {
        "model": "smollm:135m",
        "timeout": 10000,
        "features": {
          "enableReflection": false,
          "enablePlanning": false,
          "enableASTAnalysis": false
        }
      },
      "balanced": {
        "model": "llama3.2:3b-q8",
        "timeout": 30000,
        "features": {
          "enableReflection": true,
          "enablePlanning": false,
          "enableASTAnalysis": false
        }
      },
      "quality": {
        "model": "llama3:8b-q8",
        "timeout": 60000,
        "features": {
          "enableReflection": true,
          "enablePlanning": true,
          "enableASTAnalysis": true
        }
      }
    },

    "resourceThresholds": {
      "lowRAM": 4096,
      "mediumRAM": 8192,
      "highRAM": 16384
    },

    "qualityMetrics": {
      "minConfidence": 70,
      "requireBodyForComplexity": ["moderate", "complex"],
      "maxSubjectLength": 100
    }
  }
}
```

### 4. Intégration dans le Workflow Existant

**Localisation**: `src/components/CommitWorkflow.tsx`

**Modifications**:
```typescript
import { useAgenticCommitGeneration } from "../infrastructure/di/hooks.js";

export const CommitWorkflow: React.FC = () => {
  // Nouveau hook pour génération agentique
  const {
    generate: generateAgenticCommit,
    loading,
    result,
    error,
    iterations,
    reflections
  } = useAgenticCommitGeneration();

  const handleGenerateCommit = async () => {
    setStep("generating");

    try {
      const agenticResult = await generateAgenticCommit({
        // Context automatiquement injecté
        mode: config.ai.performanceMode,
        enableReflection: config.ai.features.enableReflection,
        enablePlanning: config.ai.features.enablePlanning
      });

      setCommitMessage(agenticResult);
      setStep("confirmation");

      // Afficher statistiques de génération
      if (config.showDebugInfo) {
        console.log(`Generated in ${iterations} iteration(s)`);
        console.log(`Total latency: ${agenticResult.performance.totalLatency}ms`);
      }
    } catch (err) {
      setError(err);
      setStep("error");
    }
  };

  // ... reste du composant
};
```

**Nouveau hook**: `src/infrastructure/di/hooks.ts`

```typescript
export function useAgenticCommitGeneration() {
  const container = useDI();
  const agenticUseCase = container.resolve<AgenticCommitGenerationUseCase>(
    ServiceIdentifiers.AgenticCommitGenerationUseCase
  );

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AgenticCommitResult | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [iterations, setIterations] = useState(0);
  const [reflections, setReflections] = useState<ReflectionFeedback[]>([]);

  const generate = async (options?: AgenticGenerationOptions) => {
    setLoading(true);
    setError(null);

    try {
      const agenticResult = await agenticUseCase.generateCommit(
        // context injecté automatiquement via DI
        context,
        options
      );

      setResult(agenticResult);
      setIterations(agenticResult.iterations);
      setReflections(agenticResult.reflections);

      return agenticResult;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    generate,
    loading,
    result,
    error,
    iterations,
    reflections
  };
}
```

---

## Feuille de Route Progressive

### Phase 1: Fondations (Semaines 1-2) ⚙️

**Objectif**: Préparer l'infrastructure pour l'approche agentique

**Tâches**:
1. ✅ **Resource Detection Service**
   - Implémenter `ResourceAwareConfigService`
   - Détection RAM, CPU, GPU
   - Configuration adaptative automatique
   - Tests sur machines variées (2GB, 4GB, 8GB, 16GB RAM)

2. ✅ **Model Configuration**
   - Ajouter presets (fast, balanced, quality)
   - Support modèles légers (SmolLM, TinyLlama, Llama 3.2:3B)
   - Configuration quantification (Q4, Q8)
   - Benchmarks de performance

3. ✅ **Enhanced Configuration**
   - Étendre `.gortexrc` avec nouvelles options
   - Ajouter `performanceMode` et `features`
   - Documentation utilisateur

**Livrables**:
- Service de détection de ressources fonctionnel
- 3 presets de modèles testés et benchmarkés
- Configuration étendue documentée
- Rapport de benchmarks (latence, qualité, mémoire)

**Critères de succès**:
- ✅ Détection automatique fonctionnelle sur Linux/macOS/Windows
- ✅ Presets adaptés aux contraintes (< 4GB, 4-8GB, > 8GB)
- ✅ Latence réduite de 30-50% en mode "fast"
- ✅ Qualité maintenue en mode "balanced"

---

### Phase 2: Reflection Pattern (Semaines 3-4) 🔄

**Objectif**: Implémenter le pattern Reflection pour amélioration itérative

**Tâches**:
1. ✅ **Reflection Prompts**
   - Créer `generateAgenticReflectionSystemPrompt()`
   - Créer `generateAgenticReflectionUserPrompt()`
   - Créer `generateRefinementPrompt()`
   - Tests de qualité des prompts

2. ✅ **AgenticCommitGenerationUseCase**
   - Implémenter orchestration Reflection
   - Boucle Generate → Reflect → Refine
   - Limite itérations (max 2-3)
   - Gestion des erreurs et fallbacks

3. ✅ **Integration dans Workflow**
   - Nouveau hook `useAgenticCommitGeneration`
   - Mise à jour `CommitWorkflow.tsx`
   - Affichage statistiques (iterations, latency)
   - Mode debug (afficher reflections)

4. ✅ **Tests et Validation**
   - Tests unitaires pour chaque étape
   - Tests d'intégration workflow complet
   - Comparaison qualité avant/après
   - Validation humaine (échantillon de 50 commits)

**Livrables**:
- Use case agentique fonctionnel
- Prompts de reflection optimisés
- Intégration UI complète
- Rapport de comparaison qualité (before/after)

**Critères de succès**:
- ✅ 80% des commits acceptés après 1ère itération
- ✅ 95% des commits acceptés après 2ème itération
- ✅ Amélioration qualité mesurable (+15-20% score sémantique)
- ✅ Latence totale < 20s en mode "balanced"

**Métrique de qualité** (à implémenter):
```typescript
interface CommitQualityScore {
  semantic: number;          // 0-100: sujet sémantique vs technique
  completeness: number;      // 0-100: présence body si complexe
  accuracy: number;          // 0-100: cohérence avec diff
  clarity: number;           // 0-100: clarté pour lecteur externe
  overall: number;           // moyenne pondérée
}
```

---

### Phase 3: Enhanced Diff Analysis (Semaines 5-6) 🌳

**Objectif**: Améliorer la compréhension des changements de code

**Tâches**:
1. ✅ **AST Analyzer Interface**
   - Définir `IASTDiffAnalyzer`
   - Interfaces `ASTAnalysis`, `Refactoring`, `StructuralChange`
   - Design modulaire (pluggable)

2. ✅ **Tree-Sitter Implementation** (optionnelle)
   - Implémenter `TreeSitterAnalyzer` pour TypeScript
   - Détection refactorings (extract method, rename, etc.)
   - Détection breaking changes (signature, visibility)
   - Analyse impacts sémantiques

3. ✅ **Enhanced DiffAnalyzer**
   - Étendre `DiffAnalyzer` avec support AST
   - Fusion analyses (regex + AST)
   - Priorisation sources d'information
   - Fallback gracieux si AST indisponible

4. ✅ **Integration et Tests**
   - Tests avec refactorings réels
   - Comparaison détection regex vs AST
   - Performance (latence AST parsing)
   - Configuration `enableASTAnalysis`

**Livrables**:
- Module AST analyzer fonctionnel (TypeScript)
- Integration transparente dans pipeline
- Détection améliorée de refactorings
- Documentation technique

**Critères de succès**:
- ✅ Détection correcte de 90% des refactorings (extract method, rename)
- ✅ Commits de refactoring mieux décrits (+30% clarté)
- ✅ Overhead latence acceptable (< +2s)
- ✅ Fallback gracieux si parsing échoue

---

### Phase 4: Planning Pattern (Semaines 7-8) 📋 [OPTIONNEL]

**Objectif**: Ajouter planification pour commits complexes

**Tâches**:
1. ✅ **Planning Prompts**
   - Système prompt pour agent de planification
   - Prompt utilisateur avec contexte enrichi
   - Parser réponse planning

2. ✅ **Planning Logic**
   - Implémenter `planGeneration()` dans use case
   - Activation conditionnelle (complexity === "complex")
   - Stratégies de génération (feature vs refactor vs fix)
   - Utilisation du plan dans génération

3. ✅ **Integration et Tests**
   - Tests avec commits complexes réels
   - Mesure impact sur qualité
   - Mesure overhead latence
   - A/B testing (with/without planning)

**Livrables**:
- Module de planification fonctionnel
- Activation conditionnelle implémentée
- Rapport A/B testing (impact qualité vs latence)

**Critères de succès**:
- ✅ Amélioration qualité pour commits complexes (+10-15%)
- ✅ Overhead acceptable (< +5s)
- ✅ 70% des plans exploitables
- ✅ Justification ROI (valeur ajoutée vs coût)

**⚠️ Note**: Cette phase est **optionnelle** et doit être validée après Phase 2. Si le Reflection Pattern atteint déjà 90% de qualité, le Planning peut être dé-priorisé.

---

### Phase 5: Polish et Optimisation (Semaine 9-10) ✨

**Objectif**: Finitions, optimisations, documentation

**Tâches**:
1. ✅ **Performance Optimization**
   - Caching intelligent (analyses, prompts)
   - Prompt compression
   - Context window optimization
   - Lazy loading AST analyzer

2. ✅ **User Experience**
   - Messages de progression informatifs
   - Affichage statistiques optionnel
   - Mode verbose/debug
   - Commande `gortex benchmark`

3. ✅ **Documentation**
   - Guide utilisateur complet
   - Architecture technique détaillée
   - Troubleshooting
   - FAQ

4. ✅ **Release Preparation**
   - Changelog détaillé
   - Migration guide (v2.x → v3.0)
   - Exemples de configurations
   - Vidéo démo

**Livrables**:
- Gortex CLI v3.0 optimisé
- Documentation complète (EN + FR)
- Benchmarks finaux
- Release notes

**Critères de succès**:
- ✅ Latence moyenne < 15s (mode balanced)
- ✅ Qualité moyenne > 85/100
- ✅ Support 3 langages (TS, JS, Python)
- ✅ Documentation claire et complète
- ✅ 0 régression vs v2.x

---

### Résumé de la Roadmap

| Phase | Durée | Effort | Impact | Priorité |
|-------|-------|--------|--------|----------|
| **Phase 1: Fondations** | 2 sem | 🔥🔥 Moyen | 🎯🎯 Moyen | ⭐⭐⭐ Haute |
| **Phase 2: Reflection** | 2 sem | 🔥🔥🔥 Élevé | 🎯🎯🎯 Élevé | ⭐⭐⭐ Haute |
| **Phase 3: AST Analysis** | 2 sem | 🔥🔥🔥 Élevé | 🎯🎯 Moyen | ⭐⭐ Moyenne |
| **Phase 4: Planning** | 2 sem | 🔥🔥 Moyen | 🎯 Faible | ⭐ Basse (optionnel) |
| **Phase 5: Polish** | 2 sem | 🔥🔥 Moyen | 🎯🎯 Moyen | ⭐⭐⭐ Haute |
| **Total** | **10 sem** | - | - | - |

---

## Références et Sources

### Standards et Spécifications

- [Conventional Commits Specification](https://www.conventionalcommits.org/en/v1.0.0/)
- [Semantic Versioning](https://semver.org/)

### Recherches Académiques

- [Generating Commit Messages from Git Diffs](https://arxiv.org/pdf/1911.11690) - Sven van Hal
- [Using Large Language Models for Commit Message Generation: A Preliminary Study](https://arxiv.org/html/2401.05926v2)
- [A Review on Edge Large Language Models: Design, Execution, and Applications](https://arxiv.org/html/2410.11845v2)
- [Generative AI on the Edge: Architecture and Performance Evaluation](https://arxiv.org/html/2411.17712v1)

### Articles et Blogs

- [Understanding Agentic Concepts in LLM Workflows](https://medium.com/@pankaj_pandey/understanding-agentic-concepts-in-llm-workflows-fc8115504c06) - Pankaj Pandey, Medium
- [What Are Agentic Workflows? Patterns, Use Cases, Examples](https://weaviate.io/blog/what-are-agentic-workflows) - Weaviate
- [Agentic Workflow: Revolutionary Design for AI and LLM Agents](https://masterdai.blog/exploring-agentic-workflows-a-deep-dive-into-ai-enhanced-productivity/)
- [Building an AI Code Review Agent: Advanced Diffing, Parsing, and Agentic Workflows](https://baz.co/resources/building-an-ai-code-review-agent-advanced-diffing-parsing-and-agentic-workflows) - Baz.co
- [Automatic Git commit message with llm, chain-of-thought and structured output](https://www.samuelliedtke.com/blog/automatic-git-commit-message-llm-chain-of-thought-structured-output/) - Samuel Liedtke
- [Use AI to Write Your Git Commit Messages](https://dustindavis.me/blog/use-ai-to-write-your-git-commit-messages/) - Dustin Davis
- [Git Commit: When AI Met Human Insight](https://medium.com/versent-tech-blog/git-commit-when-ai-met-human-insight-c3ae00f03cfb) - Corin Lawson, Versent

### Outils et Technologies

- [GitHub - Nutlope/aicommits](https://github.com/Nutlope/aicommits) - CLI for AI-generated commits
- [LLMCommit - AI-Powered Git Commit Message Generator](https://dev.to/kaz123/llmcommit-ai-powered-git-commit-message-generator-in-25-seconds-58op)
- [Tree-Sitter](https://tree-sitter.github.io/tree-sitter/) - Incremental parsing library
- [Difftastic](https://difftastic.wilfred.me.uk/) - Language-aware structural diff
- [Ollama](https://ollama.com/) - Local LLM runtime
- [LangChain - Workflows and Agents](https://docs.langchain.com/oss/python/langgraph/workflows-agents)

### Modèles Légers

- [Top Lightweight AI Models for Edge Voice Solutions](https://smallest.ai/blog/lightweight-ai-models-edge-voice-solutions)
- [Harnessing the Power of LLM Models on Arm CPUs for Edge Devices](https://www.edge-ai-vision.com/2025/01/harnessing-the-power-of-llm-models-on-arm-cpus-for-edge-devices/)
- [How to Build Lightweight Models for Edge Devices](https://medium.com/@heyamit10/how-to-build-lightweight-models-for-edge-devices-a-practical-guide-109ede62f480) - Amit, Medium
- [Optimizing Edge AI: A Comprehensive Survey](https://arxiv.org/html/2501.03265v1)

### Perspectives Développeurs (2025)

- [Developers Debate the Value of AI-Generated Git Commit Messages](https://biggo.com/news/202503261914_Developers_Debate_AI_Commit_Messages) - BigGo News

---

## Annexes

### A. Exemples de Commits de Qualité (Style Claude Code)

#### Exemple 1: Feature Addition

```
feat(ai): structured diff analysis for AI commit generation

Introduce DiffAnalyzer service to extract meaningful metadata from diffs.

The analyzer detects:
- Modified symbols (functions, classes, types)
- Change patterns (feat, fix, refactor, test)
- File relationships and importance
- Complexity assessment

This structured analysis provides rich context to guide AI-generated
commit messages, enabling more accurate and semantic descriptions.
```

**Analyse**:
- ✅ Subject sémantique ("structured diff analysis")
- ✅ Body structuré avec bullet points
- ✅ Explication du pourquoi ("provides rich context")
- ✅ Impact clair ("more accurate descriptions")

#### Exemple 2: Refactoring

```
refactor(domain): extract CommitType and CommitSubject value objects

Extract validation logic from CommitMessage entity into dedicated
value objects for improved testability and separation of concerns.

CommitType encapsulates type validation and enum constraints.
CommitSubject handles subject length limits and formatting rules.

This refactoring follows Clean Architecture principles by isolating
validation logic into immutable value objects.
```

**Analyse**:
- ✅ Subject précis (nomme les value objects créés)
- ✅ Explication du why ("improved testability")
- ✅ Détails de responsabilités
- ✅ Contexte architectural ("Clean Architecture principles")

#### Exemple 3: Bug Fix

```
fix(commit): handle empty scope correctly in message formatting

Fix CommitMessage.format() to omit parentheses when scope is empty.

Previously, messages with no scope would render as "feat(): subject"
with empty parentheses. Now correctly renders as "feat: subject".

Added test case to prevent regression.
```

**Analyse**:
- ✅ Subject descriptif du bug exact
- ✅ Explication before/after
- ✅ Mention des tests ajoutés
- ✅ Clarté pour quelqu'un qui n'a pas vu le diff

---

**Fin du document**

Ce document sera mis à jour au fur et à mesure de l'implémentation et des retours d'expérience.
