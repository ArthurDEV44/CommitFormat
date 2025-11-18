import React, { useState } from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import { Confirm } from '../ui/index.js';
import { authenticateWithDeviceFlow, type DeviceFlowResult, type GitHubAuthResult } from '../auth/github-oauth.js';

interface GitHubAuthProps {
  onComplete: (result: GitHubAuthResult | null) => void;
}

type AuthStep = 'prompt' | 'waiting' | 'success' | 'error' | 'cancelled';

export const GitHubAuth: React.FC<GitHubAuthProps> = ({ onComplete }) => {
  const [step, setStep] = useState<AuthStep>('prompt');
  const [deviceFlow, setDeviceFlow] = useState<DeviceFlowResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GitHubAuthResult | null>(null);

  const handleConfirm = async (shouldAuth: boolean) => {
    if (!shouldAuth) {
      setStep('cancelled');
      onComplete(null);
      return;
    }

    try {
      // Démarrer l'authentification avec callback pour la vérification
      const authResult = await authenticateWithDeviceFlow((verification) => {
        // Quand on reçoit les infos de vérification, afficher à l'utilisateur
        setDeviceFlow(verification);
        setStep('waiting');
      });

      setResult(authResult);
      setStep('success');

      // Compléter après un court délai
      setTimeout(() => {
        onComplete(authResult);
      }, 2000);
    } catch (err: any) {
      setError(err.message);
      setStep('error');
    }
  };

  // Prompt initial
  if (step === 'prompt') {
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text bold color="blue">🔐 Authentification GitHub</Text>
        </Box>
        <Box flexDirection="column" marginBottom={1}>
          <Text>Pour push automatiquement, Gortex a besoin d'accéder à votre compte GitHub.</Text>
          <Text dimColor>Cela utilisera le GitHub Device Flow (sécurisé).</Text>
        </Box>
        <Confirm
          message="Voulez-vous vous authentifier avec GitHub ?"
          defaultValue={true}
          onSubmit={handleConfirm}
        />
      </Box>
    );
  }

  // Attente de l'autorisation
  if (step === 'waiting' && deviceFlow) {
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text bold color="blue">🔐 Authentification GitHub</Text>
        </Box>
        <Box flexDirection="column" marginBottom={1}>
          <Text bold color="green">✓ Device Flow initialisé</Text>
        </Box>
        <Box flexDirection="column" marginBottom={1} paddingLeft={2}>
          <Text bold>Étape 1 : Ouvrez cette URL dans votre navigateur</Text>
          <Text color="cyan">{deviceFlow.verification_uri}</Text>
        </Box>
        <Box flexDirection="column" marginBottom={1} paddingLeft={2}>
          <Text bold>Étape 2 : Entrez ce code de vérification</Text>
          <Box>
            <Text bold color="yellow" backgroundColor="black">  {deviceFlow.user_code}  </Text>
          </Box>
        </Box>
        <Box marginTop={1}>
          <Text color="cyan">
            <Spinner type="dots" /> En attente de votre autorisation...
          </Text>
        </Box>
        <Box marginTop={1}>
          <Text dimColor>Le code expire dans {Math.floor(deviceFlow.expires_in / 60)} minutes</Text>
        </Box>
      </Box>
    );
  }

  // Succès
  if (step === 'success' && result) {
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text bold color="blue">🔐 Authentification GitHub</Text>
        </Box>
        <Box flexDirection="column" marginBottom={1}>
          <Text bold color="green">✓ Authentification réussie !</Text>
        </Box>
        <Box flexDirection="column" paddingLeft={2}>
          <Text>Compte: <Text bold color="cyan">{result.username}</Text></Text>
          <Text>Email: <Text dimColor>{result.email}</Text></Text>
        </Box>
        <Box marginTop={1}>
          <Text color="green">Credentials sauvegardés de manière sécurisée.</Text>
        </Box>
      </Box>
    );
  }

  // Erreur
  if (step === 'error') {
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text bold color="blue">🔐 Authentification GitHub</Text>
        </Box>
        <Box marginBottom={1}>
          <Text color="red">❌ Erreur d'authentification</Text>
        </Box>
        <Box flexDirection="column" paddingLeft={2}>
          <Text color="red">{error}</Text>
        </Box>
        <Box marginTop={1}>
          <Text dimColor>Vous devrez push manuellement avec : git push</Text>
        </Box>
      </Box>
    );
  }

  // Annulé
  if (step === 'cancelled') {
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text bold color="blue">🔐 Authentification GitHub</Text>
        </Box>
        <Text color="yellow">⚠️  Authentification annulée</Text>
        <Box marginTop={1}>
          <Text dimColor>Vous devrez push manuellement avec : git push</Text>
        </Box>
      </Box>
    );
  }

  return null;
};
