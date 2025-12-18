import { MathNormalizerService } from "../src/normalizer";
import { createMockEditorState } from "./mocks/codemirror.mock";

describe('MathNormalizerService', () => {
    it('normalizes valid inline math', () => {
        const text = "This is \\(inline\\) math.";
        const state = createMockEditorState(text);
        const normalizer = new MathNormalizerService(false);
        const result = normalizer.normalize(state);

        expect(result.edits).toHaveLength(1);
        expect(result.edits[0]).toEqual(expect.objectContaining({
            insert: "$inline$",
            original: "\\(inline\\)",
            from: 8,
            to: 18
        }));
        expect(result.stats.converted).toBe(1);
    });

    it('normalizes valid display math', () => {
        const text = "This is \\[display\\] math.";
        const state = createMockEditorState(text);
        const normalizer = new MathNormalizerService(false);
        const result = normalizer.normalize(state);

        expect(result.edits).toHaveLength(1);
        expect(result.edits[0]).toEqual(expect.objectContaining({
            insert: "$$display$$",
            original: "\\[display\\]",
            delimiterType: 'display'
        }));
    });

    it('handles multiple valid expressions', () => {
        const text = "\\(one\\) and \\[two\\] and \\(three\\)";
        const state = createMockEditorState(text);
        const normalizer = new MathNormalizerService(false);
        const result = normalizer.normalize(state);

        expect(result.edits).toHaveLength(3);
        expect(result.stats.converted).toBe(3);
        // Edits should be sorted descending
        expect(result.edits[0].from).toBeGreaterThan(result.edits[1].from);
        expect(result.edits[1].from).toBeGreaterThan(result.edits[2].from);
    });

    it('skips invalid math in strict mode', () => {
        const text = "Bad \\({math\\)"; // Unbalanced brace
        const state = createMockEditorState(text);
        const normalizer = new MathNormalizerService(true); // strict mode
        const result = normalizer.normalize(state);

        expect(result.edits).toHaveLength(0);
        expect(result.stats.skipped).toBe(1);
        expect(result.errors).toHaveLength(1);
    });

    it('converts invalid math in non-strict mode', () => {
        const text = "Bad \\({math\\)";
        const state = createMockEditorState(text);
        const normalizer = new MathNormalizerService(false); // non-strict
        const result = normalizer.normalize(state);

        expect(result.edits).toHaveLength(1);
        expect(result.stats.converted).toBe(1);
        expect(result.stats.skipped).toBe(0);
        expect(result.errors).toHaveLength(0);
    });

    it('ignores math in code blocks', () => {
        const text = "Code: `\\(math\\)`";
        const state = createMockEditorState(text);
        const normalizer = new MathNormalizerService(false);
        const result = normalizer.normalize(state);

        expect(result.edits).toHaveLength(0);
        expect(result.stats.totalFound).toBe(0);
    });
});
