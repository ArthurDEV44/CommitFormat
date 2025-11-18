# 📖 Migration Guide: v2.x → v3.0

This guide helps you upgrade from Gortex CLI v2.x to v3.0.

---

## 🎯 TL;DR (Quick Migration)

```bash
# 1. Upgrade
npm update -g gortex-cli

# 2. Verify version
gortex --version  # Should show 3.0.0

# 3. Use as before
gortex commit  # Choose "Manual" at step 3 for classic workflow
```

**No configuration changes required!**

---

## 📋 What Changed

### High-Level Changes

| Aspect | v2.x | v3.0 |
|--------|------|------|
| **Interface** | Linear workflow | Tabbed interface |
| **AI Integration** | Separate command | Integrated in workflow |
| **Steps** | 5 steps | 7 steps (added choice + tab nav) |
| **Commands** | `commit`, `ai-suggest` | `commit` (ai-suggest deprecated) |
| **Config** | `.gortexrc` | Same, no changes needed |

### Visual Comparison

**v2.x Workflow:**
```
gortex commit
├─ Branch Selection
├─ File Selection
├─ Message Builder (manual)
├─ Confirmation
└─ Push
```

**v3.0 Workflow:**
```
gortex commit
├─ [Tabs: Credentials | Commit]
└─ Commit Tab:
    ├─ Branch Selection
    ├─ File Selection
    ├─ Generation Mode (AI/Manual) ← NEW
    ├─ Message Creation
    ├─ Confirmation
    ├─ Push
    └─ Success
```

---

## 👥 Migration by User Type

### Type 1: Manual Workflow Users

**You were using:**
```bash
gortex commit
# → Manual message builder
```

**What changes:**
- One extra step: Generation Mode choice
- Select "Manual" to continue as before

**New workflow:**
```bash
gortex commit
# → Step 1: Branch
# → Step 2: Files
# → Step 3: Choose "✍️ Manuel" ← NEW
# → Step 4: Manual builder (same as before)
# → Step 5-7: Same as before
```

**Impact:** ⭐ Low - Just one extra selection

**Action required:**
- None! Just select "Manual" when prompted
- Or press `↓` then `Enter` (Manual is often last option)

---

### Type 2: AI Users (ai-suggest)

**You were using:**
```bash
git add .
gortex ai-suggest
```

**What changes:**
- No separate command needed
- AI integrated in main workflow

**New workflow:**
```bash
git add .
gortex commit
# → Step 1: Branch
# → Step 2: Files
# → Step 3: Choose "🤖 AI - Ollama" ← NEW
# → Step 4: AI generation (same as before)
# → Step 5-7: Confirmation, push, success
```

**Impact:** ⭐⭐ Medium - Better integration

**Action required:**
- Switch from `gortex ai-suggest` to `gortex commit`
- Choose your AI provider at step 3

**Benefits:**
- Less context switching
- Can fallback to manual easily
- See all options in one place

---

### Type 3: New Users

**Getting started:**
```bash
# Install
npm install -g gortex-cli@3.0.0

# Initialize repo
cd your-project
git init

# Use Gortex
gortex
# → Guided through tabbed interface
```

**No migration needed!** Start with v3.0 directly.

---

## 🔧 Configuration Migration

### Good News: No Changes Required!

Your existing `.gortexrc` works without modifications.

**Example v2.x config:**
```json
{
  "types": [...],
  "scopes": ["api", "ui"],
  "ai": {
    "enabled": true,
    "provider": "ollama"
  }
}
```

**Same config in v3.0:**
```json
{
  "types": [...],
  "scopes": ["api", "ui"],
  "ai": {
    "enabled": true,
    "provider": "ollama"
  }
}
```

✅ **100% compatible**

---

## 📝 Command Migration

### Deprecated Commands

| v2.x Command | v3.0 Status | Replacement |
|--------------|-------------|-------------|
| `gortex ai-suggest` | **Deprecated** ⚠️ | `gortex commit` → Choose AI |
| `gortex commit` | **Enhanced** ✓ | Same command, more features |
| `gortex hooks` | **Unchanged** ✓ | Same |
| `gortex stats` | **Unchanged** ✓ | Same |

### Migration Timeline

- **v3.0**: `ai-suggest` deprecated (shows warning)
- **v3.x**: `ai-suggest` still works
- **v4.0**: `ai-suggest` removed

**Recommendation:** Migrate now to avoid v4.0 breaking change.

---

## 🎨 UI/UX Migration

### New Interface Elements

#### Tab Navigation

**New shortcuts:**
```
Tab or →  : Next tab
← or h    : Previous tab
1         : Credentials tab
2         : Commit tab
```

**Where to use:**
- Switch to Credentials tab to view API keys status
- Switch to Commit tab for commit workflow
- Most users stay in Commit tab

#### Generation Mode Selection

