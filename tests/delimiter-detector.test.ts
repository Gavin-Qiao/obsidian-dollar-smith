import { DelimiterDetector } from "../src/delimiter-detector";
import { TextRegion } from "../src/types";
import { readFixture } from "./utils";

describe('DelimiterDetector', () => {
    const detector = new DelimiterDetector();

    it('finds inline delimiters in simple fixture', () => {
        const text = readFixture('simple-inline.md');
        const regions: TextRegion[] = [{ type: 'text', from: 0, to: text.length }];
        const results = detector.detect(text, regions);

        // Content: "This is a text with \(inline math\).\nAnd some more text."
        expect(results).toHaveLength(1);
        const d = results[0];
        expect(d.type).toBe('inline');
        expect(d.content).toBe('inline math');
        expect(d.openDelim).toBe('\\(');
        expect(d.closeDelim).toBe('\\)');
    });

    it('finds display delimiters and mixed content', () => {
        const text = readFixture('mixed-content.md');
        const regions: TextRegion[] = [{ type: 'text', from: 0, to: text.length }];
        const results = detector.detect(text, regions);

        // Check for display math
        const display = results.find(d => d.type === 'display');
        expect(display).toBeDefined();
        expect(display!.content.trim()).toBe('E = mc^2');

        // Check for table math
        const tableMath = results.find(d => d.content === 'x');
        expect(tableMath).toBeDefined();
    });

    it('handles edge cases fixture', () => {
        const text = readFixture('edge-cases.md');
        const regions: TextRegion[] = [{ type: 'text', from: 0, to: text.length }];
        const results = detector.detect(text, regions);

        // "Unbalanced: \( x^2" -> Should not match (no closer)
        // "Escaped: \\( not math \\)" -> Should not match
        // "Complex: \( a + (b * c) \)" -> Should match
        // "Adjacent: \(a\)\(b\)" -> Should match 2

        const complex = results.find(d => d.content.includes('a + (b * c)'));
        if (!complex) {
             console.log('Results content:', results.map(r => r.content));
        }
        expect(complex).toBeDefined();

        const adjacentA = results.find(d => d.content === 'a');
        const adjacentB = results.find(d => d.content === 'b');
        expect(adjacentA).toBeDefined();
        expect(adjacentB).toBeDefined();

        // Ensure escaped ones are not matched
        const escaped = results.find(d => d.content.includes('not math'));
        expect(escaped).toBeUndefined();
    });

    // Keep unit tests for specific logic that might not be easily covered by fixtures or require precise offset checks
    it('skips escaped backslashes in inline string', () => {
        const text = "Not math \\\\( text";
        const regions: TextRegion[] = [{ type: 'text', from: 0, to: text.length }];
        const results = detector.detect(text, regions);
        expect(results).toHaveLength(0);
    });

    it('handles nested delimiters (logic check)', () => {
        const text = "\\( a \\( b \\) c \\)";
        const regions: TextRegion[] = [{ type: 'text', from: 0, to: text.length }];
        const results = detector.detect(text, regions);
        // Expect greedy or first match? Implementation uses Regex or scan?
        // Current impl finds first `\)` for first `\(`.
        expect(results.length).toBeGreaterThan(0);
        expect(results[0].content).toBe(" a \\( b ");
    });
});
