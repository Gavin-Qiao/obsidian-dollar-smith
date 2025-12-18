# Task: Math Validator

## Responsibility
Validate detected math delimiters for structural correctness before conversion.

## Description
This task implements optional validation logic that checks whether detected math content has balanced braces, brackets, and other structural requirements. This enables "strict mode" where malformed math is skipped rather than converted.

## Scope
- **Single Responsibility**: Structural validation of math content only
- **Not Responsible For**: Detection, conversion, or decision to apply strict mode

## Deliverables

### 1. Validation Result Type (`src/types.ts`)
```typescript
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  type: 'unbalanced-braces' | 'unbalanced-brackets' | 'empty-content' | 'suspicious-pattern';
  message: string;
  position?: number;  // Relative to math content
}
```

### 2. Validator Class (`src/validator.ts`)
```typescript
export class MathValidator {
  /**
   * Validate math content for structural correctness.
   * @param content - Math content (without delimiters)
   * @returns Validation result with any errors found
   */
  validate(content: string): ValidationResult;
  
  /**
   * Check if braces {} are balanced.
   */
  private checkBraces(content: string): ValidationError[];
  
  /**
   * Check if brackets [] are balanced.
   */
  private checkBrackets(content: string): ValidationError[];
  
  /**
   * Check if parentheses () are balanced.
   */
  private checkParentheses(content: string): ValidationError[];
}
```

### 3. Validation Rules
| Check | Description | Strict Only |
|-------|-------------|-------------|
| Balanced `{}` | Opening and closing braces match | Yes |
| Balanced `[]` | Opening and closing brackets match | Yes |
| Balanced `()` | Opening and closing parens match | No (warn only) |
| Non-empty | Content is not just whitespace | No (warn only) |

### 4. Brace Counting Algorithm
```typescript
function checkBalance(content: string, open: string, close: string): boolean {
  let depth = 0;
  for (const char of content) {
    if (char === open) depth++;
    if (char === close) depth--;
    if (depth < 0) return false;  // Close before open
  }
  return depth === 0;
}
```

## Dependencies
- Types module

## Acceptance Criteria
- [ ] Correctly identifies unbalanced `{}`
- [ ] Correctly identifies unbalanced `[]`
- [ ] Correctly identifies unbalanced `()`
- [ ] Handles nested structures: `{a{b}c}`
- [ ] Handles adjacent structures: `{a}{b}`
- [ ] Ignores braces in LaTeX commands: `\frac{}{}`
- [ ] Returns detailed error positions

## Technical Notes
- Escaped characters (`\{`, `\}`) should not be counted
- Consider common LaTeX patterns that might have imbalanced delimiters
- Validation should be fast—O(n) single pass preferred

## Edge Cases to Handle
- Math with escaped braces: `\{x\}`
- Empty math: `\(\)` 
- Complex nesting: `{a[b(c)d]e}`
- LaTeX environments with optional args

## Files to Create
- `src/validator.ts`
- `src/types.ts` (additions)

## Estimated Effort
2-3 hours
