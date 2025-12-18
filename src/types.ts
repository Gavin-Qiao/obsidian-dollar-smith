// Task 03: Syntax Tree Walker Types
export type RegionType =
  | 'text'          // Safe for processing
  | 'code-block'    // Fenced code blocks
  | 'inline-code'   // Backtick-wrapped code
  | 'frontmatter'   // YAML header
  | 'html'          // HTML blocks/elements
  | 'comment';      // HTML comments

export interface TextRegion {
  type: RegionType;
  from: number;  // Start position (inclusive)
  to: number;    // End position (exclusive)
}

// Task 04: Delimiter Detector Types
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

// Task 05: Math Validator Types
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  type: 'unbalanced-braces' | 'unbalanced-brackets' | 'unbalanced-parentheses' | 'empty-content' | 'suspicious-pattern';
  message: string;
  position?: number;  // Relative to math content
}
