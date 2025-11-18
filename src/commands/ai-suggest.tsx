import React from 'react';
import { render } from 'ink';
import { loadConfig } from '../utils/config.js';
import { AISuggestWorkflow } from '../components/AISuggestWorkflow.js';

/**
 * Commande pour suggérer un message de commit avec AI
 */
export async function aiSuggestCommand(): Promise<void> {
  const config = await loadConfig();

  // Vérifie si l'AI est activée
  if (!config.ai?.enabled) {
    console.error('❌ AI non activée dans la configuration.');
    console.log('\nPour activer l\'AI, ajoutez dans votre .gortexrc :');
    console.log(JSON.stringify({
      ai: {
        enabled: true,
        provider: 'ollama', // ou 'mistral' ou 'openai'
      },
    }, null, 2));
    process.exit(1);
  }

  render(<AISuggestWorkflow config={config} />);
}
