# Task: Delimiter Detector

## Responsibility
Detect LaTeX-style math delimiters (`\(...\)` and `\[...\]`) within safe text regions.

## Description
This task implements pattern detection for LaTeX math delimiters. It scans safe text regions and returns structured information about each delimiter pair found, including positions and content.

## Scope
- **Single Responsibility**: Delimiter pattern matching only
- **Not Responsible For**: Determining if region is safe (Tree Walker does that), performing conversions, or validation

## Deliverables

### 1. Delimiter Types (`src/types.ts`)
```typescript
export type DelimiterType = 'inline' | 'display';

export interface MathDelimiter {
  type: DelimiterType;
  from: number;        // Start of opening delimiter
  to: number;          // End of closing delimiter
  openDelim: string;   // '\(' or '\['
  closeDelim: string;  // '\)' or '\]'
  content: string;     // Math content between delimiters
  contentFrom: number; // Start of content
  contentTo: number;   // End of content
}
```

### 2. Detector Class (`src/delimiter-detector.ts`)
```typescript
export class DelimiterDetector {
  /**
   * Find all LaTeX-style math delimiters in the given text.
   * @param text - Document text
   * @param safeRegions - Regions where detection is allowed
   * @returns Array of detected delimiters
   */
  detect(text: string, safeRegions: TextRegion[]): MathDelimiter[];
  
  /**
   * Find inline delimiters \(...\) in text.
   */
  private findInlineDelimiters(text: string, offset: number): MathDelimiter[];
  
  /**
   * Find display delimiters \[...\] in text.
   */
  private findDisplayDelimiters(text: string, offset: number): MathDelimiter[];
}
```

### 3. Pattern Definitions
```typescript
// Inline: \(...\)
const INLINE_OPEN = /\\\\(/g;
const INLINE_CLOSE = /\\\\)/g;

// Display: \[...\]
const DISPLAY_OPEN = /\\\\\\[/g;
const DISPLAY_CLOSE = /\\\\\\]/g;
```

### 4. Detection Algorithm
```
For each safe region:
  1. Extract substring from document
  2. Scan for opening delimiters
  3. For each opener, find matching closer
  4. Validate delimiter pair (properly nested, not empty)
  5. Build MathDelimiter object with absolute positions
```

## Dependencies
- Types module (TextRegion)

## Acceptance Criteria
- [ ] Detects `\(x^2\)` as inline math
- [ ] Detects `\[x^2\]` as display math
- [ ] Ignores delimiters in protected regions
- [ ] Handles multiple delimiters in same region
- [ ] Reports accurate character positions
- [ ] Handles edge case: delimiter at region boundary
- [ ] Skips escaped delimiters `\\(` (double backslash)

## Technical Notes
- Use regex with `lastIndex` for efficient scanning
- Position offsets must be absolute (document-level), not region-relative
- Consider empty math `\(\)` as valid (leave conversion to validator)
- Preserve the exact content string for later use

## Edge Cases to Handle
- Nested brackets inside math: `\[f(x)\]`
- Multi-line display math
- Adjacent delimiters: `\(a\)\(b\)`
- Delimiter-like text: `\(` without closing

## Files to Create/Modify
- `src/delimiter-detector.ts`
- `src/types.ts` (additions)

## Estimated Effort
3-4 hours
