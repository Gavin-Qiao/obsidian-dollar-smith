# Obsidian Dollar Smith

> **Safely normalize LaTeX-style math delimiters in Obsidian using CodeMirror 6**

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

## The Problem

Large language models frequently emit math using LaTeX-style delimiters (`\(...\)` and `\[...\]`), which render poorly or inconsistently in Obsidian. Naive global regex replacements are **unsafe** and can corrupt notes by modifying:

- Fenced code blocks
- Inline code
- YAML frontmatter
- HTML blocks
- Other non-text regions

## The Solution

Dollar Smith performs **precise, lossless math delimiter normalization** directly inside the editor, using CodeMirror 6's Markdown syntax tree to ensure changes are applied **only where math is valid text content**.

### Conversions

| From | To |
|------|-----|
| `\(...\)` | `$...$` |
| `\[...\]` | `$$...$$` |

## Features

- **🎯 Precision**: Uses CodeMirror 6's syntax tree—not blind regex—to identify safe conversion targets
- **🛡️ Safety**: Automatically excludes code blocks, inline code, frontmatter, and HTML
- **⚡ Performance**: Surgical edits preserve all other formatting byte-for-byte
- **📱 Cross-Platform**: Works on both desktop and mobile Obsidian
- **🔧 Zero Dependencies**: No external tools (Pandoc, CLI, etc.) required

## Installation

### From Obsidian Community Plugins (Coming Soon)

1. Open **Settings** → **Community plugins**
2. Click **Browse** and search for **"Dollar Smith"**
3. Click **Install**, then **Enable**

### Manual Installation

1. Download the latest release from the [Releases](https://github.com/your-username/obsidian-dollar-smith/releases) page
2. Extract to your vault's `.obsidian/plugins/obsidian-dollar-smith/` folder
3. Reload Obsidian
4. Enable the plugin in **Settings** → **Community plugins**

## Usage

### Command Palette

1. Open any note with LaTeX-style math delimiters
2. Open the Command Palette (`Ctrl/Cmd + P`)
3. Run **"Dollar Smith: Normalize Math Delimiters"**

### Ribbon Button

Click the **$** button in the left ribbon to normalize the current note.

## Philosophy

This plugin prioritizes **editor-native correctness** over maximal theoretical parsing:

- Treats CodeMirror's syntax tree as the **source of truth** for "what is safe to touch"
- Deliberately limits scope to **delimiter normalization**—not TeX validation or rendering
- Fails safely: malformed or ambiguous math is left unchanged

The result is a reliable "math hygiene" tool: **invisible when unnecessary, precise when invoked, and impossible to accidentally destroy a note**.

## Configuration

| Setting | Description | Default |
|---------|-------------|---------|
| Strict Mode | Reject math with unbalanced braces | `false` |
| Show Ribbon Button | Display the quick-access button | `true` |
| Notify on Complete | Show notice after normalization | `true` |

## Design Constraints

- ✅ No external dependencies
- ✅ Desktop and mobile compatible
- ✅ Uses only Obsidian's public plugin API
- ✅ Uses only CodeMirror 6 extension points
- ✅ Predictable performance on large notes

## Development

```bash
# Clone the repository
git clone https://github.com/your-username/obsidian-dollar-smith.git
cd obsidian-dollar-smith

# Install dependencies
npm install

# Build the plugin
npm run build

# Development mode (watch for changes)
npm run dev
```

### Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Obsidian](https://obsidian.md/) for the amazing note-taking platform
- [CodeMirror 6](https://codemirror.net/6/) for the powerful editor framework
- The Obsidian plugin developer community

---

**Made with ❤️ for the Obsidian community**
