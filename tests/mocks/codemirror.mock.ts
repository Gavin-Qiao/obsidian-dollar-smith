import { EditorState } from "@codemirror/state";
import { markdown } from "@codemirror/lang-markdown";
import { MarkdownConfig, BlockContext, Line } from "@lezer/markdown";

const FrontMatterExtension: MarkdownConfig = {
  defineNodes: [{ name: "FrontMatter", block: true }],
  parseBlock: [{
    name: "FrontMatter",
    parse(cx: BlockContext, line: Line) {
      if (cx.lineStart !== 0 || line.text !== "---") return false;
      const start = cx.lineStart;
      if (!cx.nextLine()) return false;
      while (cx.line.text !== "---") {
          if (!cx.nextLine()) return false;
      }
      const end = cx.lineStart + 3;
      cx.addElement(cx.elt("FrontMatter", start, end));
      cx.nextLine();
      return true;
    }
  }]
};

export function createMockEditorState(content: string): EditorState {
  return EditorState.create({
    doc: content,
    extensions: [markdown({
        extensions: [
            // Remove standard parsers that conflict with our simple FrontMatter mock
            { remove: ["HorizontalRule", "SetextHeading"] },
            FrontMatterExtension
        ]
    })]
  });
}
