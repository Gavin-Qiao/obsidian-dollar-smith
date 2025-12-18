import { EditorState } from "@codemirror/state";
import { SyntaxTreeWalker } from "./tree-walker";
import { DelimiterDetector } from "./delimiter-detector";
import { MathValidator } from "./validator";
import { MathDelimiter, NormalizationEdit, NormalizationResult, ValidationError } from "./types";

export class MathNormalizerService {
    private treeWalker: SyntaxTreeWalker;
    private detector: DelimiterDetector;
    private validator: MathValidator;
    private strictMode: boolean;

    constructor(strictMode: boolean) {
        this.strictMode = strictMode;
        this.treeWalker = new SyntaxTreeWalker();
        this.detector = new DelimiterDetector();
        this.validator = new MathValidator();
    }

    /**
     * Analyze document and produce normalization edits.
     * @param state - EditorState from CodeMirror
     * @returns Result with edits and statistics
     */
    normalize(state: EditorState): NormalizationResult {
        const docText = state.doc.toString();
        const safeRegions = this.treeWalker.getSafeRegions(state);
        const delimiters = this.detector.detect(docText, safeRegions);

        const edits: NormalizationEdit[] = [];
        const errors: ValidationError[] = [];
        const stats = {
            totalFound: delimiters.length,
            converted: 0,
            skipped: 0
        };

        for (const delimiter of delimiters) {
            const validation = this.validator.validate(delimiter.content);

            // Determine if we should process this delimiter
            let shouldConvert = true;
            if (!validation.isValid) {
                if (this.strictMode) {
                    shouldConvert = false;
                    stats.skipped++;
                    errors.push(...validation.errors);
                }
            }

            if (shouldConvert) {
                const edit = this.convertDelimiter(delimiter, docText);
                edits.push(edit);
                stats.converted++;
            }
        }

        // Sort edits by position descending to ensure safe application
        edits.sort((a, b) => b.from - a.from);

        return {
            edits,
            stats,
            errors
        };
    }

    private convertDelimiter(delimiter: MathDelimiter, docText: string): NormalizationEdit {
        const original = docText.slice(delimiter.from, delimiter.to);
        let insert = "";

        if (delimiter.type === 'inline') {
            insert = `$${delimiter.content}$`;
        } else {
            insert = `$$${delimiter.content}$$`;
        }

        return {
            from: delimiter.from,
            to: delimiter.to,
            insert,
            original,
            delimiterType: delimiter.type
        };
    }
}
