# Task: Settings Management

## Responsibility
Manage plugin configuration with persistent storage and a user-facing settings UI.

## Description
This task implements the settings subsystem, including default values, storage/loading, and the settings tab in Obsidian's preferences panel.

## Scope
- **Single Responsibility**: Settings storage, retrieval, and UI only
- **Not Responsible For**: Using settings to control behavior (consumers handle that)

## Deliverables

### 1. Settings Interface (`src/settings.ts`)
```typescript
export interface DollarSmithSettings {
  strictMode: boolean;         // Reject unbalanced braces
  showRibbonButton: boolean;   // Display ribbon icon
  notifyOnComplete: boolean;   // Show completion notice
}

export const DEFAULT_SETTINGS: DollarSmithSettings = {
  strictMode: false,
  showRibbonButton: true,
  notifyOnComplete: true
};
```

### 2. Settings Tab Class
```typescript
export class DollarSmithSettingTab extends PluginSettingTab {
  plugin: DollarSmithPlugin;
  
  display(): void;
}
```

### 3. Settings UI Elements
| Setting | Type | Description |
|---------|------|-------------|
| Strict Mode | Toggle | When ON, skips conversion for math with unbalanced braces |
| Show Ribbon Button | Toggle | Show/hide the `$` button in left ribbon |
| Notify on Complete | Toggle | Show notice after normalization completes |

### 4. Persistence
- Save settings to `data.json` via `this.plugin.saveData()`
- Load settings on plugin load via `this.plugin.loadData()`
- Merge with defaults for forward compatibility

## Dependencies
- Obsidian Plugin API (`PluginSettingTab`, `Setting`)

## Acceptance Criteria
- [ ] Settings load correctly on plugin startup
- [ ] Settings persist across Obsidian restarts
- [ ] Settings tab renders all options
- [ ] Toggle changes take effect immediately
- [ ] New settings merge gracefully with existing data

## Technical Notes
- Use `Object.assign()` for merging saved settings with defaults
- Settings tab should use Obsidian's `Setting` component for consistency
- Keep settings simple—avoid complex nested structures

## Files to Create
- `src/settings.ts`

## Estimated Effort
1-2 hours
