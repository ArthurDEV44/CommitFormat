# Debug Guide - Agentic Workflow (Reflection Pattern)

## Debug Mode Activated

Enhanced debug logging has been added at every step of the agentic workflow. This will help identify exactly where the failure occurs.

## How to Debug

### 1. Clean Build
```bash
pnpm build
```

### 2. Ensure Prerequisites

#### Check Ollama is Running
```bash
# Check if Ollama is responding
curl http://localhost:11434/api/tags

# If error, start Ollama
ollama serve
```

#### Verify Model is Downloaded
```bash
# List models
ollama list

# Should see: magistral:24b

# If not present, download it
ollama pull magistral:24b
```

#### Verify Git Repository
```bash
# Check you're in a git repo
git status

# Create test changes
echo "// Test debug" >> test-file.js
git add test-file.js
```

### 3. Run with Debug Mode

```bash
# Set debug flag
export GORTEX_DEBUG=true

# Run the CLI
node dist/index.js commit
```

## What to Look For

The enhanced debug logging will show the exact execution flow:

### Normal Flow (Success)
```
[AgenticAICommitGenerator] Starting generation with provider: Ollama
[AgenticCommitGenerationUseCase] Starting execution...
[AgenticCommitGenerationUseCase] Validating repository...
[AgenticCommitGenerationUseCase] Checking provider availability: Ollama
[AgenticCommitGenerationUseCase] Preparing diff context...
[AgenticCommitGenerationUseCase] Analyzing diff...
[AgenticCommitGenerationUseCase] Generating initial commit message...
[AgenticCommitGenerationUseCase] Initial generation complete: {
  message: "feat: ...",
  confidence: 0.95,
  generationTime: 5234
}
[AgenticAICommitGenerator] Result: {
  "success": true,
  "iterations": 1,
  "hasError": false,
  "errorMessage": null
}
```

### Error Flow (Failure)
The logs will stop at the point of failure and show:

#### Repository Not Found
```
[AgenticAICommitGenerator] Starting generation with provider: Ollama
[AgenticCommitGenerationUseCase] Starting execution...
[AgenticCommitGenerationUseCase] Validating repository...
[AgenticCommitGenerationUseCase] Error: Not a git repository
[AgenticAICommitGenerator] Result: {
  "success": false,
  "iterations": 0,
  "hasError": true,
  "errorMessage": "Not a git repository"
}
```

#### Ollama Not Available
```
[AgenticAICommitGenerator] Starting generation with provider: Ollama
[AgenticCommitGenerationUseCase] Starting execution...
[AgenticCommitGenerationUseCase] Validating repository...
[AgenticCommitGenerationUseCase] Checking provider availability: Ollama
[AgenticCommitGenerationUseCase] Error: Provider not available
[AgenticAICommitGenerator] Result: {
  "success": false,
  "iterations": 0,
  "hasError": true,
  "errorMessage": "AI provider Ollama is not available or not configured"
}
```

#### Exception During Execution
```
[AgenticAICommitGenerator] Starting generation with provider: Ollama
[AgenticCommitGenerationUseCase] Starting execution...
[AgenticCommitGenerationUseCase] Validating repository...
[AgenticCommitGenerationUseCase] Checking provider availability: Ollama
[AgenticCommitGenerationUseCase] Preparing diff context...
[AgenticCommitGenerationUseCase] Exception caught: Error: Connection timeout
    at OllamaProvider.generate (...)
    at ...
[AgenticAICommitGenerator] Result: {
  "success": false,
  "iterations": 0,
  "hasError": true,
  "errorMessage": "Connection timeout"
}
```

## Common Issues and Solutions

### Issue 1: Provider Not Available
**Symptom**: Error message "AI provider Ollama is not available or not configured"

**Solution**:
```bash
# Start Ollama
ollama serve

# In another terminal, verify
curl http://localhost:11434/api/tags
```

### Issue 2: Model Not Found
**Symptom**: Error during generation, model not found

**Solution**:
```bash
# Download the model
ollama pull magistral:24b

# Verify it's available
ollama list | grep magistral
```

### Issue 3: No Staged Changes
**Symptom**: Error about empty diff or no changes

**Solution**:
```bash
# Create and stage changes
echo "// Test" >> test.js
git add test.js

# Verify staging
git status
```

### Issue 4: Timeout
**Symptom**: Connection timeout or request timeout

**Solution**:
1. Increase timeout in `.gortexrc`:
```json
{
  "ai": {
    "ollama": {
      "timeout": 180000
    }
  }
}
```

2. Or use a lighter model:
```json
{
  "ai": {
    "ollama": {
      "model": "llama3.2:3b"
    }
  }
}
```

### Issue 5: Memory Issues
**Symptom**: Ollama crashes or very slow

**Solution**:
- Use a smaller model (llama3.2:3b instead of magistral:24b)
- Close other applications
- Check available memory: `free -h`

## Capturing Full Logs

To share logs for troubleshooting:

```bash
# Redirect all output to file
GORTEX_DEBUG=true node dist/index.js commit 2>&1 | tee debug.log

# Share debug.log with maintainers
```

## Next Steps

Once you run with `GORTEX_DEBUG=true`, the error message will be clearly visible in the output. Share that specific error message for targeted assistance.

## Quick Test Script

Use the provided test script:

```bash
# Make executable
chmod +x test-agentic.sh

# Run
./test-agentic.sh
```

## Configuration Check

Verify your `.gortexrc` or configuration:

```bash
# Check if config file exists
ls -la .gortexrc .gortexrc.json gortex.config.js

# Show config
cat .gortexrc
```

Expected configuration:
```json
{
  "ai": {
    "enabled": true,
    "provider": "ollama",
    "ollama": {
      "model": "magistral:24b",
      "baseUrl": "http://localhost:11434",
      "timeout": 30000
    }
  }
}
```

## Getting Help

If the issue persists after reviewing debug logs:

1. Capture full debug output: `GORTEX_DEBUG=true node dist/index.js commit 2>&1 > debug.log`
2. Check system status:
   - Ollama version: `ollama --version`
   - Models available: `ollama list`
   - System resources: `htop` or `free -h`
3. Open issue with:
   - Debug log
   - System info
   - Configuration file
   - Steps to reproduce
