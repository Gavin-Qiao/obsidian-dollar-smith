# Dollar Smith - Task Overview

## Project Summary
Dollar Smith is an Obsidian plugin that safely normalizes LaTeX-style math delimiters (`\(...\)` → `$...$` and `\[...\]` → `$$...$$`) using CodeMirror 6's syntax tree for precision.

## Task Dependencies

```
┌─────────────────────────────────────────────────────────────────────┐
│                         DEVELOPMENT FLOW                            │
└─────────────────────────────────────────────────────────────────────┘

   09-Build Pipeline ──────────────────────────────────────────────┐
           │                                                        │
           ▼                                                        │
   01-Plugin Bootstrap ◄─────┬─────────────────────────────────────┤
           │                  │                                     │
           ├──────────────────┘                                     │
           ▼                                                        │
   02-Settings Management                                           │
                                                                    │
   ┌──────────────────────────────────────────────────────────┐    │
   │                    CORE PIPELINE                          │    │
   │                                                           │    │
   │   03-Syntax Tree Walker                                   │    │
   │           │                                               │    │
   │           ▼                                               │    │
   │   04-Delimiter Detector                                   │    │
   │           │                                               │    │
   │           ▼                                               │    │
   │   05-Math Validator                                       │    │
   │           │                                               │    │
   │           ▼                                               │    │
   │   06-Normalizer Service                                   │    │
   └───────────│───────────────────────────────────────────────┘    │
               │                                                     │
               ▼                                                     │
   07-Editor Integration ◄───────────────────────────────────────────┘
               │
               ▼
   08-Testing Infrastructure (spans all components)
```

## Task Sequence

### Phase 1: Foundation
| # | Task | Est. Hours | Dependencies |
|---|------|------------|--------------|
| 09 | Build & Release Pipeline | 2-3 | None |
| 01 | Plugin Core Bootstrap | 2-3 | 09 |
| 02 | Settings Management | 1-2 | 01 |

### Phase 2: Core Components
| # | Task | Est. Hours | Dependencies |
|---|------|------------|--------------|
| 03 | Syntax Tree Walker | 4-5 | 09 |
| 04 | Delimiter Detector | 3-4 | 03 |
| 05 | Math Validator | 2-3 | 04 |

### Phase 3: Integration
| # | Task | Est. Hours | Dependencies |
|---|------|------------|--------------|
| 06 | Normalizer Service | 3-4 | 03, 04, 05 |
| 07 | Editor Integration | 2-3 | 01, 06 |

### Phase 4: Quality Assurance
| # | Task | Est. Hours | Dependencies |
|---|------|------------|--------------|
| 08 | Testing Infrastructure | 4-6 | All others |

## Total Estimated Effort
**24-34 hours** (3-4 developer days)

## Key Principles

### Single Responsibility
Each task has ONE clearly defined responsibility:
- **Tree Walker**: Identifies safe regions (nothing else)
- **Detector**: Finds delimiters (no validation)
- **Validator**: Checks structure (no detection)
- **Normalizer**: Orchestrates pipeline (delegates work)
- **Editor Adapter**: Applies edits (no generation)

### Fail-Safe Design
- Unknown regions → skip
- Malformed math → leave unchanged
- Invalid ranges → abort edit
- No destructive operations

### Performance Requirements
- Process 5000-line documents in < 100ms
- Single atomic transaction for all edits
- No full-document re-serialization

## Module Interaction

```typescript
// Flow through the system
function onNormalizeCommand(editor: Editor, view: MarkdownView) {
  // 1. Get EditorView from Obsidian
  const editorView = getEditorView(editor);
  
  // 2. Get current state
  const state = editorView.state;
  
  // 3. Run normalizer pipeline
  const result = normalizer.normalize(state);
  
  // 4. Apply edits to editor
  if (result.edits.length > 0) {
    editorAdapter.applyEdits(editorView, result.edits);
  }
  
  // 5. Show notification
  new Notice(`Converted ${result.stats.converted} math expressions`);
}
```

## Getting Started

1. Start with **Task 09** (Build Pipeline) to set up tooling
2. Create **Task 01** (Plugin Bootstrap) for basic plugin structure
3. Develop core pipeline tasks (03 → 04 → 05 → 06) in order
4. Integrate with **Task 07** (Editor Integration)
5. Write tests throughout with **Task 08**

---

*Each task file contains detailed specifications, acceptance criteria, and technical notes.*
