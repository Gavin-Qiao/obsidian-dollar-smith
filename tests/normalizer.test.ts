import { MathNormalizerService } from "../src/normalizer";
import { createMockEditorState } from "./mocks/codemirror.mock";
import { readFixture } from "./utils";

describe('MathNormalizerService', () => {
    it('normalizes valid inline math from fixture', () => {
        const text = readFixture('simple-inline.md');
        const state = createMockEditorState(text);
        const normalizer = new MathNormalizerService(false);
        const result = normalizer.normalize(state);

        expect(result.edits).toHaveLength(1);
        expect(result.edits[0].insert).toBe("$inline math$");
        expect(result.stats.converted).toBe(1);
    });

    it('normalizes mixed content fixture', () => {
        const text = readFixture('mixed-content.md');
        const state = createMockEditorState(text);
        const normalizer = new MathNormalizerService(false);
        const result = normalizer.normalize(state);

        // Expect at least 5 edits
        expect(result.edits.length).toBeGreaterThanOrEqual(5);
        expect(result.stats.converted).toBeGreaterThanOrEqual(5);

        // Edits should be sorted descending
        for (let i = 0; i < result.edits.length - 1; i++) {
            expect(result.edits[i].from).toBeGreaterThan(result.edits[i + 1].from);
        }
    });

    it('ignores math in code blocks (using fixture)', () => {
        const text = readFixture('code-blocks.md');
        const state = createMockEditorState(text);
        const normalizer = new MathNormalizerService(false);
        const result = normalizer.normalize(state);

        // code-blocks.md:
        // "Here is math outside: \(x^2\)" -> Match
        // "var x = \(not math\);" (inside js block) -> No match
        // "Inline code: `\(not math\)`" -> No match
        // "Indented code block ... \(not math\)" -> No match

        // We expect exactly 1 match (the outside one).
        expect(result.edits).toHaveLength(1);
        expect(result.edits[0].original).toBe("\\(x^2\\)");
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
});
