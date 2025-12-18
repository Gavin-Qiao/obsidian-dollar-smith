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
    "Image", // Covers the whole image syntax ![alt](url) ? Or just parts?
             // Lezer markdown Image usually wraps the whole thing.
             // If we want to protect the whole image syntax (which we probably do), Image is correct.
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

        // Merge overlapping or adjacent regions
        const mergedProtected: { from: number; to: number }[] = [];
        if (protectedRegions.length > 0) {
            let current = protectedRegions[0];
            for (let i = 1; i < protectedRegions.length; i++) {
                const next = protectedRegions[i];
                if (next.from < current.to) { // Overlap (shouldn't happen with tree iteration but good to be safe)
                     // If nested, next.to might be inside current.to or outside.
                     // But we skipped children, so nested nodes shouldn't be visited?
                     // Wait, iterate visits parents then children.
                     // If I return false, I skip children.
                     // But could there be overlapping siblings? No.
                     // What about nodes that start at same position?
                     // With 'enter', we see the outer one first. We return false, so we don't see inner ones.
                     // So we shouldn't have overlaps effectively, unless the parser produces them.
                     // But 'CodeBlock' might be adjacent to another.
                     // Actually, if we have disjoint regions, we are good.
                     // But let's keep the merge logic for safety and gap calculation.
                     if (next.to > current.to) current.to = next.to;
                } else {
                    mergedProtected.push(current);
                    current = next;
                }
            }
            mergedProtected.push(current);
        }

        // Invert to get safe regions
        const safeRegions: TextRegion[] = [];
        let cursor = 0;
        const docLength = state.doc.length;

        for (const region of mergedProtected) {
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
