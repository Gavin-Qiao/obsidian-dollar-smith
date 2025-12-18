# Contributing to Dollar Smith

Thank you for your interest in contributing to Dollar Smith! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. We expect all contributors to:

- Be respectful and considerate in all interactions
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Accept responsibility for mistakes and learn from them

## How to Contribute

### Reporting Bugs

Before creating a bug report, please check existing issues to avoid duplicates.

**When reporting a bug, include:**

1. **Obsidian version** and **operating system**
2. **Steps to reproduce** the issue
3. **Expected behavior** vs **actual behavior**
4. **Sample content** that triggers the bug (sanitized of personal info)
5. **Error messages** from the Developer Console (`Ctrl/Cmd + Shift + I`)

### Suggesting Features

We welcome feature suggestions! Please:

1. Check existing issues/discussions for similar ideas
2. Describe the **problem** you're trying to solve
3. Explain your **proposed solution**
4. Consider any **alternatives** you've explored

### Pull Requests

1. **Fork** the repository
2. **Create a branch** from `main` with a descriptive name:
   - `feature/add-batch-processing`
   - `fix/code-block-detection`
   - `docs/improve-readme`
3. **Make your changes** following our coding standards
4. **Write or update tests** as needed
5. **Update documentation** if applicable
6. **Submit a PR** with a clear description

## Development Setup

### Prerequisites

- Node.js 18+
- npm or pnpm
- Git
- A test Obsidian vault

### Getting Started

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/obsidian-dollar-smith.git
cd obsidian-dollar-smith

# Install dependencies
npm install

# Build the plugin
npm run build

# For development with hot reload
npm run dev
```

### Testing in Obsidian

1. Create a symbolic link from the build output to your test vault:
   ```bash
   # On Windows (PowerShell as Admin)
   New-Item -ItemType Junction -Path "C:\path\to\vault\.obsidian\plugins\obsidian-dollar-smith" -Target "C:\path\to\obsidian-dollar-smith"
   
   # On macOS/Linux
   ln -s /path/to/obsidian-dollar-smith /path/to/vault/.obsidian/plugins/obsidian-dollar-smith
   ```
2. Enable the plugin in Obsidian's settings
3. Use `Ctrl/Cmd + Shift + I` to open Developer Tools

## Coding Standards

### TypeScript

- Use TypeScript strict mode
- Prefer `const` over `let`
- Use meaningful variable/function names
- Add JSDoc comments for public functions
- Keep functions small and focused (Single Responsibility)

### Code Style

```typescript
// ✅ Good
function normalizeInlineDelimiters(content: string, range: Range): Edit[] {
  // Clear purpose, typed parameters, descriptive name
}

// ❌ Avoid
function process(c: any, r: any) {
  // Vague name, untyped, unclear purpose
}
```

### Error Handling

- Never swallow errors silently
- Fail safely—leave content unchanged when uncertain
- Log meaningful error messages for debugging

### Performance

- Avoid full document re-serialization
- Use surgical edits (specific ranges, not full replacements)
- Test with large documents (5000+ lines)

## Testing Guidelines

### Unit Tests

- Test each module in isolation
- Cover edge cases (empty content, malformed input, nested structures)
- Use descriptive test names

```typescript
describe('DelimiterDetector', () => {
  it('should detect inline math delimiters \\(...\\)', () => {
    // test implementation
  });

  it('should ignore delimiters inside code blocks', () => {
    // test implementation
  });
});
```

### Integration Tests

- Test the full conversion flow
- Verify no unintended modifications
- Test with real-world markdown samples

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): brief description

[optional body with more details]

[optional footer with breaking changes or issue references]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(detector): add support for nested math environments
fix(parser): handle escaped backslashes in delimiters
docs(readme): clarify installation instructions
```

## Project Structure

```
obsidian-dollar-smith/
├── src/
│   ├── main.ts              # Plugin entry point
│   ├── settings.ts          # Plugin settings
│   ├── normalizer.ts        # Core normalization logic
│   ├── tree-walker.ts       # Syntax tree traversal
│   ├── delimiter-detector.ts # Math delimiter detection
│   └── types.ts             # TypeScript types
├── Tasks/                   # Development task specifications
├── tests/                   # Unit and integration tests
├── styles.css               # Plugin styles
├── manifest.json            # Obsidian plugin manifest
├── package.json
└── README.md
```

## Review Process

1. All PRs require at least one review
2. CI must pass (linting, tests, build)
3. Changes must be documented
4. Breaking changes need discussion first

## Questions?

- Open a [Discussion](https://github.com/your-username/obsidian-dollar-smith/discussions)
- Check existing issues and PRs
- Review the [README](README.md)

---

Thank you for contributing to Dollar Smith! 🙏
