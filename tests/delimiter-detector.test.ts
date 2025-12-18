import { DelimiterDetector } from "../src/delimiter-detector";
import { TextRegion } from "../src/types";

describe('DelimiterDetector', () => {
    const detector = new DelimiterDetector();

    it('finds inline delimiters \\(...\\)', () => {
        const text = "Prefix \\(x^2\\) Suffix";
        const regions: TextRegion[] = [{ type: 'text', from: 0, to: text.length }];
        const results = detector.detect(text, regions);

        expect(results).toHaveLength(1);
        const d = results[0];
        expect(d.type).toBe('inline');
        expect(d.content).toBe('x^2');
        expect(d.openDelim).toBe('\\(');
        expect(d.closeDelim).toBe('\\)');

        // Check positions
        // "Prefix " is 7 chars.
        // Match starts at 7.
        // Content: "x^2" length 3.
        // Delimiters length 2 each.
        // Total match length 7.
        // End should be 14.
        expect(d.from).toBe(7);
        expect(d.to).toBe(14);
        expect(d.contentFrom).toBe(9);
        expect(d.contentTo).toBe(12);
    });

    it('finds display delimiters \\[...\\]', () => {
        const text = "Start \\[E=mc^2\\] End";
        const regions: TextRegion[] = [{ type: 'text', from: 0, to: text.length }];
        const results = detector.detect(text, regions);

        expect(results).toHaveLength(1);
        const d = results[0];
        expect(d.type).toBe('display');
        expect(d.content).toBe('E=mc^2');
        expect(d.openDelim).toBe('\\[');
        expect(d.closeDelim).toBe('\\]');
    });

    it('handles multiple delimiters', () => {
        const text = "A \\(a\\) B \\[b\\] C";
        const regions: TextRegion[] = [{ type: 'text', from: 0, to: text.length }];
        const results = detector.detect(text, regions);

        expect(results).toHaveLength(2);
        expect(results[0].content).toBe('a');
        expect(results[1].content).toBe('b');
    });

    it('skips escaped backslashes \\\\(', () => {
        // "Not math \\( text"
        // in JS string: "Not math \\\\( text"
        const text = "Not math \\\\( text";
        const regions: TextRegion[] = [{ type: 'text', from: 0, to: text.length }];
        const results = detector.detect(text, regions);

        expect(results).toHaveLength(0);
    });

    it('handles nested delimiters? (Usually invalid but checking behavior)', () => {
        // \( a \( b \) c \)
        // Our simple scanner will find first `\)` for first `\(`.
        // so content = " a \( b "
        const text = "\\( a \\( b \\) c \\)";
        const regions: TextRegion[] = [{ type: 'text', from: 0, to: text.length }];
        const results = detector.detect(text, regions);

        expect(results.length).toBeGreaterThan(0);
        expect(results[0].content).toBe(" a \\( b ");
        // The rest " c \)" remains.
        // " c " starts at result[0].to.
        // "\)" at end. Is there an opener? No.
    });

    it('handles escaped closer inside math', () => {
        // \( a \\) b \)
        // " a \\) b " should be content.
        const text = "\\( a \\\\) b \\)";
        const regions: TextRegion[] = [{ type: 'text', from: 0, to: text.length }];
        const results = detector.detect(text, regions);

        expect(results).toHaveLength(1);
        expect(results[0].content).toBe(" a \\\\) b ");
    });
});
