# Contributing to GORTEX CLI

First off, thank you for considering contributing to GORTEX CLI! It's people like you that make GORTEX CLI such a great tool.

---

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [Getting Started](#-getting-started)
- [Development Workflow](#-development-workflow)
- [Architecture Guidelines](#-architecture-guidelines)
- [Coding Standards](#-coding-standards)
- [Testing Requirements](#-testing-requirements)
- [Pull Request Process](#-pull-request-process)
- [Commit Message Guidelines](#-commit-message-guidelines)
- [Project Structure](#-project-structure)

---

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

### Our Standards

**Examples of behavior that contributes to a positive environment:**

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Examples of unacceptable behavior:**

- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥18.0.0
- **pnpm** (recommended) or npm/yarn
- **Git**
- Basic understanding of TypeScript and React

### Setup Your Development Environment

1. **Fork the repository** on GitHub

2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/gortex-cli.git
   cd gortex-cli
   ```

3. **Add upstream remote:**
   ```bash
   git remote add upstream https://github.com/ArthurDEV44/gortex-cli.git
   ```

4. **Install dependencies:**
   ```bash
   pnpm install
   ```

5. **Run tests to verify setup:**
   ```bash
   pnpm test
   ```

6. **Build the project:**
   ```bash
   pnpm build
   ```

7. **Run in development mode:**
   ```bash
   pnpm dev
   ```

---

## 💻 Development Workflow

### 1. Create a Feature Branch

```bash
# Sync with upstream
git checkout dev
git pull upstream dev

# Create feature branch
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes

Follow the [Architecture Guidelines](#-architecture-guidelines) and [Coding Standards](#-coding-standards).

### 3. Test Your Changes

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test -- path/to/test

# Run with coverage
pnpm test -- --coverage

# Type check
pnpm typecheck

# Build
pnpm build
```

### 4. Commit Your Changes

Follow our [Commit Message Guidelines](#-commit-message-guidelines).

```bash
# Stage your changes
git add .

# Commit with conventional commit message
git commit -m "feat(scope): add new feature"
```

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Open a Pull Request

Go to the repository on GitHub and click "New Pull Request".

---

## 🏗️ Architecture Guidelines

GORTEX CLI follows **Clean Architecture** with **Dependency Injection**. Understanding this architecture is crucial for contributing.

### Required Reading

Before contributing, please read:

1. **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Complete architecture overview
2. **[USE_CASES.md](docs/USE_CASES.md)** - Use cases documentation
3. **[MIGRATION_GUIDE.md](docs/MIGRATION_GUIDE.md)** - Migration patterns

### Architecture Layers

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│    (React Components + Commands)        │
└─────────────────────────────────────────┘
                  │
                  ↓ via DI Hooks
┌─────────────────────────────────────────┐
│         Application Layer               │
│          (Use Cases)                    │
└─────────────────────────────────────────┘
                  │
                  ↓ uses
┌─────────────────────────────────────────┐
│           Domain Layer                  │
│  (Entities, Value Objects, Interfaces)  │
└─────────────────────────────────────────┘
                  │
                  ↑ implements
┌─────────────────────────────────────────┐
│        Infrastructure Layer             │
│  (Repositories, AI, DI Container)       │
└─────────────────────────────────────────┘
```

### Key Principles

#### 1. Dependency Rule

**Dependencies must point inward:**

✅ **Correct:**
- Presentation → Application → Domain
- Infrastructure → Domain (implements interfaces)

❌ **Incorrect:**
- Domain → Infrastructure
- Domain → Presentation

#### 2. Domain Independence

The `domain/` folder should have **zero external dependencies**:

✅ **Correct:**
```typescript
// src/domain/entities/CommitMessage.ts
export class CommitMessage {
  constructor(
    private readonly type: CommitType,
    private readonly subject: CommitSubject
  ) {}

  format(): string {
    return `${this.type}: ${this.subject}`;
  }
}
```

❌ **Incorrect:**
```typescript
// src/domain/entities/CommitMessage.ts
import simpleGit from 'simple-git'; // ❌ External dependency

export class CommitMessage {
  async save() {
    const git = simpleGit();
    await git.commit(this.format()); // ❌ Direct infrastructure access
  }
}
```

#### 3. Use Case Pattern

Every feature should have a dedicated use case:

```typescript
// src/application/use-cases/MyFeatureUseCase.ts
export class MyFeatureUseCase {
  constructor(
    private readonly repository: IRepository,
    private readonly service?: IService
  ) {}

  async execute(request: MyFeatureRequest): Promise<MyFeatureResult> {
    try {
      // 1. Validate request
      this.validate(request);

      // 2. Execute business logic
      const result = await this.repository.doSomething(request.data);

      // 3. Return success
      return { success: true, data: result };
    } catch (error) {
      // 4. Handle errors
      return { success: false, error: error.message };
    }
  }
}
```

#### 4. Dependency Injection

Always use DI instead of direct instantiation:

✅ **Correct:**
```typescript
// Register in ServiceRegistry
container.register(
  ServiceIdentifiers.MyUseCase,
  (c) => new MyUseCase(
    c.resolve(ServiceIdentifiers.Repository)
  )
);

// Use via hook
const { executeFeature } = useMyFeature();
```

❌ **Incorrect:**
```typescript
// Direct instantiation
const repository = new GitRepository();
const useCase = new MyUseCase(repository);
```

---

## 📝 Coding Standards

### TypeScript Guidelines

#### 1. Type Safety

Always use explicit types, avoid `any`:

✅ **Correct:**
```typescript
interface User {
  id: string;
  name: string;
}

function getUser(id: string): User {
  // ...
}
```

❌ **Incorrect:**
```typescript
function getUser(id: any): any {
  // ...
}
```

#### 2. Interfaces for Contracts

Use interfaces for abstractions:

```typescript
// Domain interface
export interface IGitRepository {
  createCommit(message: string): Promise<void>;
  getModifiedFiles(): Promise<string[]>;
}

// Infrastructure implementation
export class GitRepositoryImpl implements IGitRepository {
  async createCommit(message: string): Promise<void> {
    // Implementation using simple-git
  }
}
```

#### 3. Immutability

Prefer `readonly` and immutable patterns:

✅ **Correct:**
```typescript
export class CommitType {
  private constructor(private readonly value: string) {}

  toString(): string {
    return this.value;
  }
}
```

❌ **Incorrect:**
```typescript
export class CommitType {
  public value: string; // Mutable
}
```

### React Guidelines

#### 1. Functional Components

Always use functional components with hooks:

✅ **Correct:**
```typescript
export const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  const [state, setState] = useState<string>('');

  return <Box>{/* JSX */}</Box>;
};
```

#### 2. DI Hooks

Use DI hooks to access use cases:

```typescript
export const CommitTab: React.FC = () => {
  const { createCommit, loading, error } = useCreateCommit();

  const handleCommit = async () => {
    await createCommit(message);
  };

  return <Box>{/* JSX */}</Box>;
};
```

#### 3. Separation of Concerns

Separate presentational from smart components:

**Smart Component** (with business logic):
```typescript
export const CommitConfirmation: React.FC = () => {
  const { createCommit, loading } = useCreateCommit();
  // Business logic here
};
```

**Presentational Component** (pure UI):
```typescript
export const SuccessMessage: React.FC<{ message: string }> = ({ message }) => {
  return <Text color="green">{message}</Text>;
};
```

### File Naming

- **Components:** PascalCase - `CommitTab.tsx`
- **Use Cases:** PascalCase - `CreateCommitUseCase.ts`
- **Interfaces:** PascalCase with `I` prefix - `IGitRepository.ts`
- **Utils:** camelCase - `formatDate.ts`
- **Tests:** Same as source with `.test.ts` - `CreateCommitUseCase.test.ts`

### Code Organization

```
src/
├── domain/
│   ├── entities/          # Business entities
│   ├── value-objects/     # Value objects
│   ├── repositories/      # Repository interfaces
│   └── services/          # Domain services
├── application/
│   ├── use-cases/         # Use case implementations
│   ├── dto/               # Data transfer objects
│   └── mappers/           # DTO ↔ Entity mappers
├── infrastructure/
│   ├── repositories/      # Repository implementations
│   ├── ai/                # AI provider adapters
│   ├── factories/         # Factories
│   └── di/                # DI container
└── components/            # React components
```

---

## 🧪 Testing Requirements

### Testing Philosophy

**All new code must be tested.** We maintain 92% code coverage.

### Types of Tests

#### 1. Unit Tests

Test individual components in isolation:

```typescript
describe('CommitType', () => {
  it('should create valid commit type', () => {
    const type = CommitType.create('feat');
    expect(type.toString()).toBe('feat');
  });

  it('should reject invalid commit type', () => {
    expect(() => CommitType.create('invalid')).toThrow();
  });
});
```

#### 2. Use Case Tests

Test use cases with mocked dependencies:

```typescript
describe('CreateCommitUseCase', () => {
  let useCase: CreateCommitUseCase;
  let mockRepository: IGitRepository;

  beforeEach(() => {
    mockRepository = {
      createCommit: vi.fn(),
      // ... other methods
    };
    useCase = new CreateCommitUseCase(mockRepository);
  });

  it('should create commit with valid message', async () => {
    const result = await useCase.execute({
      message: { type: 'feat', subject: 'add feature' },
    });

    expect(result.success).toBe(true);
    expect(mockRepository.createCommit).toHaveBeenCalled();
  });
});
```

#### 3. Integration Tests

Test complete workflows:

```typescript
describe('Integration: Commit Workflow', () => {
  let root: CompositionRoot;

  beforeEach(() => {
    root = new CompositionRoot();
    // Setup mocks...
  });

  afterEach(() => {
    root.dispose();
  });

  it('should complete full workflow', async () => {
    // Test status → stage → commit workflow
  });
});
```

### Coverage Requirements

- **Domain Layer:** 100% coverage required
- **Application Layer:** ≥95% coverage required
- **Infrastructure Layer:** ≥90% coverage required
- **Presentation Layer:** ≥85% coverage required

### Running Tests

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test -- --watch

# Coverage report
pnpm test -- --coverage

# Specific file
pnpm test -- src/domain/entities/CommitMessage.test.ts

# Update snapshots
pnpm test -- -u
```

---

## 🔄 Pull Request Process

### Before Submitting

Ensure your PR meets these requirements:

- [ ] Code follows the [Architecture Guidelines](#-architecture-guidelines)
- [ ] All tests pass (`pnpm test`)
- [ ] Code coverage is maintained or improved
- [ ] TypeScript compiles without errors (`pnpm typecheck`)
- [ ] Build succeeds (`pnpm build`)
- [ ] Commit messages follow [Conventional Commits](#-commit-message-guidelines)
- [ ] Documentation is updated if needed
- [ ] No console.log or debugging code

### PR Title Format

Use Conventional Commits format:

```
feat(scope): add new feature
fix(scope): resolve bug
docs: update architecture guide
refactor(domain): simplify CommitMessage
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Related Issue
Closes #123

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing performed

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] Code follows project architecture
- [ ] Self-review completed
- [ ] Tests pass locally
- [ ] Documentation updated
```

### Review Process

1. **Automated Checks:** CI/CD runs tests and builds
2. **Code Review:** Maintainer reviews your code
3. **Feedback:** Address any comments or requested changes
4. **Approval:** Once approved, your PR will be merged

### After Merge

Your contribution will be included in the next release. Thank you! 🎉

---

## 💬 Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(ai): add Mistral provider support` |
| `fix` | Bug fix | `fix(commit): resolve validation error` |
| `docs` | Documentation | `docs: update architecture guide` |
| `style` | Code style/formatting | `style: format with prettier` |
| `refactor` | Code refactoring | `refactor(domain): simplify CommitMessage` |
| `perf` | Performance improvement | `perf(git): optimize file listing` |
| `test` | Add/update tests | `test(use-cases): add CreateCommit tests` |
| `build` | Build system changes | `build: update tsup config` |
| `ci` | CI configuration | `ci: add GitHub Actions workflow` |
| `chore` | Other changes | `chore: update dependencies` |

### Scopes

Common scopes in this project:

- `domain` - Domain layer changes
- `application` - Application layer changes
- `infrastructure` - Infrastructure layer changes
- `components` - React components
- `commands` - CLI commands
- `di` - Dependency injection
- `ai` - AI providers
- `git` - Git operations
- `tests` - Test-related changes

### Examples

**Feature:**
```
feat(ai): add Claude AI provider support

- Implement ClaudeProviderAdapter
- Add configuration for Claude API
- Update AIProviderFactory

Closes #45
```

**Bug Fix:**
```
fix(commit): handle empty scope correctly

Previously, empty scope would throw validation error.
Now it creates a commit without scope as expected.

Fixes #67
```

**Documentation:**
```
docs(architecture): add sequence diagrams

Add detailed sequence diagrams for:
- Commit creation workflow
- AI generation workflow
```

**Breaking Change:**
```
feat(domain)!: change CommitMessage API

BREAKING CHANGE: CommitMessage.format() now returns object instead of string

Migration:
- Before: `const str = message.format();`
- After: `const obj = message.format(); const str = obj.formatted;`
```

---

## 📁 Project Structure

```
gortex-cli/
├── src/
│   ├── domain/                    # 🎯 Domain Layer (Pure Business Logic)
│   │   ├── entities/              # Business entities
│   │   │   └── CommitMessage.ts
│   │   ├── value-objects/         # Validated value objects
│   │   │   ├── CommitType.ts
│   │   │   ├── CommitSubject.ts
│   │   │   └── Scope.ts
│   │   ├── repositories/          # Repository interfaces
│   │   │   ├── IGitRepository.ts
│   │   │   └── IAIProvider.ts
│   │   └── services/              # Domain services
│   │       └── CommitMessageService.ts
│   │
│   ├── application/               # 📋 Application Layer (Use Cases)
│   │   ├── use-cases/             # Use case implementations
│   │   │   ├── CreateCommitUseCase.ts
│   │   │   ├── GenerateAICommitUseCase.ts
│   │   │   ├── StageFilesUseCase.ts
│   │   │   ├── GetRepositoryStatusUseCase.ts
│   │   │   ├── AnalyzeCommitHistoryUseCase.ts
│   │   │   ├── BranchOperationsUseCase.ts
│   │   │   └── PushOperationsUseCase.ts
│   │   ├── dto/                   # Data transfer objects
│   │   │   ├── CommitMessageDTO.ts
│   │   │   ├── GitStatusDTO.ts
│   │   │   └── AIGenerationDTO.ts
│   │   └── mappers/               # DTO ↔ Entity mappers
│   │       ├── CommitMessageMapper.ts
│   │       └── GitDataMapper.ts
│   │
│   ├── infrastructure/            # 🔧 Infrastructure Layer
│   │   ├── repositories/          # Repository implementations
│   │   │   └── GitRepositoryImpl.ts
│   │   ├── ai/                    # AI provider adapters
│   │   │   ├── OllamaProviderAdapter.ts
│   │   │   ├── MistralProviderAdapter.ts
│   │   │   └── OpenAIProviderAdapter.ts
│   │   ├── factories/             # Factories
│   │   │   ├── AIProviderFactory.ts
│   │   │   └── RepositoryFactory.ts
│   │   └── di/                    # Dependency Injection
│   │       ├── DIContainer.ts
│   │       ├── ServiceRegistry.ts
│   │       ├── CompositionRoot.ts
│   │       ├── DIContext.tsx
│   │       └── hooks.ts
│   │
│   ├── components/                # ⚛️ Presentation Layer (React)
│   │   ├── CommitTab.tsx
│   │   ├── FileSelector.tsx
│   │   ├── AICommitGenerator.tsx
│   │   ├── CommitConfirmation.tsx
│   │   ├── StatsTab.tsx
│   │   ├── BranchSelector.tsx
│   │   └── PushPrompt.tsx
│   │
│   ├── commands/                  # 🖥️ CLI Commands
│   │   ├── commit.tsx
│   │   ├── stats.tsx
│   │   ├── hooks.tsx
│   │   └── ai-suggest.tsx
│   │
│   ├── ai/                        # 🤖 AI Providers (concrete implementations)
│   │   └── providers/
│   │       ├── ollama.ts
│   │       ├── mistral.ts
│   │       └── openai.ts
│   │
│   ├── utils/                     # 🛠️ Utilities
│   │   └── git.ts (deprecated)
│   │
│   ├── types.ts                   # Global types
│   ├── cli.ts                     # CLI setup
│   └── index.ts                   # Entry point
│
├── docs/                          # 📚 Documentation
│   ├── ARCHITECTURE.md            # Architecture overview
│   ├── USE_CASES.md               # Use cases documentation
│   ├── MIGRATION_GUIDE.md         # Migration patterns
│   ├── PHASE*_SUMMARY.md          # Phase summaries
│   └── PHASE*_VALIDATION.md       # Phase validations
│
├── __tests__/                     # 🧪 Tests
│   ├── integration/               # Integration tests
│   │   ├── commit-workflow.test.tsx
│   │   ├── ai-generation.test.ts
│   │   └── cli-commands.test.ts
│   └── (mirrored src structure)   # Unit tests
│
├── .github/                       # GitHub configuration
├── CONTRIBUTING.md                # This file
├── README.md                      # Main readme
├── TODO.md                        # Project roadmap
├── package.json
└── tsconfig.json
```

---

## 🎯 Contribution Ideas

### Good First Issues

Looking to contribute but not sure where to start? Here are some ideas:

#### Documentation
- Improve code comments
- Add examples to documentation
- Translate documentation
- Create video tutorials

#### Features
- Add new AI provider support
- Implement new commit types
- Add custom commit templates
- Improve error messages

#### Bug Fixes
- Fix reported issues
- Improve error handling
- Fix edge cases

#### Tests
- Increase test coverage
- Add integration tests
- Add E2E tests

#### Performance
- Optimize bundle size
- Improve startup time
- Reduce memory usage

---

## 🤝 Community

### Getting Help

- **Documentation:** Check [docs/](docs/) folder
- **Issues:** Search existing [GitHub Issues](https://github.com/ArthurDEV44/gortex-cli/issues)
- **Discussions:** Use [GitHub Discussions](https://github.com/ArthurDEV44/gortex-cli/discussions)

### Reporting Bugs

Use the [Bug Report template](https://github.com/ArthurDEV44/gortex-cli/issues/new?template=bug_report.md):

**Include:**
- GORTEX CLI version
- Node.js version
- Operating system
- Steps to reproduce
- Expected vs actual behavior
- Error messages/screenshots

### Suggesting Features

Use the [Feature Request template](https://github.com/ArthurDEV44/gortex-cli/issues/new?template=feature_request.md):

**Include:**
- Problem description
- Proposed solution
- Alternative solutions
- Use case examples

---

## 📚 Resources

### Learning Materials

**Clean Architecture:**
- [Clean Architecture (Uncle Bob)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Clean Architecture in TypeScript](https://www.youtube.com/watch?v=CnailTcJV_U)

**Dependency Injection:**
- [Dependency Injection Principles](https://en.wikipedia.org/wiki/Dependency_injection)
- [DI in TypeScript](https://khalilstemmler.com/articles/software-design-architecture/coding-without-di-container/)

**Domain-Driven Design:**
- [DDD Fundamentals](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Value Objects](https://martinfowler.com/bliki/ValueObject.html)

**Testing:**
- [Vitest Documentation](https://vitest.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

### Project-Specific

- [ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [USE_CASES.md](docs/USE_CASES.md)
- [MIGRATION_GUIDE.md](docs/MIGRATION_GUIDE.md)

---

## 📄 License

By contributing to GORTEX CLI, you agree that your contributions will be licensed under the MIT License.

---

## 🙏 Thank You

Your contributions make GORTEX CLI better for everyone. We appreciate your time and effort!

**Happy Contributing! 🚀**

---

<div align="center">

Made with ❤️ by the GORTEX CLI community

**Questions?** Open a [Discussion](https://github.com/ArthurDEV44/gortex-cli/discussions)

</div>
