/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import {
  // $convertFromMarkdownString,
  // $convertToMarkdownString,
  TRANSFORMERS,
} from "@lexical/markdown";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { useState } from "react";
const placeholder = "Hãy bắt đầu viết...";

export default function Editor() {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  // const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);
  return (
    <div className="w-full border border-gray-200 rounded-lg bg-gray-50">
      <ToolbarPlugin
        editor={editor}
        activeEditor={activeEditor}
        setActiveEditor={setActiveEditor}
        // setIsLinkEditMode={setIsLinkEditMode}
      />
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      <div className="relative">
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="block w-full relative min-h-40 outline-none px-4 py-2 bg-white rounded-b-lg text-sm text-gray-800 border-0 focus:ring-0"
              aria-placeholder={placeholder}
              placeholder={
                <div className="absolute text-sm top-2 left-4 text-gray-400 text-ellipsis user-select-none pointer-events-none inline">
                  {placeholder}
                </div>
              }
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <TablePlugin
          hasCellMerge={true}
          hasCellBackgroundColor={true}
          hasTabHandler={true}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
      </div>
    </div>
  );
}
