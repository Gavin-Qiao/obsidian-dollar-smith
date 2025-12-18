# How to modify this plugin

## Quick Start

1. Clone this repository into your vault's `.obsidian/plugins/` directory
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start development mode
4. Enable the plugin in Obsidian Settings → Community plugins

## Development Workflow

### Project Structure

```
obsidian-dollar-smith/
├── src/                    # Source code
│   ├── main.ts            # Plugin entry point
│   ├── settings.ts        # Settings management
│   ├── normalizer.ts      # Core conversion logic
│   ├── tree-walker.ts     # Syntax tree traversal
│   ├── delimiter-detector.ts
│   ├── validator.ts
│   └── editor-adapter.ts
├── Tasks/                  # Development task specs
├── tests/                  # Unit tests
├── manifest.json          # Obsidian plugin manifest
├── package.json
└── esbuild.config.mjs     # Build configuration
```

### Building

```bash
# Development (with hot reload)
npm run dev

# Production build
npm run build
```

### Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## Key Concepts

### CodeMirror 6 Syntax Tree

The plugin uses CodeMirror's syntax tree to safely identify regions where math delimiters can be converted. The tree provides accurate parsing of:

- Fenced code blocks
- Inline code
- YAML frontmatter
- HTML blocks

### Surgical Editing

Instead of replacing the entire document, we create precise edits:

```typescript
interface NormalizationEdit {
  from: number;    // Start position
  to: number;      // End position
  insert: string;  // Replacement
}
```

Edits are applied in a single transaction for atomicity and undo support.

### Safe Defaults

- If uncertain, don't modify
- Strict mode skips questionable content
- All changes are undoable

## Adding New Features

1. Read the relevant task specification in `Tasks/`
2. Create/modify the responsible module
3. Add tests for new functionality
4. Update documentation

## Resources

- [Obsidian Plugin API](https://docs.obsidian.md/Plugins)
- [CodeMirror 6 Documentation](https://codemirror.net/docs/)
- [Lezer Parser](https://lezer.codemirror.net/)
