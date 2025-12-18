import { MathValidator } from "../src/validator";

describe('MathValidator', () => {
    const validator = new MathValidator();

    it('accepts balanced content', () => {
        const result = validator.validate("x^2 + {a} + [b] + (c)");
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    it('rejects unbalanced braces', () => {
        const result = validator.validate("x^{2");
        expect(result.isValid).toBe(false);
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].type).toBe('unbalanced-braces');
        expect(result.errors[0].position).toBe(2); // Index of {
    });

    it('rejects extra closing brace', () => {
        const result = validator.validate("x}");
        expect(result.isValid).toBe(false);
        expect(result.errors[0].type).toBe('unbalanced-braces');
        expect(result.errors[0].position).toBe(1); // Index of }
    });

    it('rejects unbalanced brackets', () => {
        const result = validator.validate("[a");
        expect(result.isValid).toBe(false);
        expect(result.errors[0].type).toBe('unbalanced-brackets');
    });

    it('warns on unbalanced parentheses but keeps isValid true (if no other errors)', () => {
        const result = validator.validate("(a");
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].type).toBe('unbalanced-parentheses');
    });

    it('handles escaped braces', () => {
        // \{ a \} is balanced because { and } are escaped, so depth doesn't change
        const result = validator.validate("\\{ a \\}");
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    it('handles LaTeX commands like \\left(', () => {
        // \left( a \right)
        // My simple parser sees ( and ). They should balance.
        const result = validator.validate("\\left( a \\right)");
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    it('flags empty content', () => {
        const result = validator.validate("   ");
        // Empty content is "Strict Only: No" in the table?
        // Table: "Non-empty ... Strict Only: No (warn only)"
        // So isValid should be true.
        expect(result.isValid).toBe(true);
        expect(result.errors[0].type).toBe('empty-content');
    });
});
