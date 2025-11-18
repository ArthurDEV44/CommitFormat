# 🔧 Setup GitHub OAuth App pour Gortex CLI

## Pourquoi cette étape est nécessaire

GitHub nécessite que chaque application OAuth soit enregistrée avec un Client ID unique. Le Client ID actuel dans le code est un placeholder et doit être remplacé par un vrai.

## Créer une GitHub OAuth App

### Étape 1 : Créer l'OAuth App sur GitHub

1. Allez sur https://github.com/settings/developers
2. Cliquez sur "OAuth Apps" dans la barre latérale
3. Cliquez sur "New OAuth App"
4. Remplissez le formulaire :

```
Application name: Gortex CLI (ou "Gortex CLI - Dev" pour testing)
Homepage URL: https://github.com/ArthurDEV44/gortex-cli
Application description: Interactive Git workflow CLI with AI-powered commits
Authorization callback URL: http://localhost (pas utilisé pour Device Flow, mais requis)
```

5. Cliquez sur "Register application"
6. **IMPORTANT** : Copiez le **Client ID** affiché (format: `Ov23liXXXXXXXXXX`)

### Étape 2 : Activer Device Flow

**CRITICAL** : Par défaut, le Device Flow est désactivé pour des raisons de sécurité.

1. Sur la page de votre OAuth App, descendez jusqu'à "Device Flow"
2. Cochez la case **"Enable Device Flow"**
3. Cliquez sur "Update application"

Sans cette étape, vous obtiendrez l'erreur "Not Found" !

### Étape 3 : Mettre à jour le code

Remplacez le Client ID dans `src/auth/github-oauth.ts` :

```typescript
// Avant
const GITHUB_CLIENT_ID = 'Ov23li8pO3QoYZ5vRDtY'; // Placeholder

// Après
const GITHUB_CLIENT_ID = 'Ov23liXXXXXXXXXX'; // Votre vrai Client ID
```

### Étape 4 : Rebuild

```bash
npm run build
```

### Étape 5 : Tester

```bash
gortex commit
# Suivre le workflow jusqu'au push
# L'authentification GitHub devrait maintenant fonctionner !
```

## Variante : Utiliser une variable d'environnement

Pour éviter de hardcoder le Client ID dans le code source :

**Option A - Modification du code** :

```typescript
// src/auth/github-oauth.ts
const GITHUB_CLIENT_ID = process.env.GORTEX_GITHUB_CLIENT_ID || 'Ov23li8pO3QoYZ5vRDtY';
```

**Option B - Utilisation** :

```bash
# Dans votre terminal
export GORTEX_GITHUB_CLIENT_ID='Ov23liXXXXXXXXXX'

# Puis utiliser Gortex normalement
gortex commit
```

**Option C - Permanent dans .bashrc/.zshrc** :

```bash
echo 'export GORTEX_GITHUB_CLIENT_ID="Ov23liXXXXXXXXXX"' >> ~/.bashrc
source ~/.bashrc
```

## Pour la distribution publique

Si vous voulez publier Gortex CLI sur npm pour que d'autres l'utilisent :

### Option 1 : OAuth App publique (Recommandé)

Créez une OAuth App "officielle" pour Gortex CLI :
- Name: "Gortex CLI"
- Public access
- Client ID hardcodé dans le code source
- Les utilisateurs pourront s'authentifier avec cette app

**Avantages** :
- Les utilisateurs n'ont rien à configurer
- Expérience transparente
- Même système que GitHub CLI (`gh`)

**Inconvénients** :
- Vous êtes responsable de l'app
- Le Client ID est public (ce n'est pas un problème pour Device Flow)

### Option 2 : Chaque utilisateur crée sa propre app

Dans la documentation, expliquer que les utilisateurs doivent :
1. Créer leur propre OAuth App
2. Configurer `GORTEX_GITHUB_CLIENT_ID`

**Avantages** :
- Pas de responsabilité centralisée
- Utilisateurs contrôlent leur auth

**Inconvénients** :
- Setup complexe pour les utilisateurs
- Mauvaise expérience utilisateur

### Recommandation

Pour un produit public → **Option 1** (OAuth App officielle)

## FAQ

**Q: Le Client ID est-il sensible ?**
R: Non. Pour le Device Flow, seul le Client ID est nécessaire (pas de client secret). Il peut être public sans risque de sécurité.

**Q: Que se passe-t-il si je publie le Client ID dans le code source ?**
R: Aucun problème. GitHub CLI (`gh`) et tous les autres CLI OAuth font exactement ça. Le Client ID est conçu pour être public.

**Q: Puis-je révoquer l'accès ?**
R: Oui, sur la page de l'OAuth App, vous pouvez voir tous les tokens actifs et les révoquer si nécessaire.

**Q: Puis-je avoir plusieurs OAuth Apps (dev, prod, etc.) ?**
R: Oui ! Créez plusieurs apps :
- "Gortex CLI - Dev" pour vos tests
- "Gortex CLI" pour la production
Utilisez des Client IDs différents selon l'environnement.

## Vérification

Pour vérifier que votre OAuth App est bien configurée :

```bash
# Tester la requête device/code
curl -X POST https://github.com/login/device/code \
  -H "Accept: application/json" \
  -d "client_id=VOTRE_CLIENT_ID" \
  -d "scope=repo user:email"

# Réponse attendue (si Device Flow est activé) :
{
  "device_code": "...",
  "user_code": "ABCD-1234",
  "verification_uri": "https://github.com/login/device",
  "expires_in": 900,
  "interval": 5
}

# Erreur si Device Flow n'est pas activé :
{
  "error": "Not Found"
}
```

## Support

Si vous rencontrez des problèmes :
1. Vérifiez que Device Flow est activé
2. Vérifiez le Client ID (format: `Ov23li...`)
3. Vérifiez votre connexion internet
4. Essayez avec `curl` pour isoler le problème

---

**Important** : Pour vos tests immédiats, la solution la plus rapide est de créer une OAuth App sur votre compte GitHub personnel en suivant les étapes 1-4 ci-dessus.
