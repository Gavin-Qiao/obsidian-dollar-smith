# Task: Testing Infrastructure

## Responsibility
Set up testing framework and write comprehensive tests for all components.

## Description
This task establishes the testing infrastructure and creates unit tests for each module. Tests ensure correctness, prevent regressions, and document expected behavior.

## Scope
- **Single Responsibility**: Test setup and test code only
- **Not Responsible For**: Production code implementation

## Deliverables

### 1. Test Framework Setup
```json
// package.json additions
{
  "devDependencies": {
    "jest": "^29.0.0",
    "@types/jest": "^29.0.0",
    "ts-jest": "^29.0.0"
  },
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### 2. Jest Configuration (`jest.config.js`)
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
```

### 3. Test Files Structure
```
tests/
├── delimiter-detector.test.ts
├── tree-walker.test.ts
├── validator.test.ts
├── normalizer.test.ts
├── fixtures/
│   ├── simple-inline.md
│   ├── code-blocks.md
│   ├── mixed-content.md
│   └── edge-cases.md
└── mocks/
    └── codemirror.mock.ts
```

### 4. Key Test Cases

#### Delimiter Detector Tests
```typescript
describe('DelimiterDetector', () => {
  it('finds inline delimiters \\(...\\)');
  it('finds display delimiters \\[...\\]');
  it('handles multiple delimiters');
  it('returns correct positions');
  it('ignores incomplete delimiters');
});
```

#### Tree Walker Tests
```typescript
describe('SyntaxTreeWalker', () => {
  it('excludes fenced code blocks');
  it('excludes inline code');
  it('excludes YAML frontmatter');
  it('excludes HTML blocks');
  it('returns correct text regions');
});
```

#### Validator Tests
```typescript
describe('MathValidator', () => {
  it('accepts balanced braces');
  it('rejects unbalanced braces');
  it('handles nested structures');
  it('ignores escaped characters');
});
```

#### Normalizer Tests
```typescript
describe('MathNormalizerService', () => {
  it('converts \\(x\\) to $x$');
  it('converts \\[x\\] to $$x$$');
  it('preserves code blocks');
  it('respects strict mode');
  it('returns correct statistics');
});
```

### 5. Mock CodeMirror
```typescript
// tests/mocks/codemirror.mock.ts
export function createMockEditorState(content: string): MockEditorState {
  return {
    doc: {
      toString: () => content,
      length: content.length
    },
    // ... minimal mock implementation
  };
}
```

## Dependencies
- Jest
- ts-jest
- @types/jest

## Acceptance Criteria
- [ ] Test framework runs successfully
- [ ] All detector tests pass
- [ ] All walker tests pass
- [ ] All validator tests pass
- [ ] All normalizer tests pass
- [ ] Code coverage > 80%
- [ ] Tests run in < 10 seconds

## Technical Notes
- Mock CodeMirror APIs since they require browser environment
- Use fixture files for complex test cases
- Test edge cases explicitly
- Document why each test exists

## Files to Create
- `jest.config.js`
- `tests/delimiter-detector.test.ts`
- `tests/tree-walker.test.ts`
- `tests/validator.test.ts`
- `tests/normalizer.test.ts`
- `tests/fixtures/*.md`
- `tests/mocks/codemirror.mock.ts`

## Estimated Effort
4-6 hours
