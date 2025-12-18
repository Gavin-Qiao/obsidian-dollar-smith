# Task: Syntax Tree Walker

## Responsibility
Traverse CodeMirror 6's Markdown syntax tree and identify safe regions for math normalization.

## Description
This task implements the core safety mechanism of the plugin. It walks the syntax tree to distinguish between "safe" text regions and "protected" regions (code blocks, inline code, frontmatter, HTML).

## Scope
- **Single Responsibility**: Syntax tree traversal and region classification only
- **Not Responsible For**: Math detection, conversion, or editing

## Deliverables

### 1. Region Types (`src/types.ts`)
```typescript
export type RegionType = 
  | 'text'          // Safe for processing
  | 'code-block'    // Fenced code blocks
  | 'inline-code'   // Backtick-wrapped code
  | 'frontmatter'   // YAML header
  | 'html'          // HTML blocks/elements
  | 'comment';      // HTML comments

export interface TextRegion {
  type: RegionType;
  from: number;  // Start position (inclusive)
  to: number;    // End position (exclusive)
}
```

### 2. Tree Walker Class (`src/tree-walker.ts`)
```typescript
export class SyntaxTreeWalker {
  /**
   * Extract all safe text regions from the document.
   * @param state - EditorState from CodeMirror
   * @returns Array of safe text regions
   */
  getSafeRegions(state: EditorState): TextRegion[];
  
  /**
   * Check if a position is within a safe region.
   * @param pos - Document position
   * @param safeRegions - Pre-computed safe regions
   */
  isPositionSafe(pos: number, safeRegions: TextRegion[]): boolean;
}
```

### 3. CodeMirror Node Types to Exclude
```typescript
const PROTECTED_NODES = [
  'FencedCode',        // ```code```
  'InlineCode',        // `code`
  'CodeBlock',         // Indented code
  'HTMLBlock',         // HTML elements
  'CommentBlock',      // <!-- comment -->
  'FrontMatter',       // ---yaml---
  'LinkURL',           // [text](url)
  'Image',             // ![alt](url)
];
```

### 4. Traversal Strategy
1. Use `syntaxTree(state)` to get the tree
2. Walk tree with `iterate()` method
3. Track entry/exit of protected nodes
4. Build array of non-overlapping safe regions

## Dependencies
- CodeMirror 6: `@codemirror/state`, `@codemirror/language`
- Lezer Markdown parser nodes

## Acceptance Criteria
- [ ] Correctly identifies all fenced code blocks
- [ ] Correctly identifies inline code spans
- [ ] Correctly identifies YAML frontmatter
- [ ] Correctly identifies HTML blocks
- [ ] Returns correct boundary positions
- [ ] Handles nested structures correctly
- [ ] Performs efficiently on large documents

## Technical Notes
- `syntaxTree(state).iterate()` is the primary API
- Node boundaries are accurate at the character level
- Consider caching results per transaction for performance
- Use the `@lezer/markdown` parser's node types

## Edge Cases to Handle
- Nested code blocks (should not happen in valid MD but handle gracefully)
- Code blocks inside block quotes
- Multiple frontmatter blocks (only first is valid)
- Mixed HTML and Markdown

## Files to Create
- `src/tree-walker.ts`
- `src/types.ts` (shared types)

## Estimated Effort
4-5 hours
