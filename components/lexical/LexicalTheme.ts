/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { EditorThemeClasses } from "lexical";

import "./LexicalTheme.css";

const theme: EditorThemeClasses = {
  autocomplete: "PlaygroundEditorTheme__autocomplete",
  blockCursor: "PlaygroundEditorTheme__blockCursor",
  characterLimit: "PlaygroundEditorTheme__characterLimit",
  code: "PlaygroundEditorTheme__code",
  codeHighlight: {
    atrule: "PlaygroundEditorTheme__tokenAttr",
    attr: "PlaygroundEditorTheme__tokenAttr",
    boolean: "PlaygroundEditorTheme__tokenProperty",
    builtin: "PlaygroundEditorTheme__tokenSelector",
    cdata: "PlaygroundEditorTheme__tokenComment",
    char: "PlaygroundEditorTheme__tokenSelector",
    class: "PlaygroundEditorTheme__tokenFunction",
    "class-name": "PlaygroundEditorTheme__tokenFunction",
    comment: "PlaygroundEditorTheme__tokenComment",
    constant: "PlaygroundEditorTheme__tokenProperty",
    deleted: "PlaygroundEditorTheme__tokenProperty",
    doctype: "PlaygroundEditorTheme__tokenComment",
    entity: "PlaygroundEditorTheme__tokenOperator",
    function: "PlaygroundEditorTheme__tokenFunction",
    important: "PlaygroundEditorTheme__tokenVariable",
    inserted: "PlaygroundEditorTheme__tokenSelector",
    keyword: "PlaygroundEditorTheme__tokenAttr",
    namespace: "PlaygroundEditorTheme__tokenVariable",
    number: "PlaygroundEditorTheme__tokenProperty",
    operator: "PlaygroundEditorTheme__tokenOperator",
    prolog: "PlaygroundEditorTheme__tokenComment",
    property: "PlaygroundEditorTheme__tokenProperty",
    punctuation: "PlaygroundEditorTheme__tokenPunctuation",
    regex: "PlaygroundEditorTheme__tokenVariable",
    selector: "PlaygroundEditorTheme__tokenSelector",
    string: "PlaygroundEditorTheme__tokenSelector",
    symbol: "PlaygroundEditorTheme__tokenProperty",
    tag: "PlaygroundEditorTheme__tokenProperty",
    url: "PlaygroundEditorTheme__tokenOperator",
    variable: "PlaygroundEditorTheme__tokenVariable",
  },
  embedBlock: {
    base: "PlaygroundEditorTheme__embedBlock",
    focus: "PlaygroundEditorTheme__embedBlockFocus",
  },
  hashtag: "PlaygroundEditorTheme__hashtag",

  heading: {
    h1: "text-4xl font-medium",
    h2: "text-3xl font-medium",
    h3: "text-3xl font-medium",
    h4: "text-lg font-medium",
    h5: "text-sm font-medium",
    h6: "text-xs font-medium",
  },

  hr: "h-px my-8 bg-gray-200 border-0",
  image: "w-full h-auto",
  indent: "PlaygroundEditorTheme__indent",
  inlineImage: "inline-editor-image",
  layoutContainer: "PlaygroundEditorTheme__layoutContainer",
  layoutItem: "PlaygroundEditorTheme__layoutItem",
  link: "PlaygroundEditorTheme__link",
  list: {
    checklist: "PlaygroundEditorTheme__checklist",
    listitem: "PlaygroundEditorTheme__listItem",
    listitemChecked: "PlaygroundEditorTheme__listItemChecked",
    listitemUnchecked: "PlaygroundEditorTheme__listItemUnchecked",
    nested: {
      listitem: "PlaygroundEditorTheme__nestedListItem",
    },
    ol: "space-y-1 text-gray-500 list-decimal list-inside",
    ul: "space-y-1 text-gray-500 list-disc list-inside",
  },
  ltr: "PlaygroundEditorTheme__ltr",
  mark: "PlaygroundEditorTheme__mark",
  markOverlap: "PlaygroundEditorTheme__markOverlap",
  quote: "p-4 my-4 border-s-4 border-gray-300 bg-gray-50",
  rtl: "PlaygroundEditorTheme__rtl",

  table: "PlaygroundEditorTheme__table",
  tableCell: "PlaygroundEditorTheme__tableCell",
  tableCellActionButton: "PlaygroundEditorTheme__tableCellActionButton",
  tableCellActionButtonContainer:
    "PlaygroundEditorTheme__tableCellActionButtonContainer",
  tableCellHeader: "PlaygroundEditorTheme__tableCellHeader",
  tableCellResizer: "PlaygroundEditorTheme__tableCellResizer",
  tableCellSelected: "PlaygroundEditorTheme__tableCellSelected",
  tableRowStriping: "PlaygroundEditorTheme__tableRowStriping",
  tableScrollableWrapper: "PlaygroundEditorTheme__tableScrollableWrapper",
  tableSelected: "PlaygroundEditorTheme__tableSelected",
  tableSelection: "PlaygroundEditorTheme__tableSelection",

  text: {
    bold: "font-bold",
    code: "PlaygroundEditorTheme__textCode",
    italic: "italic",
    strikethrough: "line-through",
    subscript: "PlaygroundEditorTheme__textSubscript",
    superscript: "PlaygroundEditorTheme__textSuperscript",
    underline: "underline",
    underlineStrikethrough: "underline line-through",
  },
};

export default theme;
