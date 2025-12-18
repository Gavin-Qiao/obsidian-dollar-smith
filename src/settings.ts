import { App, PluginSettingTab, Setting } from "obsidian";
import type DollarSmithPlugin from "./main";

export interface DollarSmithSettings {
    strictMode: boolean;
    showRibbonButton: boolean;
    notifyOnComplete: boolean;
}

export const DEFAULT_SETTINGS: DollarSmithSettings = {
    strictMode: false,
    showRibbonButton: true,
    notifyOnComplete: true,
};

export class DollarSmithSettingTab extends PluginSettingTab {
    plugin: DollarSmithPlugin;

    constructor(app: App, plugin: DollarSmithPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl("h2", { text: "Dollar Smith Settings" });

        new Setting(containerEl)
            .setName("Strict mode")
            .setDesc(
                "When enabled, skips conversion for math with unbalanced braces or brackets."
            )
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.strictMode)
                    .onChange(async (value) => {
                        this.plugin.settings.strictMode = value;
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(containerEl)
            .setName("Show ribbon button")
            .setDesc("Show the $ button in the left ribbon.")
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.showRibbonButton)
                    .onChange(async (value) => {
                        this.plugin.settings.showRibbonButton = value;
                        await this.plugin.saveSettings();
                        this.plugin.updateRibbonIcon();
                    })
            );

        new Setting(containerEl)
            .setName("Notify on complete")
            .setDesc("Show a notice after normalization completes.")
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.notifyOnComplete)
                    .onChange(async (value) => {
                        this.plugin.settings.notifyOnComplete = value;
                        await this.plugin.saveSettings();
                    })
            );
    }
}
