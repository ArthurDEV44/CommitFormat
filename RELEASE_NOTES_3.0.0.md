# 🎉 Gortex CLI v3.0.0 - Tabbed Interface with Integrated AI

**Release Date**: November 18, 2025

---

## 🚀 What's New in v3.0

Gortex CLI v3.0 is a **major UX evolution** that transforms the tool into a modern, tabbed interface with AI generation seamlessly integrated into the main workflow.

### ✨ Highlights

🎨 **Tabbed Interface**
- Navigate between Credentials and Commit tabs
- Keyboard shortcuts: `Tab`, `←→`, `1-2`, `h/l`
- Better organization and discoverability

🤖 **Integrated AI Generation**
- Choose AI or Manual at step 3 of commit workflow
- Auto-detection of available providers (Ollama/Mistral/OpenAI)
- Smart fallback to manual mode
- No more separate `ai-suggest` command needed

🔑 **Credentials Tab**
- View API keys status in-app
- Configuration instructions and examples
- Environment variable guidance

---

## 🚨 Breaking Changes

### Workflow Changes

**Before v3.0:**
```bash
# Two separate workflows
gortex commit          # Manual only
gortex ai-suggest      # AI only
```

**After v3.0:**
```bash
# One unified workflow
gortex commit
→ Step 3: Choose AI or Manual
```

### Command Deprecation

- `gortex ai-suggest` is **deprecated**
  - Still works but shows migration warning
  - Will be removed in v4.0.0
  - **Action**: Use `gortex commit` instead

### Impact Assessment

✅ **Low impact for most users:**
- Manual workflow users: Same flow + 1 extra choice (select "Manual")
- AI users: Better experience in unified workflow
- No configuration changes required
- Backward compatible for ai-suggest (with warning)

---

## 📦 Installation & Upgrade

### Fresh Install

```bash
npm install -g gortex-cli@3.0.0
```

### Upgrade from v2.x

```bash
npm update -g gortex-cli
```

**Post-upgrade:**
- Run `gortex --version` to confirm v3.0.0
- No config changes needed
- Continue using as before

---

## 🎯 New Workflow

### 7-Step Enhanced Workflow

1. 🌿 **Branch Selection** - Choose or create branch
2. 📦 **File Selection** - Select files to commit
3. 🤖 **Generation Mode** ← **NEW**
   - AI - Ollama (if available)
   - AI - Mistral (if configured)
   - AI - OpenAI (if configured)
   - Manual (always available)
4. ✨ **Message Creation** - AI or manual based on choice
5. ✓ **Confirmation** - Review commit
6. 🚀 **Push** - Optional push to remote
7. 🎉 **Success** - Completion summary

### Provider Auto-Detection

The tool automatically detects which AI providers are available:

✓ **Ollama**: Checks local connection + model availability
✓ **Mistral**: Validates API key + connection
✓ **OpenAI**: Validates API key + connection

Only available providers are shown in the menu.

---

## 🔧 Configuration

### No Changes Required!

Your existing `.gortexrc` works as-is:

```json
{
  "ai": {
    "enabled": true,
    "provider": "ollama",
    "ollama": {
      "model": "mistral:7b"
    }
  }
}
```

### Environment Variables

Still supported:
```bash
export MISTRAL_API_KEY="sk-..."
export OPENAI_API_KEY="sk-..."
```

---

## 📚 Documentation

### Updated Guides

- **README.md**: New workflow and navigation
- **CHANGELOG.md**: Complete v3.0 changelog
- **REFACTORING_SUMMARY.md**: Technical deep-dive
- **docs/AI_SETUP.md**: AI integration notes

### Quick References

**Tab Navigation:**
```
Tab or → : Next tab
← or h   : Previous tab
1-2      : Direct access
```

**In Commit Workflow:**
```
↑↓ or j/k : Navigate
Enter     : Select
y/n       : Quick confirm
```

---

## 🎓 Migration Guide

### For Manual Workflow Users

**What changes:**
- One extra step (Generation Mode choice)

**Action required:**
- Select "Manual" at step 3
- Everything else stays the same

**Experience:**
- Same workflow you know
- Option to try AI anytime

---

### For AI Users (ai-suggest)

**What changes:**
- No separate ai-suggest command needed
- AI choice integrated in main workflow

