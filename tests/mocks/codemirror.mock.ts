import { EditorState } from "@codemirror/state";
import { markdown } from "@codemirror/lang-markdown";

export function createMockEditorState(content: string): EditorState {
  return EditorState.create({
    doc: content,
    extensions: [markdown()]
  });
}
