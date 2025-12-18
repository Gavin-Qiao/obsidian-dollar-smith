import { EditorState } from "@codemirror/state";
import { syntaxTree } from "@codemirror/language";
import { SyntaxNodeRef } from "@lezer/common";
import { TextRegion } from "./types";

const PROTECTED_NODES = new Set([
    "FencedCode",
    "InlineCode",
    "CodeBlock",
    "HTMLBlock",
    "CommentBlock",
    "FrontMatter",
    "LinkURL",
    "URL", // Common name for URL part
    "Image",
]);

export class SyntaxTreeWalker {
    /**
     * Extract all safe text regions from the document.
     * @param state - EditorState from CodeMirror
     * @returns Array of safe text regions
     */
    getSafeRegions(state: EditorState): TextRegion[] {
        const protectedRegions: { from: number; to: number }[] = [];
        const tree = syntaxTree(state);

        tree.iterate({
            enter: (node: SyntaxNodeRef) => {
                if (PROTECTED_NODES.has(node.name)) {
                    protectedRegions.push({ from: node.from, to: node.to });
                    return false; // Skip children of protected nodes
                }
            },
        });

        // Sort by start position
        protectedRegions.sort((a, b) => a.from - b.from);

        // Invert to get safe regions
        const safeRegions: TextRegion[] = [];
        let cursor = 0;
        const docLength = state.doc.length;

        for (const region of protectedRegions) {
            if (region.from > cursor) {
                safeRegions.push({
                    type: 'text',
                    from: cursor,
                    to: region.from
                });
            }
            cursor = Math.max(cursor, region.to);
        }

        if (cursor < docLength) {
            safeRegions.push({
                type: 'text',
                from: cursor,
                to: docLength
            });
        }

        return safeRegions;
    }

    /**
     * Check if a position is within a safe region.
     * @param pos - Document position
     * @param safeRegions - Pre-computed safe regions
     */
    isPositionSafe(pos: number, safeRegions: TextRegion[]): boolean {
        // Binary search could be used for performance, but linear scan is fine for now
        // assuming number of regions is manageable.
        for (const region of safeRegions) {
            if (pos >= region.from && pos < region.to) {
                return true;
            }
        }
        return false;
    }
}
