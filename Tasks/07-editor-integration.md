# Task: Editor Integration

## Responsibility
Apply normalization edits to the CodeMirror editor safely and efficiently.

## Description
This task bridges the normalizer service output with CodeMirror 6's transaction API. It takes edit objects and applies them to the editor in a single, undoable transaction.

## Scope
- **Single Responsibility**: Edit application to editor only
- **Not Responsible For**: Generating edits, validation, or UI feedback

## Deliverables

### 1. Editor Adapter (`src/editor-adapter.ts`)
```typescript
export class EditorAdapter {
  /**
   * Apply normalization edits to the editor.
   * @param view - EditorView from CodeMirror
   * @param edits - Edits from normalizer
   * @returns Success status
   */
  applyEdits(view: EditorView, edits: NormalizationEdit[]): boolean;
  
  /**
   * Get current editor state.
   */
  getState(view: EditorView): EditorState;
  
  /**
   * Get document text.
   */
  getText(view: EditorView): string;
}
```

### 2. Transaction Building
```typescript
function buildTransaction(state: EditorState, edits: NormalizationEdit[]): TransactionSpec {
  // Sort edits by position (descending) for safe application
  const sortedEdits = edits.sort((a, b) => b.from - a.from);
  
  return {
    changes: sortedEdits.map(edit => ({
      from: edit.from,
      to: edit.to,
      insert: edit.insert
    })),
    annotations: [
      // Mark as user action for undo/redo
      Transaction.userEvent.of('input.normalize')
    ]
  };
}
```

### 3. Obsidian Editor Wrapper
```typescript
/**
 * Wrapper to work with Obsidian's Editor API.
 * Obsidian exposes a limited Editor interface, but we need EditorView.
 */
export function getEditorView(editor: Editor): EditorView | null {
  // Access the underlying CodeMirror instance
  // @ts-ignore - accessing private API
  return (editor as any).cm;
}
```

### 4. Safety Checks
```typescript
function validateEdits(state: EditorState, edits: NormalizationEdit[]): boolean {
  const docLength = state.doc.length;
  for (const edit of edits) {
    if (edit.from < 0 || edit.to > docLength || edit.from > edit.to) {
      return false;  // Invalid range
    }
  }
  return true;
}
```

## Dependencies
- CodeMirror 6: `@codemirror/state`, `@codemirror/view`
- Obsidian API: `Editor`, `MarkdownView`

## Acceptance Criteria
- [ ] Successfully applies single edit
- [ ] Successfully applies multiple edits
- [ ] Edits are undoable with Ctrl+Z
- [ ] Handles empty edit list gracefully
- [ ] Validates edit ranges before applying
- [ ] Works with Obsidian's Editor wrapper
- [ ] Preserves cursor position when possible

## Technical Notes
- Access EditorView via Obsidian's editor wrapper (`editor.cm`)
- Use single transaction for all edits (atomic operation)
- Undo/redo should treat all edits as one action
- Handle potential race conditions (document changed during processing)

## Edge Cases to Handle
- Empty document
- Single character document
- Edits at document boundaries
- Concurrent user edits

## Files to Create
- `src/editor-adapter.ts`

## Estimated Effort
2-3 hours
