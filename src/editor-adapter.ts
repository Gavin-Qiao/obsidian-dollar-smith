import { EditorState, Transaction, TransactionSpec } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { Editor } from "obsidian";
import { NormalizationEdit } from "./types";

export class EditorAdapter {
    /**
     * Apply normalization edits to the editor.
     * @param view - EditorView from CodeMirror
     * @param edits - Edits from normalizer
     * @returns Success status
     */
    applyEdits(view: EditorView, edits: NormalizationEdit[]): boolean {
        if (edits.length === 0) return true;

        if (!this.validateEdits(view.state, edits)) {
            console.error("Dollar Smith: Invalid edits generated", edits);
            return false;
        }

        const transaction = this.buildTransaction(view.state, edits);
        view.dispatch(transaction);
        return true;
    }

    /**
     * Get current editor state.
     */
    getState(view: EditorView): EditorState {
        return view.state;
    }

    /**
     * Get document text.
     */
    getText(view: EditorView): string {
        return view.state.doc.toString();
    }

    private buildTransaction(state: EditorState, edits: NormalizationEdit[]): TransactionSpec {
        // Sort edits by position (descending) for safe application
        const sortedEdits = [...edits].sort((a, b) => b.from - a.from);

        return {
            changes: sortedEdits.map(edit => ({
                from: edit.from,
                to: edit.to,
                insert: edit.insert
            })),
            annotations: [
                Transaction.userEvent.of('input.normalize'),
                Transaction.addToHistory.of(true)
            ]
        };
    }

    private validateEdits(state: EditorState, edits: NormalizationEdit[]): boolean {
        const docLength = state.doc.length;
        for (const edit of edits) {
            if (edit.from < 0 || edit.to > docLength || edit.from > edit.to) {
                return false;
            }
        }
        return true;
    }
}

/**
 * Wrapper to work with Obsidian's Editor API.
 */
export function getEditorView(editor: Editor): EditorView | null {
    // @ts-ignore - accessing private API
    return (editor as any).cm;
}
