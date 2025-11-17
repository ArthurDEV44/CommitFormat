# Guide de publication sur npm

Ce guide vous accompagne pour publier CommitFormat sur le registre npm.

## ✅ Checklist pré-publication

Avant de publier, vérifiez que :

- [x] Les dépendances sont installées (`pnpm install`)
- [x] Le code compile sans erreur (`pnpm run typecheck`)
- [x] Le build est réussi (`pnpm run build`)
- [x] Le CLI fonctionne en local (`node dist/index.js --help`)
- [x] La LICENSE est ajoutée
- [x] Le CHANGELOG.md est à jour
- [x] Le .npmignore exclut les fichiers de dev
- [x] Le package.json est complet
- [ ] Le nom du package est disponible sur npm
- [ ] Vous avez un compte npm
- [ ] Vous avez testé dans un vrai repo Git

## Étape 1 : Vérifier la disponibilité du nom

Le nom "commitformat" pourrait être déjà pris. Vérifiez sur https://www.npmjs.com/package/commitformat

### Si le nom est pris

Choisissez un autre nom et modifiez `package.json` :

```json
{
  "name": "@votre-username/commitformat",
  // ou
  "name": "commitformat-cli",
  // ou
  "name": "commit-format-tool"
}
```

**Important** : Les packages scoped (@username/package) sont gratuits et toujours disponibles !

## Étape 2 : Créer un compte npm (si nécessaire)

### Via le site web
1. Allez sur https://www.npmjs.com/signup
2. Créez votre compte

### Via le CLI
```bash
npm adduser
```

Suivez les instructions pour :
- Entrer votre username
- Entrer votre password
- Entrer votre email
- Vérifier votre email

## Étape 3 : Se connecter à npm

```bash
npm login
```

Vérifiez que vous êtes connecté :
```bash
npm whoami
```

## Étape 4 : Mettre à jour les informations du package

Éditez `package.json` et remplacez :

```json
{
  "author": "Votre Nom <votre@email.com>",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/VOTRE-USERNAME/commitformat.git"
  },
  "bugs": {
    "url": "https://github.com/VOTRE-USERNAME/commitformat/issues"
  },
  "homepage": "https://github.com/VOTRE-USERNAME/commitformat#readme"
}
```

## Étape 5 : Test final du package

### Vérifier le contenu du package

```bash
npm pack --dry-run
```

Vous devriez voir :
```
✓ .commitformatrc.example
✓ CHANGELOG.md
✓ LICENSE
✓ README.md
✓ dist/index.d.mts
✓ dist/index.js
✓ package.json
```

**Important** : Vérifiez qu'il n'y a PAS :
- ❌ src/ (code source)
- ❌ node_modules/
- ❌ fichiers de lock
- ❌ fichiers de configuration de dev

### Test en local

Créez un package local :
```bash
npm pack
```

Cela crée `commitformat-1.0.0.tgz`

Testez-le dans un autre dossier :
```bash
cd /tmp
mkdir test-install
cd test-install
npm install /home/sauron/code/CommitFormat/commitformat-1.0.0.tgz

# Testez
npx commitformat --help
```

## Étape 6 : Initialiser Git (important pour la publication)

```bash
cd /home/sauron/code/CommitFormat
git init
git add .
git commit -m "feat: initial release of commitformat CLI"
```

## Étape 7 : Publier sur npm

### Publication publique (gratuit)

```bash
npm publish
```

### Publication scoped (si vous utilisez @username/package)

```bash
npm publish --access public
```

### Voir la publication

Votre package sera disponible à :
- https://www.npmjs.com/package/commitformat (ou votre nom)

## Étape 8 : Vérification post-publication

### Test d'installation depuis npm

Dans un nouveau terminal :

```bash
# Test global
npm install -g commitformat
commitformat --help

# Test npx
npx commitformat --help

# Test avec pnpm
pnpm dlx commitformat --help

# Test avec bun
bunx commitformat --help
```

### Tester dans un vrai repo

```bash
cd /tmp
mkdir test-repo
cd test-repo
git init
echo "test" > file.txt
npx commitformat
```

## Étape 9 : Créer un repo GitHub (optionnel mais recommandé)

1. Créez un repo sur GitHub : https://github.com/new
2. Nom : `commitformat`
3. Public
4. Sans README (vous en avez déjà un)

Puis poussez votre code :

```bash
cd /home/sauron/code/CommitFormat
git remote add origin https://github.com/VOTRE-USERNAME/commitformat.git
git branch -M main
git push -u origin main
```

Créez un tag pour la version :

```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

## Étape 10 : Créer une release GitHub (optionnel)

1. Allez sur votre repo GitHub
2. Cliquez sur "Releases" > "Create a new release"
3. Tag : `v1.0.0`
4. Title : `v1.0.0 - Initial Release`
5. Description : Copiez le contenu du CHANGELOG.md
6. Publiez

## Futures publications (mises à jour)

### Patch (1.0.0 → 1.0.1)
Pour corrections de bugs :
```bash
npm version patch
npm publish
git push && git push --tags
```

### Minor (1.0.0 → 1.1.0)
Pour nouvelles fonctionnalités (non breaking) :
```bash
npm version minor
npm publish
git push && git push --tags
```

### Major (1.0.0 → 2.0.0)
Pour breaking changes :
```bash
npm version major
npm publish
git push && git push --tags
```

## Dépublication (en cas d'erreur)

**Attention** : Vous avez 72h pour dépublier une version.

```bash
npm unpublish commitformat@1.0.0
```

Pour supprimer complètement le package :
```bash
npm unpublish commitformat --force
```

## Troubleshooting

### Erreur "package name already exists"

Le nom est pris. Utilisez :
- Un package scoped : `@votre-username/commitformat`
- Un autre nom : `commitformat-cli`, `commit-formatter`, etc.

### Erreur "You do not have permission to publish"

Vous n'êtes pas connecté ou n'avez pas les droits :
```bash
npm login
npm whoami
```

### Erreur "Package size too large"

Vérifiez .npmignore et supprimez les gros fichiers :
```bash
npm pack --dry-run
```

### Le CLI ne fonctionne pas après installation

Vérifiez :
1. Le shebang dans dist/index.js : `#!/usr/bin/env node`
2. Les permissions : `chmod +x dist/index.js`
3. Le champ `bin` dans package.json

## Badges pour le README (optionnel)

Ajoutez ces badges dans votre README.md :

```markdown
[![npm version](https://badge.fury.io/js/commitformat.svg)](https://www.npmjs.com/package/commitformat)
[![npm downloads](https://img.shields.io/npm/dm/commitformat.svg)](https://www.npmjs.com/package/commitformat)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
```

## Analytics et statistiques

Consultez les stats de votre package :
- https://www.npmjs.com/package/commitformat
- https://npm-stat.com/charts.html?package=commitformat

## Support

Pour les questions sur la publication npm :
- [npm documentation](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [npm support](https://www.npmjs.com/support)

## Félicitations ! 🎉

Votre package est maintenant disponible publiquement et peut être utilisé par des développeurs du monde entier !

N'oubliez pas de :
- ⭐ Demander des stars sur GitHub
- 📢 Partager sur les réseaux sociaux
- 📝 Écrire un article de blog
- 💬 Répondre aux issues et pull requests
