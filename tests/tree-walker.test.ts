import { SyntaxTreeWalker } from "../src/tree-walker";
import { createMockEditorState } from "./mocks/codemirror.mock";
import { readFixture } from "./utils";

describe('SyntaxTreeWalker', () => {
    const walker = new SyntaxTreeWalker();

    it('identifies entire document as safe if no protected nodes', () => {
        const text = "Just some simple text.";
        const state = createMockEditorState(text);
        const regions = walker.getSafeRegions(state);

        expect(regions).toHaveLength(1);
        expect(regions[0]).toEqual({ type: 'text', from: 0, to: text.length });
    });

    it('excludes fenced code blocks and inline code from fixture', () => {
        const text = readFixture('code-blocks.md');
        const state = createMockEditorState(text);
        const regions = walker.getSafeRegions(state);

        // Verify we captured the safe math
        const safeMath = "\\(x^2\\)";
        const captured = regions.some(r => text.slice(r.from, r.to).includes(safeMath));
        expect(captured).toBe(true);

        // Verify we excluded the code
        for (const region of regions) {
            const regionText = text.slice(region.from, region.to);
            // Fenced code content
            expect(regionText).not.toContain("var x =");
            // Indented code content
            expect(regionText).not.toContain("Indented code block");
        }
    });

    it('excludes frontmatter', () => {
        const text = readFixture('frontmatter.md');
        const state = createMockEditorState(text);
        const regions = walker.getSafeRegions(state);

        // Expect frontmatter to be excluded.
        expect(regions.length).toBeGreaterThan(0);

        // Verify no region contains the frontmatter keys
        for (const region of regions) {
            const t = text.slice(region.from, region.to);
            expect(t).not.toContain("title: My Doc");
            expect(t).not.toContain("tags:");
        }

        // Verify safe content is there
        const safeText = regions.map(r => text.slice(r.from, r.to)).join("");
        expect(safeText).toContain("Body content with \\(math\\)");
    });

    it('excludes HTML blocks', () => {
        const text = "Start\n\n<div>html</div>\n\nEnd";
        const state = createMockEditorState(text);
        const regions = walker.getSafeRegions(state);

        expect(regions.length).toBeGreaterThanOrEqual(2);
        // Ensure "<div>html</div>" is not in any region
        for (const region of regions) {
            const t = text.slice(region.from, region.to);
            expect(t).not.toContain("<div>");
        }
    });

    it('isPositionSafe returns correct boolean', () => {
        const regions = [{ type: 'text' as const, from: 0, to: 10 }, { type: 'text' as const, from: 20, to: 30 }];
        expect(walker.isPositionSafe(5, regions)).toBe(true);
        expect(walker.isPositionSafe(15, regions)).toBe(false);
        expect(walker.isPositionSafe(20, regions)).toBe(true);
        expect(walker.isPositionSafe(30, regions)).toBe(false);
    });

    it('handles document ending with protected region', () => {
        const text = "Prefix `code`";
        const state = createMockEditorState(text);
        const regions = walker.getSafeRegions(state);

        expect(regions).toHaveLength(1);
        expect(regions[0].to).toBe(7);
    });
});
