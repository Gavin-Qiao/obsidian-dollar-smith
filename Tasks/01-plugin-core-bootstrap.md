# Task: Plugin Core Bootstrap

## Responsibility
Initialize the Obsidian plugin infrastructure with proper lifecycle management.

## Description
This task creates the foundational plugin class that integrates with Obsidian's plugin API. It handles plugin loading, unloading, command registration, and ribbon button creation.

## Scope
- **Single Responsibility**: Plugin lifecycle and integration with Obsidian API only
- **Not Responsible For**: Settings management, math processing, or UI components

## Deliverables

### 1. Main Plugin Class (`src/main.ts`)
```typescript
export default class DollarSmithPlugin extends Plugin {
  settings: DollarSmithSettings;
  
  async onload(): Promise<void>;
  async onunload(): Promise<void>;
}
```

### 2. Required Functionality
- Register the "Normalize Math Delimiters" command
- Add ribbon button with `$` icon
- Load and integrate settings
- Wire up the normalizer service

### 3. Command Registration
```typescript
this.addCommand({
  id: 'normalize-math-delimiters',
  name: 'Normalize Math Delimiters',
  editorCallback: (editor: Editor, view: MarkdownView) => {
    // Trigger normalization
  }
});
```

### 4. Ribbon Button
```typescript
this.addRibbonIcon('dollar-sign', 'Normalize Math', (evt: MouseEvent) => {
  // Trigger normalization on active note
});
```

## Dependencies
- Obsidian Plugin API
- Settings module (Task 02)
- Normalizer service (Task 04)

## Acceptance Criteria
- [ ] Plugin loads without errors
- [ ] Plugin unloads cleanly (no memory leaks)
- [ ] Command appears in command palette
- [ ] Ribbon button is visible and clickable
- [ ] Settings tab is accessible

## Technical Notes
- Use `obsidian.Plugin` as base class
- Follow Obsidian's async lifecycle patterns
- Ensure all event listeners are properly disposed on unload

## Files to Create
- `src/main.ts`

## Estimated Effort
2-3 hours
