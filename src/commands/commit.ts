import inquirer from 'inquirer';
import chalk from 'chalk';
import type { CommitConfig, CommitAnswers } from '../types.js';
import { loadConfig } from '../utils/config.js';
import { formatCommitMessage } from '../utils/validate.js';
import {
  isGitRepository,
  hasChanges,
  getModifiedFiles,
  stageAll,
  createCommit,
} from '../utils/git.js';

export async function commitCommand(): Promise<void> {
  try {
    // Vérifier qu'on est dans un repo Git
    const isRepo = await isGitRepository();
    if (!isRepo) {
      console.error(chalk.red('❌ Erreur: Vous n\'êtes pas dans un dépôt Git'));
      process.exit(1);
    }

    // Vérifier qu'il y a des changements
    const changes = await hasChanges();
    if (!changes) {
      console.log(chalk.yellow('⚠️  Aucun changement à commiter'));
      process.exit(0);
    }

    // Afficher les fichiers modifiés
    const files = await getModifiedFiles();
    console.log(chalk.blue('\n📝 Fichiers modifiés:'));
    files.forEach(file => console.log(chalk.gray(`  - ${file}`)));
    console.log();

    // Charger la configuration
    const config: CommitConfig = await loadConfig();

    // Questions interactives
    const answers = await askCommitQuestions(config);

    // Générer le message de commit
    const message = formatCommitMessage(
      answers.type,
      answers.scope || undefined,
      answers.subject,
      answers.body,
      answers.breaking,
      answers.breakingDescription
    );

    // Afficher le message généré
    console.log(chalk.blue('\n📋 Message de commit généré:'));
    console.log(chalk.cyan(message));
    console.log();

    // Confirmer
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Voulez-vous créer ce commit ?',
        default: true,
      },
    ]);

    if (!confirm) {
      console.log(chalk.yellow('❌ Commit annulé'));
      process.exit(0);
    }

    // Stage tous les fichiers et créer le commit
    await stageAll();
    await createCommit(message);

    console.log(chalk.green('✅ Commit créé avec succès !'));
  } catch (error) {
    console.error(chalk.red('❌ Erreur:'), error);
    process.exit(1);
  }
}

async function askCommitQuestions(config: CommitConfig): Promise<CommitAnswers> {
  const questions: any[] = [
    {
      type: 'list',
      name: 'type',
      message: 'Sélectionnez le type de commit:',
      choices: config.types?.map(t => ({
        name: t.name,
        value: t.value,
      })),
    },
  ];

  // Question pour le scope
  if (config.scopes && config.scopes.length > 0) {
    const scopeChoices = [...config.scopes];
    if (config.allowCustomScopes) {
      scopeChoices.push('(aucun / personnalisé)');
    }

    questions.push({
      type: 'list',
      name: 'scope',
      message: 'Sélectionnez le scope (optionnel):',
      choices: scopeChoices,
      default: '(aucun / personnalisé)',
    });

    questions.push({
      type: 'input',
      name: 'customScope',
      message: 'Entrez un scope personnalisé:',
      when: (answers: any) => answers.scope === '(aucun / personnalisé)',
    });
  } else if (config.allowCustomScopes) {
    questions.push({
      type: 'input',
      name: 'customScope',
      message: 'Scope (optionnel):',
    });
  }

  // Question pour le sujet
  questions.push({
    type: 'input',
    name: 'subject',
    message: `Description courte (${config.minSubjectLength}-${config.maxSubjectLength} caractères):`,
    validate: (input: string) => {
      const length = input.trim().length;
      if (length < (config.minSubjectLength || 3)) {
        return `La description doit contenir au moins ${config.minSubjectLength} caractères`;
      }
      if (length > (config.maxSubjectLength || 100)) {
        return `La description ne doit pas dépasser ${config.maxSubjectLength} caractères`;
      }
      return true;
    },
  });

  // Question pour le body
  questions.push({
    type: 'input',
    name: 'body',
    message: 'Description longue (optionnel):',
  });

  // Question pour breaking change
  questions.push({
    type: 'confirm',
    name: 'breaking',
    message: 'Est-ce un changement majeur (breaking change) ?',
    default: false,
  });

  questions.push({
    type: 'input',
    name: 'breakingDescription',
    message: 'Décrivez le changement majeur:',
    when: (answers: any) => answers.breaking,
  });

  const answers = await inquirer.prompt(questions);

  // Déterminer le scope final
  let finalScope = '';
  if (answers.customScope) {
    finalScope = answers.customScope.trim();
  } else if (answers.scope && answers.scope !== '(aucun / personnalisé)') {
    finalScope = answers.scope;
  }

  return {
    type: answers.type,
    scope: finalScope,
    subject: answers.subject.trim(),
    body: answers.body?.trim(),
    breaking: answers.breaking,
    breakingDescription: answers.breakingDescription?.trim(),
  };
}
