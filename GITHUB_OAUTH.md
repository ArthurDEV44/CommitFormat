# 🔐 GitHub OAuth Authentication

## Vue d'ensemble

Gortex CLI v3.0.1 intègre l'authentification GitHub OAuth pour permettre le push automatique vers les repositories HTTPS sans configuration SSH ni credential helper.

## Fonctionnement

### GitHub Device Flow

Gortex utilise le **GitHub Device Flow**, la méthode d'authentification recommandée pour les applications CLI. C'est le même système utilisé par GitHub CLI (`gh`) et d'autres outils professionnels.

**Avantages du Device Flow:**
- ✅ Aucune redirection HTTP locale requise
- ✅ Aucun serveur web à démarrer
- ✅ Fonctionne dans les environnements restreints (SSH, containers, etc.)
- ✅ Expérience utilisateur simple et sécurisée
- ✅ Pas besoin de client secret (plus sécurisé pour les CLI)

### Workflow d'authentification

1. **Détection automatique**: Lorsque vous essayez de push vers un remote HTTPS, Gortex détecte automatiquement si vous êtes authentifié

2. **Proposition d'authentification**: Si non authentifié, Gortex propose l'authentification GitHub

3. **Device Flow**:
   - Gortex affiche un code de vérification (ex: `ABCD-1234`)
   - Vous ouvrez `https://github.com/login/device` dans votre navigateur
   - Vous entrez le code
   - Vous autorisez Gortex CLI
   - Le token est automatiquement sauvegardé

4. **Push automatique**: Une fois authentifié, Gortex peut push automatiquement sans demander de credentials

## Utilisation

### Première utilisation

```bash
# Créer un commit avec Gortex
gortex commit

# 1. Sélectionner la branche
# 2. Sélectionner les fichiers
# 3. Générer le message (AI ou manuel)
# 4. Confirmer le commit
# 5. Lors du push, Gortex propose l'authentification

🔐 Authentification GitHub

Pour push automatiquement, Gortex a besoin d'accéder à votre compte GitHub.
Cela utilisera le GitHub Device Flow (sécurisé).

Voulez-vous vous authentifier avec GitHub ? (y/n)

# Si vous acceptez:

🔐 Authentification GitHub
✓ Device Flow initialisé

Étape 1 : Ouvrez cette URL dans votre navigateur
https://github.com/login/device

Étape 2 : Entrez ce code de vérification
  ABCD-1234

⠋ En attente de votre autorisation...
Le code expire dans 15 minutes

# Après autorisation dans le navigateur:

✓ Authentification réussie !
Compte: votre-username
Email: votre@email.com

Credentials sauvegardés de manière sécurisée.

# Le push s'effectue automatiquement
⠋ Push en cours vers https://github.com/user/repo.git...
✓ Push réussi vers https://github.com/user/repo.git
```

### Utilisations suivantes

Une fois authentifié, Gortex utilise automatiquement votre token sauvegardé:

```bash
gortex commit

# Workflow normal jusqu'au push

🚀 Étape 5/5: Push vers le remote

✓ Authentifié avec GitHub
Remote: https://github.com/user/repo.git

Voulez-vous push vers le remote ? (y/n)

# Le push s'effectue automatiquement avec votre token
```

### Vérifier le statut d'authentification

Vous pouvez voir votre statut d'authentification dans l'onglet Credentials:

```bash
gortex

# Appuyez sur Tab ou → pour aller dans l'onglet Credentials
# Ou appuyez sur 1 directement

╭────────────────────────────────────╮
│ 🔑 Gestion des Credentials        │
├────────────────────────────────────┤
│                                    │
│ GitHub Authentication              │
│ Statut: ✓ Authentifié              │
│ Compte: votre-username             │
│ Email: votre@email.com             │
│                                    │
│ AI Providers                       │
│ Mistral AI: ✖ Non configuré        │
│ OpenAI: ✖ Non configuré             │
│ Ollama (Local): Pas de clé requise │
│                                    │
╰────────────────────────────────────╯
```

## Stockage sécurisé

### Emplacement

