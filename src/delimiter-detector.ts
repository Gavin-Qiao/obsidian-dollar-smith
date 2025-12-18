import { TextRegion, MathDelimiter } from "./types";

export class DelimiterDetector {
    /**
     * Find all LaTeX-style math delimiters in the given text.
     * @param text - Document text
     * @param safeRegions - Regions where detection is allowed
     * @returns Array of detected delimiters
     */
    detect(text: string, safeRegions: TextRegion[]): MathDelimiter[] {
        const delimiters: MathDelimiter[] = [];

        for (const region of safeRegions) {
            this.scanRegion(text, region, delimiters);
        }
        return delimiters;
    }

    private scanRegion(docText: string, region: TextRegion, delimiters: MathDelimiter[]) {
        let index = region.from;
        const end = region.to;

        while (index < end) {
            const nextSlash = docText.indexOf('\\', index);
            if (nextSlash === -1 || nextSlash >= end) break;

            // Ensure we are strictly inside the region (although slice implies it, we are scanning full docText but constrained by indices)
            // Wait, scanRegion uses docText and limits. Correct.

            const charAfter = docText[nextSlash + 1];

            // Check for escaped backslash: `\\`
            if (charAfter === '\\') {
                index = nextSlash + 2;
                continue;
            }

            if (charAfter === '(') {
                // Found `\(`. Inline opener.
                const start = nextSlash;
                const contentStart = start + 2;
                const closer = this.findCloser(docText, contentStart, end, ')');

                if (closer !== -1) {
                    delimiters.push({
                        type: 'inline',
                        from: start,
                        to: closer + 2,
                        openDelim: '\\(',
                        closeDelim: '\\)',
                        content: docText.slice(contentStart, closer),
                        contentFrom: contentStart,
                        contentTo: closer
                    });
                    index = closer + 2;
                } else {
                    index = start + 2;
                }
            } else if (charAfter === '[') {
                // Found `\[`. Display opener.
                const start = nextSlash;
                const contentStart = start + 2;
                const closer = this.findCloser(docText, contentStart, end, ']');

                if (closer !== -1) {
                    delimiters.push({
                        type: 'display',
                        from: start,
                        to: closer + 2,
                        openDelim: '\\[',
                        closeDelim: '\\]',
                        content: docText.slice(contentStart, closer),
                        contentFrom: contentStart,
                        contentTo: closer
                    });
                    index = closer + 2;
                } else {
                    index = start + 2;
                }
            } else {
                index = nextSlash + 1;
            }
        }
    }

    private findCloser(text: string, start: number, limit: number, char: string): number {
        let index = start;
        while (index < limit) {
            const nextSlash = text.indexOf('\\', index);
            if (nextSlash === -1 || nextSlash >= limit) return -1;

            const charAfter = text[nextSlash + 1];

            if (charAfter === '\\') {
                index = nextSlash + 2;
                continue;
            }

            if (charAfter === char) {
                return nextSlash;
            }

            index = nextSlash + 1;
        }
        return -1;
    }
}
