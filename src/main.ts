import { Editor, MarkdownFileInfo, MarkdownView, Notice, Plugin } from "obsidian";
import {
    DollarSmithSettings,
    DEFAULT_SETTINGS,
    DollarSmithSettingTab,
} from "./settings";

export default class DollarSmithPlugin extends Plugin {
    settings: DollarSmithSettings = DEFAULT_SETTINGS;
    private ribbonIconEl: HTMLElement | null = null;

    async onload(): Promise<void> {
        await this.loadSettings();

        // Register the normalize command
        this.addCommand({
            id: "normalize-math-delimiters",
            name: "Normalize math delimiters",
            editorCallback: (editor: Editor, ctx: MarkdownView | MarkdownFileInfo) => {
                if (ctx instanceof MarkdownView) {
                    this.normalizeCurrentNote(editor, ctx);
                }
            },
        });

        // Add ribbon icon if enabled
        this.updateRibbonIcon();

        // Add settings tab
        this.addSettingTab(new DollarSmithSettingTab(this.app, this));
    }

    onunload(): void {
        // Cleanup is handled automatically by Obsidian for registered items
    }

    async loadSettings(): Promise<void> {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings(): Promise<void> {
        await this.saveData(this.settings);
    }

    updateRibbonIcon(): void {
        // Remove existing icon if present
        if (this.ribbonIconEl) {
            this.ribbonIconEl.remove();
            this.ribbonIconEl = null;
        }

        // Add new icon if enabled
        if (this.settings.showRibbonButton) {
            this.ribbonIconEl = this.addRibbonIcon(
                "dollar-sign",
                "Normalize math delimiters",
                () => {
                    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
                    if (view) {
                        this.normalizeCurrentNote(view.editor, view);
                    } else {
                        new Notice("No active markdown note");
                    }
                }
            );
        }
    }

    private normalizeCurrentNote(editor: Editor, view: MarkdownView): void {
        // TODO: Implement normalization pipeline in Phase 2
        // This will be wired to the NormalizerService once implemented

        if (this.settings.notifyOnComplete) {
            new Notice("Dollar Smith: Normalization not yet implemented");
        }
    }
}