Les credentials GitHub sont stockés dans:
```
~/.gortex-credentials
```

### Permissions

Le fichier est créé avec les permissions `600` (lecture/écriture pour le propriétaire seulement):
```bash
ls -la ~/.gortex-credentials
# -rw------- 1 user user 150 Nov 18 10:30 ~/.gortex-credentials
```

### Format

```json
{
  "github_token": "gho_xxxxxxxxxxxxxxxxxxxx",
  "github_username": "votre-username",
  "github_email": "votre@email.com"
}
```

**⚠️ Important**: Ne commitez JAMAIS ce fichier dans Git !

Le `.gitignore` devrait contenir:
```
.gortex-credentials
```

## Sécurité

### Token Scopes

Gortex demande uniquement les permissions nécessaires:
- `repo`: Accès aux repositories (lecture/écriture)
- `user:email`: Lecture de l'email pour la configuration Git

### Validation du token

À chaque utilisation, Gortex vérifie que le token est valide. Si le token est expiré ou révoqué:
- Gortex le supprime automatiquement
- Vous serez invité à vous réauthentifier

### Révocation manuelle

Pour révoquer l'accès de Gortex:

1. **Sur GitHub**:
   - Allez dans Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Trouvez "Gortex CLI" et cliquez "Revoke"

2. **Sur votre machine**:
   ```bash
   rm ~/.gortex-credentials
   ```

## Cas d'usage

### Remote HTTPS

**Scénario**: Votre repository utilise HTTPS
```bash
git remote -v
# origin  https://github.com/user/repo.git (fetch)
# origin  https://github.com/user/repo.git (push)
```

**Solution Gortex**: Authentification GitHub OAuth automatique

### Remote SSH

**Scénario**: Votre repository utilise SSH
```bash
git remote -v
# origin  git@github.com:user/repo.git (fetch)
# origin  git@github.com:user/repo.git (push)
```

**Comportement Gortex**: Push direct sans OAuth (utilise vos clés SSH)

### Pas de remote

**Scénario**: Repository local uniquement
```bash
git remote -v
# (vide)
```

**Comportement Gortex**: Affiche un message indiquant qu'aucun remote n'est configuré

## FAQ

### Q: Le token expire-t-il ?

**R**: Les tokens GitHub OAuth n'expirent généralement pas, sauf si:
- Vous révoquez le token manuellement
- GitHub détecte une activité suspecte
- Vous changez votre mot de passe GitHub (dans certains cas)

Gortex vérifie automatiquement la validité et redemande l'authentification si nécessaire.

### Q: Puis-je utiliser Gortex sur plusieurs machines ?

**R**: Oui ! Vous devrez vous authentifier sur chaque machine. Chaque machine aura son propre token stocké localement dans `~/.gortex-credentials`.

### Q: Que se passe-t-il si je refuse l'authentification ?

**R**: Gortex affiche un message avec la commande git push manuelle:
```
⚠️  Remote HTTPS sans authentification
Veuillez push manuellement avec :
    git push origin votre-branche
```

### Q: Puis-je toujours utiliser SSH ?

**R**: Absolument ! Si votre remote est configuré en SSH, Gortex l'utilise directement sans OAuth. SSH reste la méthode recommandée pour un usage quotidien.

### Q: Est-ce que Gortex stocke mon mot de passe GitHub ?

**R**: **Non**. Gortex ne voit jamais votre mot de passe. L'authentification se fait entièrement sur github.com, et Gortex reçoit uniquement un token d'accès limité.

### Q: Puis-je utiliser un Personal Access Token à la place ?

**R**: Actuellement non. Gortex utilise uniquement le Device Flow pour simplifier l'expérience. Si vous avez besoin d'utiliser un PAT, vous pouvez:
1. Configurer le git credential helper
2. Ou utiliser SSH à la place

### Q: Comment supprimer mes credentials ?

**R**:
```bash
# Supprimer le fichier de credentials
rm ~/.gortex-credentials

# Révoquer sur GitHub (optionnel)
# → Settings → Developer settings → Personal access tokens → Revoke
```

