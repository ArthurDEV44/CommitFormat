import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import { Confirm } from '../ui/index.js';
import { hasRemote, getDefaultRemote, hasUpstream, pushToRemote, pushWithGitHubToken, isHttpsRemote, getRemoteUrl } from '../utils/git.js';
import { isAuthenticated, getGitHubCredentials, type GitHubAuthResult } from '../auth/github-oauth.js';
import { GitHubAuth } from './GitHubAuth.js';

interface PushPromptProps {
  branch: string;
  onComplete: () => void;
}

type PushStep = 'checking' | 'no-remote' | 'ssh-confirm' | 'https-auth' | 'https-no-auth' | 'pushing' | 'success' | 'error';

export const PushPrompt: React.FC<PushPromptProps> = ({ branch, onComplete }) => {
  const [step, setStep] = useState<PushStep>('checking');
  const [remoteExists, setRemoteExists] = useState(false);
  const [isHttps, setIsHttps] = useState(false);
  const [remoteUrl, setRemoteUrl] = useState<string>('');
  const [hasGitHubAuth, setHasGitHubAuth] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkRemote = async () => {
      const exists = await hasRemote();
      setRemoteExists(exists);

      if (!exists) {
        setStep('no-remote');
        return;
      }

      const remote = await getDefaultRemote();
      const httpsCheck = await isHttpsRemote(remote);
      const url = await getRemoteUrl(remote);
      setIsHttps(httpsCheck);
      setRemoteUrl(url || '');

      // Vérifier si l'utilisateur est déjà authentifié avec GitHub
      if (httpsCheck) {
        const authenticated = await isAuthenticated();
        setHasGitHubAuth(authenticated);
        setStep(authenticated ? 'https-auth' : 'https-auth');
      } else {
        // Remote SSH, on peut push directement
        setStep('ssh-confirm');
      }
    };
    checkRemote();
  }, []);

  // Handler pour le résultat de l'authentification GitHub
  const handleGitHubAuthComplete = async (result: GitHubAuthResult | null) => {
    if (!result) {
      // L'utilisateur a annulé ou erreur
      setStep('https-no-auth');
      return;
    }

    // Authentification réussie, procéder au push
    setHasGitHubAuth(true);
    await handlePush(result.token);
  };

  // Handler pour push avec ou sans token
  const handlePush = async (token?: string) => {
    setStep('pushing');

    try {
      const remote = await getDefaultRemote();
      const upstream = await hasUpstream();

      if (token) {
        // Push avec token GitHub
        await pushWithGitHubToken(token, remote, branch, !upstream);
      } else {
        // Push normal (SSH)
        await pushToRemote(remote, branch, !upstream);
      }

      setStep('success');
      setTimeout(() => {
        onComplete();
      }, 1500);
    } catch (err: any) {
      setError(err.message);
      setStep('error');
    }
  };

  // Handler pour confirmer le push (SSH)
  const handleSSHConfirm = async (shouldPush: boolean) => {
    if (!shouldPush) {
      onComplete();
      return;
    }
    await handlePush();
  };

  // Handler pour confirmer le push (HTTPS avec auth existante)
  const handleHTTPSConfirm = async (shouldPush: boolean) => {
    if (!shouldPush) {
      onComplete();
      return;
    }

    const credentials = await getGitHubCredentials();
    if (credentials?.github_token) {
      await handlePush(credentials.github_token);
    } else {
      setStep('error');
      setError('GitHub credentials not found');
    }
  };

  // Vérification en cours
  if (step === 'checking') {
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text bold color="blue">🚀 Étape 5/5: Push vers le remote</Text>
        </Box>
        <Text color="cyan">
          <Spinner type="dots" /> Vérification du remote...
        </Text>
      </Box>
    );
  }

  // Pas de remote
  if (step === 'no-remote') {
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text bold color="blue">🚀 Étape 5/5: Push vers le remote</Text>
        </Box>
        <Text color="yellow">⚠️  Aucun remote configuré, impossible de push</Text>
        <Box marginTop={1}>
          <Text dimColor>💡 Continuez manuellement avec : git push</Text>
        </Box>
      </Box>
    );
  }

  // Remote SSH - demander confirmation
  if (step === 'ssh-confirm') {
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text bold color="blue">🚀 Étape 5/5: Push vers le remote</Text>
        </Box>
        <Box marginBottom={1}>
          <Text>Remote SSH détecté: <Text dimColor>{remoteUrl}</Text></Text>
        </Box>
        <Confirm message="Voulez-vous push vers le remote ?" defaultValue={true} onSubmit={handleSSHConfirm} />
      </Box>
    );
  }

  // Remote HTTPS - flux d'authentification GitHub
  if (step === 'https-auth') {
    if (hasGitHubAuth) {
      // Utilisateur déjà authentifié, demander confirmation
      return (
        <Box flexDirection="column">
          <Box marginBottom={1}>
            <Text bold color="blue">🚀 Étape 5/5: Push vers le remote</Text>
          </Box>
          <Box flexDirection="column" marginBottom={1}>
            <Text color="green">✓ Authentifié avec GitHub</Text>
            <Text dimColor>Remote: {remoteUrl}</Text>
          </Box>
          <Confirm message="Voulez-vous push vers le remote ?" defaultValue={true} onSubmit={handleHTTPSConfirm} />
        </Box>
      );
    } else {
      // Proposer l'authentification GitHub
      return <GitHubAuth onComplete={handleGitHubAuthComplete} />;
    }
  }

  // Remote HTTPS sans authentification (annulé ou erreur)
  if (step === 'https-no-auth') {
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text bold color="blue">🚀 Étape 5/5: Push vers le remote</Text>
        </Box>
        <Box flexDirection="column" marginBottom={1}>
          <Text color="yellow">⚠️  Remote HTTPS sans authentification</Text>
          <Text dimColor>URL: {remoteUrl}</Text>
        </Box>
        <Box flexDirection="column" marginBottom={1} paddingLeft={2}>
          <Text>Veuillez push manuellement avec :</Text>
        </Box>
        <Box flexDirection="column" paddingLeft={4} marginBottom={1}>
          <Text bold color="cyan">git push origin {branch}</Text>
        </Box>
        <Box flexDirection="column" paddingLeft={2} marginTop={1}>
          <Text bold>💡 Pour éviter ce problème à l'avenir :</Text>
          <Text dimColor>• Option 1 : Configurez SSH (recommandé)</Text>
          <Text dimColor>  → https://docs.github.com/en/authentication/connecting-to-github-with-ssh</Text>
          <Text dimColor>• Option 2 : Utilisez l'authentification GitHub via Gortex</Text>
        </Box>
      </Box>
    );
  }

  // Push en cours
  if (step === 'pushing') {
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text bold color="blue">🚀 Étape 5/5: Push vers le remote</Text>
        </Box>
        <Text color="cyan">
          <Spinner type="dots" /> Push en cours vers {remoteUrl}...
        </Text>
      </Box>
    );
  }

  // Succès
  if (step === 'success') {
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text bold color="blue">🚀 Étape 5/5: Push vers le remote</Text>
        </Box>
        <Text color="green">✓ Push réussi vers {remoteUrl}</Text>
      </Box>
    );
  }

  // Erreur
  if (step === 'error') {
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text bold color="blue">🚀 Étape 5/5: Push vers le remote</Text>
        </Box>
        <Text color="red">❌ Erreur lors du push: {error}</Text>
        <Text color="yellow">💡 Vous pouvez push manuellement avec: git push origin {branch}</Text>
      </Box>
    );
  }

  return null;
};