**New step 3 menu:**
```
🤖 Mode de Génération du Commit

┌──────────────────────────────┐
│ ❯ 🤖 AI - Ollama (Local)    │
│   🤖 AI - Mistral           │
│   ✍️  Manuel                │
└──────────────────────────────┘
```

**How to choose:**
- `↑↓` or `j/k` to navigate
- `Enter` to select
- Ollama shown if available
- Mistral/OpenAI shown if configured
- Manual always available

---

## 🐛 Common Issues & Solutions

### Issue 1: "Where is ai-suggest?"

**Symptom:**
```bash
$ gortex ai-suggest
⚠️ DÉPRÉCIATION: Cette commande est maintenant obsolète.
💡 Utilisez plutôt: gortex commit
```

**Solution:**
Use `gortex commit` and choose AI at step 3.

---

### Issue 2: "I don't see my AI provider"

**Symptom:**
Only "Manuel" option shows up.

**Possible causes:**
1. **Ollama**: Not running or model not installed
2. **Mistral/OpenAI**: API key not configured

**Solutions:**

**For Ollama:**
```bash
# Check if Ollama is running
ollama list

# If not, start it
ollama serve

# Install model if missing
ollama pull mistral:7b
```

**For Mistral/OpenAI:**
```bash
# Check API key in .gortexrc
cat .gortexrc | grep apiKey

# Or set environment variable
export MISTRAL_API_KEY="your-key"
export OPENAI_API_KEY="your-key"
```

---

### Issue 3: "Workflow feels different"

**Symptom:**
Extra step for mode selection.

**Solution:**
This is intentional! The extra step gives you choice and flexibility.

**Tips:**
- Select "Manual" to get classic workflow
- Try AI once to see the benefits
- Use `↓` + `Enter` to quickly select Manual

---

### Issue 4: "Can't find Credentials tab"

**Symptom:**
Don't see how to configure API keys.

**Solution:**
```bash
# Launch Gortex
gortex

# Press Tab or →
# You're now in Credentials tab

# Or press 1 directly
# Shows API keys status and config instructions
```

---

## 📊 Performance Impact

### Bundle Size

| Version | Size | Change |
|---------|------|--------|
| v2.0 | 83.71 KB | - |
| v3.0 | 109.74 KB | +26 KB (+31%) |

**Reason:** Tab system + provider detection

**Impact:** Negligible - still very lightweight

### Runtime Performance

- Provider detection: +2s on first run
- Tab switching: Instant
- No regression in commit workflow

---

## 🎓 Learning the New Interface

### Quick Tutorial

**Step 1: Launch**
```bash
cd your-repo
gortex
```

**Step 2: Explore Tabs**
```
Press Tab → See Credentials tab
Press Tab → Back to Commit tab
```

**Step 3: Create Commit**
```
1. Choose branch
2. Select files
3. Choose generation mode
   - Try AI if available
   - Or select Manual
4. Review and confirm
5. Push (optional)
```

**Time to learn:** 2 minutes

---

## 🔄 Rollback Plan

If you need to rollback to v2.x:

```bash
# Uninstall v3.0
npm uninstall -g gortex-cli

# Install v2.0.0
npm install -g gortex-cli@2.0.0

# Verify
gortex --version  # Should show 2.0.0
```

**Note:** Your config works in both versions!

---

## ✅ Migration Checklist

Use this checklist for smooth migration:

- [ ] Backup current `.gortexrc` (optional, not required)
- [ ] Upgrade to v3.0: `npm update -g gortex-cli`
- [ ] Verify version: `gortex --version`
- [ ] Test basic workflow: `gortex commit`
- [ ] Try AI mode (if using AI)
- [ ] Update team documentation (if applicable)
- [ ] Remove `ai-suggest` from scripts/docs
- [ ] Optional: Explore Credentials tab

---

## 🆘 Getting Help

### Resources

1. **Documentation**
   - README.md - Updated usage
   - CHANGELOG.md - Complete changes
   - docs/AI_SETUP.md - AI configuration

2. **Release Notes**
   - RELEASE_NOTES_3.0.0.md - This release
   - REFACTORING_SUMMARY.md - Technical details

3. **Community**
   - GitHub Issues: Bug reports
   - GitHub Discussions: Questions

### Support Channels

- 🐛 **Bugs**: [GitHub Issues](https://github.com/ArthurDEV44/gortex-cli/issues)
- 💬 **Questions**: [GitHub Discussions](https://github.com/ArthurDEV44/gortex-cli/discussions)
- 📧 **Email**: arthur.jean@strivex.fr

---

## 🎊 Conclusion

Migrating to v3.0 is **straightforward** and brings **significant UX improvements**:

✅ Unified workflow
✅ Better AI integration
✅ No config changes
✅ Smooth upgrade path

**Recommended migration time:** 5 minutes

**Questions?** Open an issue or discussion on GitHub!

---

**Happy committing! 🚀**
