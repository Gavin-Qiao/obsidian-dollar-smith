# Task: Math Normalizer Service

## Responsibility
Orchestrate the full normalization pipeline: walking, detecting, validating, and producing edits.

## Description
This is the core coordination layer that brings together all the components. It takes an editor state, runs the pipeline, and produces a list of surgical edits ready to apply.

## Scope
- **Single Responsibility**: Pipeline orchestration and edit generation only
- **Not Responsible For**: Individual component logic (tree walking, detection, validation)

## Deliverables

### 1. Edit Type (`src/types.ts`)
```typescript
export interface NormalizationEdit {
  from: number;         // Start position to replace
  to: number;           // End position to replace
  insert: string;       // Replacement text
  original: string;     // Original text (for debugging/undo)
  delimiterType: DelimiterType;
}

export interface NormalizationResult {
  edits: NormalizationEdit[];
  stats: {
    totalFound: number;
    converted: number;
    skipped: number;
  };
  errors: ValidationError[];
}
```

### 2. Normalizer Service (`src/normalizer.ts`)
```typescript
export class MathNormalizerService {
  private treeWalker: SyntaxTreeWalker;
  private detector: DelimiterDetector;
  private validator: MathValidator;
  
  constructor(strictMode: boolean);
  
  /**
   * Analyze document and produce normalization edits.
   * @param state - EditorState from CodeMirror
   * @returns Result with edits and statistics
   */
  normalize(state: EditorState): NormalizationResult;
  
  /**
   * Convert a single delimiter to dollar notation.
   */
  private convertDelimiter(delimiter: MathDelimiter): NormalizationEdit;
}
```

### 3. Conversion Logic
```typescript
// Inline: \(...\) → $...$
function convertInline(delimiter: MathDelimiter): string {
  return `$${delimiter.content}$`;
}

// Display: \[...\] → $$...$$  
function convertDisplay(delimiter: MathDelimiter): string {
  return `$$${delimiter.content}$$`;
}
```

### 4. Pipeline Flow
```
1. Get safe regions from SyntaxTreeWalker
2. Detect delimiters in safe regions
3. For each delimiter:
   a. Validate content (if strict mode)
   b. If valid or not strict: create edit
   c. If invalid and strict: skip, log error
4. Return edits sorted by position (descending for safe application)
```

## Dependencies
- SyntaxTreeWalker (Task 03)
- DelimiterDetector (Task 04)
- MathValidator (Task 05)
- CodeMirror 6 state

## Acceptance Criteria
- [ ] Successfully orchestrates full pipeline
- [ ] Produces correct edits for inline math
- [ ] Produces correct edits for display math
- [ ] Respects strict mode setting
- [ ] Returns accurate statistics
- [ ] Edits are sorted in correct order for application
- [ ] Handles empty results gracefully

## Technical Notes
- Sort edits by position descending to apply from end to start
  (avoids position shifting issues)
- Preserve exact whitespace in content
- Make service stateless—all state comes from EditorState

## Performance Considerations
- Process large documents in reasonable time (<100ms for 5000 lines)
- Avoid unnecessary string allocations
- Consider early exit if no delimiters found

## Files to Create
- `src/normalizer.ts`
- `src/types.ts` (additions)

## Estimated Effort
3-4 hours