## Comparaison avec d'autres méthodes

| Méthode | Avantages | Inconvénients | Gortex Support |
|---------|-----------|---------------|----------------|
| **SSH** | Aucune interaction, très sécurisé | Nécessite configuration initiale | ✅ Natif |
| **HTTPS + credential helper** | Fonctionne partout | Configuration par machine | ⚠️ Manuel |
| **HTTPS + OAuth (Gortex)** | Configuration automatique, facile | Nécessite navigateur pour setup | ✅ Intégré |
| **Personal Access Token** | Flexible, scope granulaire | Gestion manuelle, expiration | ❌ Non supporté |

## Recommandations

Pour une utilisation quotidienne optimale:

1. **Développement personnel**: SSH (une fois configuré, rien à faire)
2. **Machine temporaire / nouvelle**: OAuth Gortex (setup en 30 secondes)
3. **CI/CD**: Personal Access Token ou Deploy Keys (plus de contrôle)
4. **Environnements restreints**: OAuth Gortex (fonctionne partout)

## Dépannage

### Le Device Flow ne fonctionne pas

**Symptômes**: Erreur lors de l'initialisation du Device Flow

**Solutions**:
1. Vérifiez votre connexion internet
2. Assurez-vous que github.com est accessible
3. Vérifiez que vous n'êtes pas derrière un proxy bloquant

### Le code expire avant que je puisse l'entrer

**Symptômes**: "Code expired" après avoir ouvert l'URL

**Solution**: Le code expire après 15 minutes. Recommencez le workflow Gortex.

### Token invalide après authentification

**Symptômes**: "GitHub credentials not found" immédiatement après auth

**Solutions**:
1. Vérifiez les permissions du fichier: `ls -la ~/.gortex-credentials`
2. Vérifiez le contenu: `cat ~/.gortex-credentials` (devrait être du JSON valide)
3. Supprimez et réauthentifiez: `rm ~/.gortex-credentials && gortex commit`

### Push échoue malgré l'authentification

**Symptômes**: Erreur lors du push même avec token valide

**Solutions**:
1. Vérifiez que vous avez les droits push sur le repository
2. Vérifiez que la branche n'est pas protégée
3. Essayez un push manuel pour voir le message d'erreur exact: `git push`

## Architecture technique

### Flux de données

```
┌─────────────┐
│  Gortex CLI │
└──────┬──────┘
       │
       │ 1. Initiate Device Flow
       ↓
┌──────────────────────┐
│ GitHub OAuth API     │
│ (device/code)        │
└──────┬───────────────┘
       │
       │ 2. Return device_code + user_code
       ↓
┌──────────────────────┐
│ User Browser         │
│ github.com/login     │
│ /device              │
└──────┬───────────────┘
       │
       │ 3. User enters code + authorizes
       ↓
┌──────────────────────┐
│ GitHub OAuth API     │
│ (oauth/access_token) │
└──────┬───────────────┘
       │
       │ 4. Poll until authorized → Return token
       ↓
┌──────────────────────┐
│ ~/.gortex-           │
│ credentials          │
└──────────────────────┘
       │
       │ 5. Use token for push
       ↓
┌──────────────────────┐
│ git push with        │
│ authenticated URL    │
└──────────────────────┘
```

### Composants

- **`src/auth/github-oauth.ts`**: Logique d'authentification OAuth
- **`src/auth/credential-store.ts`**: Stockage sécurisé des credentials
- **`src/components/GitHubAuth.tsx`**: UI d'authentification Device Flow
- **`src/components/PushPrompt.tsx`**: Intégration push avec détection HTTPS/SSH
- **`src/utils/git.ts`**: `pushWithGitHubToken()` pour push authentifié

## Références

- [GitHub OAuth Device Flow Documentation](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#device-flow)
- [Octokit auth-oauth-device](https://github.com/octokit/auth-oauth-device.js)
- [GitHub CLI (gh) - Inspiration](https://github.com/cli/cli)

---

**Version**: 3.0.1
**Date**: November 18, 2025
**License**: MIT
