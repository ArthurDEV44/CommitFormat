import { promises as fs } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

export interface StoredCredentials {
  github_token?: string;
  github_username?: string;
  github_email?: string;
}

/**
 * Chemin du fichier de credentials dans le dossier home de l'utilisateur
 */
function getCredentialPath(): string {
  return join(homedir(), '.gortex-credentials');
}

/**
 * Charge les credentials depuis le fichier
 */
export async function getCredentialStore(): Promise<StoredCredentials> {
  try {
    const path = getCredentialPath();
    const content = await fs.readFile(path, 'utf-8');
    return JSON.parse(content);
  } catch {
    // Fichier n'existe pas ou erreur de lecture
    return {};
  }
}

/**
 * Sauvegarde les credentials dans le fichier
 */
export async function saveCredentials(credentials: StoredCredentials): Promise<void> {
  const path = getCredentialPath();
  const existing = await getCredentialStore();
  const merged = { ...existing, ...credentials };

  try {
    await fs.writeFile(path, JSON.stringify(merged, null, 2), {
      mode: 0o600, // Lecture/écriture pour le propriétaire seulement
    });
  } catch (error: any) {
    throw new Error(`Failed to save credentials: ${error.message}`);
  }
}

/**
 * Supprime toutes les credentials GitHub
 */
export async function clearCredentials(): Promise<void> {
  const path = getCredentialPath();
  const existing = await getCredentialStore();

  // Supprimer uniquement les credentials GitHub
  delete existing.github_token;
  delete existing.github_username;
  delete existing.github_email;

  try {
    if (Object.keys(existing).length === 0) {
      // Si le fichier est vide, le supprimer
      await fs.unlink(path);
    } else {
      // Sinon, réécrire avec les autres credentials
      await fs.writeFile(path, JSON.stringify(existing, null, 2), {
        mode: 0o600,
      });
    }
  } catch (error: any) {
    // Ignorer si le fichier n'existe pas
    if (error.code !== 'ENOENT') {
      throw new Error(`Failed to clear credentials: ${error.message}`);
    }
  }
}

/**
 * Vérifie si des credentials GitHub existent
 */
export async function hasGitHubCredentials(): Promise<boolean> {
  const credentials = await getCredentialStore();
  return !!credentials.github_token;
}
