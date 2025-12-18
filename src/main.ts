import { Editor, MarkdownFileInfo, MarkdownView, Notice, Plugin } from "obsidian";
import {
    DollarSmithSettings,
    DEFAULT_SETTINGS,
    DollarSmithSettingTab,
} from "./settings";
import { MathNormalizerService } from "./normalizer";
import { EditorAdapter, getEditorView } from "./editor-adapter";

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
        const editorView = getEditorView(editor);
        if (!editorView) {
            console.error("Dollar Smith: Could not get EditorView");
            return;
        }

        const normalizer = new MathNormalizerService(this.settings.strictMode);
        const result = normalizer.normalize(editorView.state);

        const adapter = new EditorAdapter();
        const success = adapter.applyEdits(editorView, result.edits);

        if (success && this.settings.notifyOnComplete) {
            if (result.stats.converted > 0) {
                new Notice(`Dollar Smith: Converted ${result.stats.converted} math expressions`);
            } else if (result.stats.totalFound > 0 && result.stats.skipped > 0) {
                new Notice(`Dollar Smith: Skipped ${result.stats.skipped} expressions (strict mode)`);
            } else if (result.stats.totalFound === 0) {
                new Notice("Dollar Smith: No math delimiters found");
            }
        }

        if (result.errors.length > 0) {
            console.debug("Dollar Smith: Validation errors encountered", result.errors);
        }
    }
}
