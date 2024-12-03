import { ToolbarContext } from "@/components/lexical/context/ToolbarContext";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import Editor from "@/components/lexical/editor";
import { editorConfig } from "@/components/lexical/editorConfig";
import { EditorState } from "lexical";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { SharedHistoryContext } from "./context/SharedHistoryContext";
import { memo } from "react";

const LexicalEditor = memo(
  ({
    onChange,
    markdown,
  }: {
    onChange?: (editorState: EditorState) => void;
    markdown?: string;
  }) => {
    return (
      <LexicalComposer initialConfig={editorConfig}>
        <SharedHistoryContext>
          <ToolbarContext>
            <Editor markdown={markdown} />
          </ToolbarContext>
          {onChange && <OnChangePlugin onChange={onChange} />}
        </SharedHistoryContext>
      </LexicalComposer>
    );
  },
);

LexicalEditor.displayName = "LexicalEditor";
export default LexicalEditor;
