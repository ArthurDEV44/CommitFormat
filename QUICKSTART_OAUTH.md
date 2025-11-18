# ⚡ Quick Start - GitHub OAuth Setup (5 minutes)

## Vous avez vu cette erreur ?

```
❌ Erreur d'authentification
GitHub authorization failed: {"error":"Not Found"}
```

C'est parce que le GitHub OAuth Client ID n'est pas encore configuré. Voici comment le faire en 5 minutes :

## Option 1 : Script automatique (Recommandé)

```bash
# Lancer le script d'aide
./scripts/setup-oauth.sh

# Suivre les instructions à l'écran
# Le script vous guidera pour :
# 1. Créer l'OAuth App sur GitHub
# 2. Configurer la variable d'environnement
# 3. Tester la configuration
```

## Option 2 : Configuration manuelle

### Étape 1 : Créer l'OAuth App (2 minutes)

1. **Ouvrir GitHub Developer Settings**
   ```
   https://github.com/settings/developers
   ```

2. **Créer une nouvelle OAuth App**
   - Cliquer sur "OAuth Apps" → "New OAuth App"

3. **Remplir le formulaire**
   ```
   Application name:     Gortex CLI - Dev
   Homepage URL:         https://github.com/ArthurDEV44/gortex-cli
   Description:          (optionnel)
   Callback URL:         http://localhost
   ```

4. **Cliquer "Register application"**

5. **⚠️ ÉTAPE CRITIQUE : Activer Device Flow**
   - Sur la page de votre OAuth App
   - Descendre jusqu'à "Device Flow"
   - **Cocher "Enable Device Flow"**
   - Cliquer "Update application"

   **Sans cette étape, vous obtiendrez l'erreur "Not Found" !**

6. **Copier le Client ID**
   - Format: `Ov23liXXXXXXXXXX`

### Étape 2 : Configurer la variable d'environnement (1 minute)

**Option A - Temporaire (pour tester)**

```bash
# Dans votre terminal actuel
export GORTEX_GITHUB_CLIENT_ID="Ov23liXXXXXXXXXX"

# Rebuild
npm run build

# Tester
gortex commit
```

**Option B - Permanent (recommandé)**

```bash
# Bash
echo 'export GORTEX_GITHUB_CLIENT_ID="Ov23liXXXXXXXXXX"' >> ~/.bashrc
source ~/.bashrc

# Zsh
echo 'export GORTEX_GITHUB_CLIENT_ID="Ov23liXXXXXXXXXX"' >> ~/.zshrc
source ~/.zshrc
```

### Étape 3 : Rebuild et tester

```bash
npm run build
gortex commit
```

## Vérification rapide

Pour vérifier que votre OAuth App est bien configurée :

```bash
# Tester avec curl
curl -X POST https://github.com/login/device/code \
  -H "Accept: application/json" \
  -d "client_id=VOTRE_CLIENT_ID" \
  -d "scope=repo user:email"
```

**Réponse attendue si Device Flow est activé :**
```json
{
  "device_code": "...",
  "user_code": "ABCD-1234",
  "verification_uri": "https://github.com/login/device",
  "expires_in": 900,
  "interval": 5
}
```

**Erreur si Device Flow n'est PAS activé :**
```json
{
  "error": "Not Found"
}
```

## Workflow complet après configuration

```bash
# 1. Créer un commit avec Gortex
gortex commit

# 2. Sélectionner branche/fichiers/message

# 3. Lors du push, Gortex propose l'authentification GitHub
🔐 Authentification GitHub
Voulez-vous vous authentifier avec GitHub ? (y)

# 4. Suivre les instructions Device Flow
Étape 1 : Ouvrez https://github.com/login/device
Étape 2 : Entrez le code: ABCD-1234

# 5. Autoriser dans le navigateur

# 6. Push automatique !
✓ Push réussi vers https://github.com/user/repo.git
```

## Dépannage

### Erreur: "Not Found"

**Cause:** Device Flow n'est pas activé sur votre OAuth App

**Solution:**
1. Retourner sur https://github.com/settings/developers
2. Cliquer sur votre OAuth App
3. Descendre jusqu'à "Device Flow"
4. Cocher "Enable Device Flow"
5. Cliquer "Update application"

### Erreur: "Client ID not configured"

**Cause:** La variable d'environnement n'est pas définie

**Solution:**
```bash
# Vérifier
echo $GORTEX_GITHUB_CLIENT_ID

# Si vide, configurer
export GORTEX_GITHUB_CLIENT_ID="Ov23liXXXXXXXXXX"
```

### Le push fonctionne mais j'ai toujours le placeholder

**Cause:** Build pas à jour

**Solution:**
```bash
npm run build
```

## Pour l'équipe / Production

Si vous voulez partager Gortex CLI avec votre équipe :

**Option 1 : OAuth App partagée (Recommandé)**

1. Créer une OAuth App "officielle" sur un compte d'organisation
2. Hardcoder le Client ID dans `src/auth/github-oauth.ts`
3. Rebuild et distribuer

**Option 2 : Chaque développeur configure sa propre app**

1. Documenter les étapes ci-dessus
2. Chaque dev crée sa propre OAuth App
3. Chaque dev configure sa variable d'environnement

## Questions ?

- **Q: Le Client ID est-il sensible ?**
  R: Non, il peut être public (pas de client secret pour Device Flow)

- **Q: Puis-je partager mon Client ID avec mon équipe ?**
  R: Oui ! Ou créez une OAuth App sur un compte d'organisation

- **Q: Que faire en production/npm ?**
  R: Créez une OAuth App officielle et hardcodez le Client ID

Pour plus de détails, voir `SETUP_GITHUB_OAUTH.md`

---

**Temps total estimé:** 5 minutes
**Difficulté:** Facile 🟢
