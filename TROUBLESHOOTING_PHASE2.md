# Troubleshooting Phase 2 - Reflection Pattern

## Problème: Le workflow reste bloqué à "Génération initiale du message..."

### Diagnostic

1. **Activer le mode debug**:
```bash
export GORTEX_DEBUG=true
pnpm start
# ou
GORTEX_DEBUG=true node dist/index.js commit
```

2. **Vérifier Ollama**:
```bash
# Vérifier si Ollama est en cours d'exécution
curl http://localhost:11434/api/tags

# Si erreur, démarrer Ollama
ollama serve
```

3. **Vérifier le modèle**:
```bash
# Lister les modèles disponibles
ollama list

# Si magistral:24b n'est pas présent, le télécharger
ollama pull magistral:24b
```

4. **Vérifier les logs**:
```bash
# Mode debug affiche:
# [AgenticAICommitGenerator] Starting generation with provider: Ollama
# [AgenticAICommitGenerator] Result: {...}
```

### Causes Communes

#### 1. Ollama n'est pas démarré
**Symptôme**: Blocage sans message d'erreur
**Solution**:
```bash
ollama serve
```

#### 2. Modèle non téléchargé
**Symptôme**: Erreur "model not found"
**Solution**:
```bash
ollama pull magistral:24b
```

#### 3. Timeout du modèle
**Symptôme**: Erreur après 120s
**Solution**: Augmenter timeout dans `.gortexrc`:
```json
{
  "ai": {
    "ollama": {
      "timeout": 180000
    }
  }
}
```

#### 4. Mémoire insuffisante
**Symptôme**: Ollama crash ou très lent
**Solution**: Utiliser un modèle plus léger:
```json
{
  "ai": {
    "ollama": {
      "model": "llama3.2:3b"
    }
  }
}
```

#### 5. Erreur dans le use case
**Symptôme**: Exception non catchée
**Solution**: Regarder les logs avec GORTEX_DEBUG=true

### Test Manuel Rapide

```bash
# 1. Build
pnpm build

# 2. Vérifier Ollama
curl http://localhost:11434/api/tags

# 3. Créer des changements de test
echo "// Test" >> test.ts
git add test.ts

# 4. Tester avec debug
GORTEX_DEBUG=true node dist/index.js commit
```

### Vérification du Workflow

Le workflow doit afficher (en mode debug):
1. `[AgenticAICommitGenerator] Starting generation with provider: Ollama`
2. Appels au use case
3. Reflections (si GORTEX_DEBUG=true)
4. `[AgenticAICommitGenerator] Result: { success: true, iterations: X }`
5. Passage à l'étape "preview"

Si ça reste bloqué à l'étape 1, c'est probablement Ollama qui ne répond pas.

### Contournement Temporaire

Si le Reflection Pattern ne fonctionne pas, vous pouvez temporairement revenir à l'ancien workflow:

1. **Éditer** `src/components/CommitTab.tsx`:
```typescript
// Remplacer
import { AgenticAICommitGenerator } from "./AgenticAICommitGenerator.js";

// Par
import { AICommitGenerator } from "./AICommitGenerator.js";

// Et remplacer
<AgenticAICommitGenerator

// Par
<AICommitGenerator
```

2. **Rebuild**:
```bash
pnpm build
```

## Besoin d'Aide?

Si le problème persiste:
1. Partager les logs complets avec `GORTEX_DEBUG=true`
2. Vérifier la version d'Ollama: `ollama --version`
3. Vérifier les ressources système: `htop`
