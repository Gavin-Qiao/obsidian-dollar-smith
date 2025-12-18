import { ValidationResult, ValidationError } from "./types";

export class MathValidator {
    /**
     * Validate math content for structural correctness.
     * @param content - Math content (without delimiters)
     * @returns Validation result with any errors found
     */
    validate(content: string): ValidationResult {
        const errors: ValidationError[] = [];

        // Check braces {}
        const braceResult = this.checkBalance(content, '{', '}');
        if (!braceResult.balanced) {
            errors.push({
                type: 'unbalanced-braces',
                message: 'Unbalanced braces {}',
                position: braceResult.index
            });
        }

        // Check brackets []
        const bracketResult = this.checkBalance(content, '[', ']');
        if (!bracketResult.balanced) {
            errors.push({
                type: 'unbalanced-brackets',
                message: 'Unbalanced brackets []',
                position: bracketResult.index
            });
        }

        // Check parentheses ()
        const parenResult = this.checkBalance(content, '(', ')');
        if (!parenResult.balanced) {
            errors.push({
                type: 'unbalanced-parentheses',
                message: 'Unbalanced parentheses ()',
                position: parenResult.index
            });
        }

        // Check empty
        if (content.trim().length === 0) {
            errors.push({
                type: 'empty-content',
                message: 'Math content is empty'
            });
        }

        // Determine isValid
        // strictly invalid if braces or brackets are unbalanced.
        const hasStrictError = errors.some(e =>
            e.type === 'unbalanced-braces' || e.type === 'unbalanced-brackets');

        return {
            isValid: !hasStrictError,
            errors
        };
    }

    private checkBalance(content: string, open: string, close: string): { balanced: boolean; index?: number } {
        const openIndices: number[] = [];

        for (let i = 0; i < content.length; i++) {
            const char = content[i];

            if (char === '\\') {
                i++; // Skip next character (escaped)
                continue;
            }

            if (char === open) {
                openIndices.push(i);
            } else if (char === close) {
                if (openIndices.length === 0) {
                    return { balanced: false, index: i }; // Unexpected close
                }
                openIndices.pop();
            }
        }

        if (openIndices.length > 0) {
            return { balanced: false, index: openIndices[openIndices.length - 1] }; // Unclosed open
        }

        return { balanced: true };
    }
}