**Action required:**
```bash
# OLD: Two commands
git add .
gortex ai-suggest

# NEW: One command
git add .
gortex commit
# → Choose AI at step 3
```

**Benefits:**
- Less context switching
- Unified experience
- Easy fallback to manual

---

### For New Users

**Getting Started:**
```bash
# Install
npm install -g gortex-cli

# Basic usage (manual)
cd your-repo
gortex

# With AI (Ollama example)
curl -fsSL https://ollama.com/install.sh | sh
ollama pull mistral:7b
gortex  # Choose AI at step 3
```

---

## 🐛 Bug Fixes in v3.0

- Improved error handling in AI generation
- Better provider availability detection
- Fixed race conditions in async checks
- More robust fallback mechanisms
- Clearer error messages

---

## 🚀 Performance

- **Bundle size**: 109.74 KB (+26 KB from v2.0)
  - Justified by new tab system and provider detection
- **Provider detection**: <2s for all providers
- **Tab switching**: Instant
- **No performance regression** in core workflow

---

## 🎨 Screenshots

### Tabbed Interface
```
┌────────────────────────────────────┐
│  🚀 GORTEX Interactive Workflow    │
├────────────────────────────────────┤
│                                    │
│  [🔑 Credentials]  [📝 Commit]    │
│                        ▲           │
│                        └─ Active   │
```

### Generation Mode Choice
```
🤖 Mode de Génération du Commit

┌──────────────────────────────────┐
│ ❯ 🤖 AI - Ollama (Local)        │
│     Génération avec Ollama...    │
│                                  │
│   🤖 AI - Mistral               │
│     Génération avec Mistral...   │
│                                  │
│   ✍️  Manuel                    │
│     Créer le message...          │
└──────────────────────────────────┘

3 provider(s) AI disponible(s)
```

---

## 🛠️ Technical Details

### New Components

- `InteractiveWorkflow.tsx`: Main orchestrator
- `TabNavigation.tsx`: Tab system
- `CredentialsTab.tsx`: Credentials UI
- `CommitTab.tsx`: Enhanced commit workflow
- `CommitModeSelector.tsx`: AI/Manual selection
- `AICommitGenerator.tsx`: Integrated AI generation

### Architecture Patterns

- **Composition**: Modular tab-based structure
- **State Lifting**: Shared state in orchestrator
- **Strategy**: Dynamic AI vs Manual
- **Observer**: Tab communication

---

## 🙏 Acknowledgments

This release represents a major evolution of Gortex CLI, made possible by:

- Community feedback on AI integration
- User testing of tabbed prototypes
- Contributions to documentation

**Thank you to all users and contributors!**

---

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for complete version history.

---

## 🔮 What's Next

### Planned for v3.x

- Enhanced Credentials tab with visual editor
- Settings tab for preferences
- History tab for commit exploration

### Future Roadmap

- Plugin system for custom tabs
- Team collaboration features
- CI/CD integration

---

## 🆘 Support

### Having Issues?

1. **Check documentation**: [docs/AI_SETUP.md](docs/AI_SETUP.md)
2. **Read migration guide**: See above
3. **Open an issue**: [GitHub Issues](https://github.com/ArthurDEV44/gortex-cli/issues)

### Common Questions

**Q: Can I still use ai-suggest?**
A: Yes, but it shows a deprecation warning. Use `gortex commit` instead.

**Q: Do I need to change my config?**
A: No, your existing `.gortexrc` works without changes.

**Q: What if I don't want AI?**
A: Just select "Manual" at step 3. No AI is forced.

**Q: Can I skip the Generation Mode choice?**
A: No, but selecting Manual gives you the same classic workflow.

---

## 📊 Stats

- **2 major commits** in this release
- **~4100 lines** of code added
- **20 new files** created
- **6 new components** built
- **100% backward compatible** for configs

---

## 🎊 Conclusion

Gortex CLI v3.0 represents the **evolution** from a linear workflow tool to a **modern, tabbed platform** with AI deeply integrated.

The unified interface makes AI features **more discoverable**, the workflow **more flexible**, and the overall experience **more professional**.

**Upgrade today and experience the future of Git workflows!**

```bash
npm update -g gortex-cli
```

---

**Version**: 3.0.0
**Date**: November 18, 2025
**License**: MIT
**Author**: Arthur Jean

Made with ❤️ by developers, for developers
