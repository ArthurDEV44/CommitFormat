# 🔐 Git Authentication Setup

Gortex CLI uses your **existing Git credentials** to push to remotes. No OAuth needed!

## Quick Setup

### Option 1: SSH (Recommended) 🚀

SSH is the most secure and convenient method. Set it up once and never worry about passwords again.

#### 1. Generate SSH key
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

#### 2. Add to ssh-agent
```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

#### 3. Add to GitHub
```bash
cat ~/.ssh/id_ed25519.pub
# Copy the output and add it to GitHub:
# https://github.com/settings/ssh/new
```

#### 4. Test connection
```bash
ssh -T git@github.com
```

#### 5. Use SSH remote
```bash
git remote set-url origin git@github.com:username/repo.git
```

**Done!** Gortex CLI will now push using your SSH key.

---

### Option 2: HTTPS with Credential Helper 🔑

For HTTPS remotes, configure Git's credential helper to remember your token.

#### 1. Configure credential helper
```bash
git config --global credential.helper store
```

#### 2. Create a GitHub Personal Access Token
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo`, `workflow`
4. Copy the token

#### 3. First push
```bash
git push
# Username: your_github_username
# Password: paste_your_token_here
```

Git will remember your credentials for future pushes.

**Done!** Gortex CLI will now push using your saved credentials.

---

## How Gortex CLI Uses Your Credentials

Gortex CLI executes standard Git commands (`git push`) that use:

✅ **SSH keys** if you have an SSH remote
✅ **Credential helper** if you have HTTPS with stored credentials
✅ **Git config** for user name and email

**No additional authentication needed!** Gortex works exactly like manual Git commands.

---

## Troubleshooting

### "Permission denied (publickey)"
Your SSH key is not configured or added to GitHub.
→ Follow [Option 1: SSH Setup](#option-1-ssh-recommended-)

### "Authentication failed"
Your HTTPS credentials are not saved.
→ Follow [Option 2: HTTPS Setup](#option-2-https-with-credential-helper-)

### "Could not read from remote repository"
Your remote URL might be incorrect.
```bash
git remote -v  # Check your remote
git remote set-url origin git@github.com:username/repo.git  # Fix if needed
```

---

## Documentation Links

- [GitHub SSH Setup](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
- [GitHub Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [Git Credential Storage](https://git-scm.com/book/en/v2/Git-Tools-Credential-Storage)
