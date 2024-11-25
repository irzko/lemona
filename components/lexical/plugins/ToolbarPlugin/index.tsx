/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  $findMatchingParent,
  $getNearestNodeOfType,
  $isEditorIsNestedEditor,
  mergeRegister,
} from "@lexical/utils";
// import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $isListNode, ListNode } from "@lexical/list";
import { $isTableNode, $isTableSelection } from "@lexical/table";
import {
  /* $getSelectionStyleValueForProperty, */
  $isParentElementRTL,
} from "@lexical/selection";
import {
  /* $createCodeNode, */
  $isCodeNode,
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  CODE_LANGUAGE_MAP,
  getLanguageFriendlyName,
} from "@lexical/code";
import {
  /* $createHeadingNode,
  $createQuoteNode, */
  $isHeadingNode,
  /* $isQuoteNode,
  HeadingTagType, */
} from "@lexical/rich-text";
import {
  $getNodeByKey,
  // $getRoot,
  $getSelection,
  // $isElementNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
  NodeKey,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";

import {
  clearFormatting,
  formatBulletList,
  formatCheckList,
  formatCode,
  formatHeading,
  formatNumberedList,
  formatParagraph,
  formatQuote,
} from "./utils";
import {
  blockTypeToBlockName,
  useToolbarState,
} from "@/components/lexical/context/ToolbarContext";
// import { sanitizeUrl } from "@/components/lexical/utils/url";
import { Dispatch, useCallback, useEffect, useState } from "react";
import { getSelectedNode } from "@/components/lexical/utils/getSelectedNode";
import Button from "@/components/ui/Button";
import DropDown, { DropDownItem } from "@/components/ui/DropDown";

function Divider() {
  return (
    <div className="px-1">
      <span className="block w-px h-5 bg-gray-300"></span>
    </div>
  );
}

function getCodeLanguageOptions(): [string, string][] {
  const options: [string, string][] = [];

  for (const [lang, friendlyName] of Object.entries(
    CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  )) {
    options.push([lang, friendlyName]);
  }

  return options;
}

const CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions();

function dropDownActiveClass(active: boolean) {
  if (active) {
    return "bg-gray-100 text-gray-900";
  } else {
    return "";
  }
}

type rootTypeToRootName = {
  root: "Root";
  table: "Table";
};

const iconBlockFormat: {
  [key in keyof typeof blockTypeToBlockName]: {
    icon: JSX.Element;
  };
} = {
  bullet: {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={20}
        height={20}
        fill={"none"}
      >
        <path
          d="M8 5L20 5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M4 5H4.00898"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 12H4.00898"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 19H4.00898"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 12L20 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M8 19L20 19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  check: {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={20}
        height={20}
        fill={"none"}
      >
        <path
          d="M11 6L21 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M11 12L21 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M11 18L21 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M3 7.39286C3 7.39286 4 8.04466 4.5 9C4.5 9 6 5.25 8 4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3 18.3929C3 18.3929 4 19.0447 4.5 20C4.5 20 6 16.25 8 15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  code: {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={20}
        height={20}
        fill={"none"}
      >
        <path
          d="M17 8L18.8398 9.85008C19.6133 10.6279 20 11.0168 20 11.5C20 11.9832 19.6133 12.3721 18.8398 13.1499L17 15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7 8L5.16019 9.85008C4.38673 10.6279 4 11.0168 4 11.5C4 11.9832 4.38673 12.3721 5.16019 13.1499L7 15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.5 4L9.5 20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  h1: {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={20}
        height={20}
        fill={"none"}
      >
        <path
          d="M4 5V19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 5V19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17 19H18.5M20 19H18.5M18.5 19V11L17 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 12L14 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  h2: {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={20}
        height={20}
        fill={"none"}
      >
        <path
          d="M3.5 5V19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.5 5V19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20.5 19H16.5V18.6907C16.5 18.2521 16.5 18.0327 16.5865 17.8385C16.673 17.6443 16.836 17.4976 17.1621 17.2041L19.7671 14.8596C20.2336 14.4397 20.5 13.8416 20.5 13.214V13C20.5 11.8954 19.6046 11 18.5 11C17.3954 11 16.5 11.8954 16.5 13V13.4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.5 12L13.5 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  h3: {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={20}
        height={20}
        fill={"none"}
      >
        <path
          d="M3.5 5V19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.5 5V19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16.5 17C16.5 18.1046 17.3954 19 18.5 19C19.6046 19 20.5 18.1046 20.5 17C20.5 15.8954 19.6046 15 18.5 15C19.6046 15 20.5 14.1046 20.5 13C20.5 11.8954 19.6046 11 18.5 11C17.3954 11 16.5 11.8954 16.5 13"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.5 12L13.5 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  h4: { icon: <></> },
  h5: { icon: <></> },
  h6: { icon: <></> },
  number: {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={20}
        height={20}
        fill={"none"}
      >
        <path
          d="M11 6L21 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M11 12L21 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M11 18L21 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M3 15H4.5C4.77879 15 4.91819 15 5.03411 15.0231C5.51014 15.1177 5.88225 15.4899 5.97694 15.9659C6 16.0818 6 16.2212 6 16.5C6 16.7788 6 16.9182 5.97694 17.0341C5.88225 17.5101 5.51014 17.8823 5.03411 17.9769C4.91819 18 4.77879 18 4.5 18C4.22121 18 4.08181 18 3.96589 18.0231C3.48986 18.1177 3.11775 18.4899 3.02306 18.9659C3 19.0818 3 19.2212 3 19.5V20.4C3 20.6828 3 20.8243 3.08787 20.9121C3.17574 21 3.31716 21 3.6 21H6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3 3H4.2C4.36569 3 4.5 3.13431 4.5 3.3V9M4.5 9H3M4.5 9H6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  paragraph: {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={20}
        height={20}
        fill={"none"}
      >
        <path
          d="M15 21.001H9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 3.00001V21.0008M12 3.00001C13.3874 3.00001 15.1695 3.03055 16.5884 3.17649C17.1885 3.2382 17.4886 3.26906 17.7541 3.37791C18.3066 3.60429 18.7518 4.10063 18.9194 4.67681C19 4.95382 19 5.26992 19 5.90215M12 3.00001C10.6126 3.00001 8.83047 3.03055 7.41161 3.17649C6.8115 3.2382 6.51144 3.26906 6.24586 3.37791C5.69344 3.60429 5.24816 4.10063 5.08057 4.67681C5 4.95382 5 5.26992 5 5.90215"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  quote: {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={20}
        height={20}
        fill={"none"}
      >
        <path
          d="M10 8C10 9.88562 10 10.8284 9.41421 11.4142C8.82843 12 7.88562 12 6 12C4.11438 12 3.17157 12 2.58579 11.4142C2 10.8284 2 9.88562 2 8C2 6.11438 2 5.17157 2.58579 4.58579C3.17157 4 4.11438 4 6 4C7.88562 4 8.82843 4 9.41421 4.58579C10 5.17157 10 6.11438 10 8Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M10 7L10 11.4821C10 15.4547 7.48429 18.8237 4 20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M22 8C22 9.88562 22 10.8284 21.4142 11.4142C20.8284 12 19.8856 12 18 12C16.1144 12 15.1716 12 14.5858 11.4142C14 10.8284 14 9.88562 14 8C14 6.11438 14 5.17157 14.5858 4.58579C15.1716 4 16.1144 4 18 4C19.8856 4 20.8284 4 21.4142 4.58579C22 5.17157 22 6.11438 22 8Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M22 7L22 11.4821C22 15.4547 19.4843 18.8237 16 20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
};

function BlockFormatDropDown({
  editor,
  blockType,
  // rootType,
  disabled = false,
}: {
  blockType: keyof typeof blockTypeToBlockName;
  rootType: keyof rootTypeToRootName;
  editor: LexicalEditor;
  disabled?: boolean;
}): JSX.Element {
  return (
    <DropDown
      disabled={disabled}
      buttonClassName="bg-gray-100 hover:bg-gray-200 hover:text-gray-600 text-sm"
      buttonIcon={iconBlockFormat[blockType].icon}
      buttonLabel={blockTypeToBlockName[blockType]}
      buttonAriaLabel="Formatting options for text style"
    >
      <DropDownItem
        className={dropDownActiveClass(blockType === "paragraph")}
        onClick={() => formatParagraph(editor)}
      >
        {iconBlockFormat.paragraph.icon}
        <span className="text">Normal</span>
      </DropDownItem>
      <DropDownItem
        className={dropDownActiveClass(blockType === "h1")}
        onClick={() => formatHeading(editor, blockType, "h1")}
      >
        {iconBlockFormat.h1.icon}
        <span>Heading 1</span>
      </DropDownItem>
      <DropDownItem
        className={dropDownActiveClass(blockType === "h2")}
        onClick={() => formatHeading(editor, blockType, "h2")}
      >
        {iconBlockFormat.h2.icon}
        <span>Heading 2</span>
      </DropDownItem>
      <DropDownItem
        className={dropDownActiveClass(blockType === "h3")}
        onClick={() => formatHeading(editor, blockType, "h3")}
      >
        {iconBlockFormat.h3.icon}
        <span className="text">Heading 3</span>
      </DropDownItem>
      <DropDownItem
        className={dropDownActiveClass(blockType === "bullet")}
        onClick={() => formatBulletList(editor, blockType)}
      >
        {iconBlockFormat.bullet.icon}
        <span className="text">Bullet List</span>
      </DropDownItem>
      <DropDownItem
        className={dropDownActiveClass(blockType === "number")}
        onClick={() => formatNumberedList(editor, blockType)}
      >
        {iconBlockFormat.number.icon}
        <span className="text">Numbered List</span>
      </DropDownItem>
      <DropDownItem
        className={dropDownActiveClass(blockType === "check")}
        onClick={() => formatCheckList(editor, blockType)}
      >
        {iconBlockFormat.check.icon}
        <span className="text">Check List</span>
      </DropDownItem>
      <DropDownItem
        className={dropDownActiveClass(blockType === "quote")}
        onClick={() => formatQuote(editor, blockType)}
      >
        {iconBlockFormat.quote.icon}
        <span>Quote</span>
      </DropDownItem>
      <DropDownItem
        className={dropDownActiveClass(blockType === "code")}
        onClick={() => formatCode(editor, blockType)}
      >
        {iconBlockFormat.code.icon}
        <span className="text">Code Block</span>
      </DropDownItem>
    </DropDown>
  );
}

export default function ToolbarPlugin({
  editor,
  activeEditor,
  setActiveEditor,
  // setIsLinkEditMode,
}: {
  editor: LexicalEditor;
  activeEditor: LexicalEditor;
  setActiveEditor: Dispatch<LexicalEditor>;
  // setIsLinkEditMode: Dispatch<boolean>;
}) {
  const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(
    null,
  );
  // const [modal, showModal] = useModal();
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());
  const { toolbarState, updateToolbarState } = useToolbarState();

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      if (activeEditor !== editor && $isEditorIsNestedEditor(activeEditor)) {
        const rootElement = activeEditor.getRootElement();
        updateToolbarState(
          "isImageCaption",
          !!rootElement?.parentElement?.classList.contains(
            "image-caption-container",
          ),
        );
      } else {
        updateToolbarState("isImageCaption", false);
      }

      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      updateToolbarState("isRTL", $isParentElementRTL(selection));

      // Update links
      const node = getSelectedNode(selection);
      // const parent = node.getParent();
      // const isLink = $isLinkNode(parent) || $isLinkNode(node);
      // updateToolbarState("isLink", isLink);

      const tableNode = $findMatchingParent(node, $isTableNode);
      if ($isTableNode(tableNode)) {
        updateToolbarState("rootType", "table");
      } else {
        updateToolbarState("rootType", "root");
      }

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode,
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();

          updateToolbarState("blockType", type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          if (type in blockTypeToBlockName) {
            updateToolbarState(
              "blockType",
              type as keyof typeof blockTypeToBlockName,
            );
          }
          if ($isCodeNode(element)) {
            const language =
              element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP;
            updateToolbarState(
              "codeLanguage",
              language ? CODE_LANGUAGE_MAP[language] || language : "",
            );
            return;
          }
        }
      }
      /*
      let matchingParent;
      
      if ($isLinkNode(parent)) {
        // If node is a link, we need to fetch the parent paragraph node to set format
        matchingParent = $findMatchingParent(
          node,
          (parentNode) => $isElementNode(parentNode) && !parentNode.isInline(),
        );
      }
    

      // If matchingParent is a valid node, pass it's format type
      updateToolbarState(
        "elementFormat",
        $isElementNode(matchingParent)
          ? matchingParent.getFormatType()
          : $isElementNode(node)
            ? node.getFormatType()
            : parent?.getFormatType() || "left",
      );*/
    }

    if ($isRangeSelection(selection) || $isTableSelection(selection)) {
      // Update text format
      updateToolbarState("isBold", selection.hasFormat("bold"));
      updateToolbarState("isItalic", selection.hasFormat("italic"));
      updateToolbarState("isUnderline", selection.hasFormat("underline"));
      updateToolbarState(
        "isStrikethrough",
        selection.hasFormat("strikethrough"),
      );
      updateToolbarState("isSubscript", selection.hasFormat("subscript"));
      updateToolbarState("isSuperscript", selection.hasFormat("superscript"));
      updateToolbarState("isCode", selection.hasFormat("code"));
    }
  }, [activeEditor, editor, updateToolbarState]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        setActiveEditor(newEditor);
        $updateToolbar();
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor, $updateToolbar, setActiveEditor]);

  useEffect(() => {
    activeEditor.getEditorState().read(() => {
      $updateToolbar();
    });
  }, [activeEditor, $updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          updateToolbarState("canUndo", payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          updateToolbarState("canRedo", payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
    );
  }, [$updateToolbar, activeEditor, editor, updateToolbarState]);

  /*
  const applyStyleText = useCallback(
    (styles: Record<string, string>, skipHistoryStack?: boolean) => {
      activeEditor.update(
        () => {
          const selection = $getSelection();
          if (selection !== null) {
            $patchStyleText(selection, styles);
          }
        },
        skipHistoryStack ? { tag: "historic" } : {},
      );
    },
    [activeEditor],
  );
  
  
  const onFontColorSelect = useCallback(
    (value: string, skipHistoryStack: boolean) => {
      applyStyleText({ color: value }, skipHistoryStack);
    },
    [applyStyleText],
  );

  const onBgColorSelect = useCallback(
    (value: string, skipHistoryStack: boolean) => {
      applyStyleText({ "background-color": value }, skipHistoryStack);
    },
    [applyStyleText],
  );
  */
  /*
  const insertLink = useCallback(() => {
    if (!toolbarState.isLink) {
      setIsLinkEditMode(true);
      activeEditor.dispatchCommand(
        TOGGLE_LINK_COMMAND,
        sanitizeUrl("https://"),
      );
    } else {
      setIsLinkEditMode(false);
      activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [activeEditor, setIsLinkEditMode, toolbarState.isLink]);
*/
  const onCodeLanguageSelect = useCallback(
    (value: string) => {
      activeEditor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            node.setLanguage(value);
          }
        }
      });
    },
    [activeEditor, selectedElementKey],
  );
  /*
  const insertGifOnClick = (payload: InsertImagePayload) => {
    activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
  };
  */

  // const canViewerSeeInsertDropdown = !toolbarState.isImageCaption;
  // const canViewerSeeInsertCodeButton = !toolbarState.isImageCaption;

  return (
    <div className="sticky top-16 px-3 py-2 border-b flex items-center flex-wrap gap-2">
      <Button
        disabled={!toolbarState.canUndo || !isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        isIconOnly
        size="sm"
        // className="toolbar-item spaced"
        aria-label="Undo"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
        >
          <path
            d="M11 6H15.5C17.9853 6 20 8.01472 20 10.5C20 12.9853 17.9853 15 15.5 15H4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.99998 12C6.99998 12 4.00001 14.2095 4 15C3.99999 15.7906 7 18 7 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Button>
      <Button
        isIconOnly
        size="sm"
        disabled={!toolbarState.canRedo || !isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        aria-label="Redo"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width={20}
          height={20}
          fill={"none"}
        >
          <path
            d="M13 6H8.5C6.01472 6 4 8.01472 4 10.5C4 12.9853 6.01472 15 8.5 15H20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17 12C17 12 20 14.2095 20 15C20 15.7906 17 18 17 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Button>
      <Divider />
      {toolbarState.blockType === "code" ? (
        <DropDown
          disabled={!isEditable}
          buttonClassName="toolbar-item code-language"
          buttonLabel={getLanguageFriendlyName(toolbarState.codeLanguage)}
          buttonAriaLabel="Select language"
        >
          {CODE_LANGUAGE_OPTIONS.map(([value, name]) => {
            return (
              <DropDownItem
                className={`item ${dropDownActiveClass(
                  value === toolbarState.codeLanguage,
                )}`}
                onClick={() => onCodeLanguageSelect(value)}
                key={value}
              >
                <span className="text">{name}</span>
              </DropDownItem>
            );
          })}
        </DropDown>
      ) : (
        <>
          <Button
            isIconOnly
            size="sm"
            disabled={!isEditable}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
            }}
            className={toolbarState.isBold ? "bg-gray-100 text-gray-900" : ""}
            aria-label="Format Bold"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width={20}
              height={20}
              fill={"none"}
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5 6C5 4.58579 5 3.87868 5.43934 3.43934C5.87868 3 6.58579 3 8 3H12.5789C15.0206 3 17 5.01472 17 7.5C17 9.98528 15.0206 12 12.5789 12H5V6Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.4286 12H13.6667C16.0599 12 18 14.0147 18 16.5C18 18.9853 16.0599 21 13.6667 21H8C6.58579 21 5.87868 21 5.43934 20.5607C5 20.1213 5 19.4142 5 18V12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
          <Button
            isIconOnly
            size="sm"
            disabled={!isEditable}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
            }}
            className={toolbarState.isItalic ? "bg-gray-100 text-gray-900" : ""}
            aria-label="Format Italics"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width={20}
              height={20}
              fill={"none"}
            >
              <path
                d="M12 4H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M8 20L16 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M5 20H12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </Button>
          <Button
            isIconOnly
            size="sm"
            disabled={!isEditable}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
            }}
            className={
              toolbarState.isUnderline ? "bg-gray-100 text-gray-900" : ""
            }
            aria-label="Format Underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width={20}
              height={20}
              fill={"none"}
            >
              <path
                d="M5.5 3V11.5C5.5 15.0899 8.41015 18 12 18C15.5899 18 18.5 15.0899 18.5 11.5V3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 21H21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </Button>

          <Divider />
          <DropDown
            disabled={!isEditable}
            buttonClassName="bg-gray-100"
            buttonLabel=""
            buttonAriaLabel="Formatting options for additional text styles"
            buttonIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={20}
                height={20}
                fill={"none"}
              >
                <path
                  d="M14 19L11.1069 10.7479C9.76348 6.91597 9.09177 5 8 5C6.90823 5 6.23652 6.91597 4.89309 10.7479L2 19M4.5 12H11.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21.9692 13.9392V18.4392M21.9692 13.9392C22.0164 13.1161 22.0182 12.4891 21.9194 11.9773C21.6864 10.7709 20.4258 10.0439 19.206 9.89599C18.0385 9.75447 17.1015 10.055 16.1535 11.4363M21.9692 13.9392L19.1256 13.9392C18.6887 13.9392 18.2481 13.9603 17.8272 14.0773C15.2545 14.7925 15.4431 18.4003 18.0233 18.845C18.3099 18.8944 18.6025 18.9156 18.8927 18.9026C19.5703 18.8724 20.1955 18.545 20.7321 18.1301C21.3605 17.644 21.9692 16.9655 21.9692 15.9392V13.9392Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
          >
            <DropDownItem
              onClick={() => {
                activeEditor.dispatchCommand(
                  FORMAT_TEXT_COMMAND,
                  "strikethrough",
                );
              }}
              className={dropDownActiveClass(toolbarState.isStrikethrough)}
              title="Strikethrough"
              aria-label="Format text with a strikethrough"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={20}
                height={20}
                fill={"none"}
              >
                <path
                  d="M4 12H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17.5 7.66667C17.5 5.08934 15.0376 3 12 3C8.96243 3 6.5 5.08934 6.5 7.66667C6.5 8.15279 6.55336 8.59783 6.6668 9M6 16.3333C6 18.9107 8.68629 21 12 21C15.3137 21 18 19.6667 18 16.3333C18 13.9404 16.9693 12.5782 14.9079 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text">Strikethrough</span>
            </DropDownItem>
            <DropDownItem
              onClick={() => {
                activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript");
              }}
              className={dropDownActiveClass(toolbarState.isSubscript)}
              title="Subscript"
              aria-label="Format text with a subscript"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={20}
                height={20}
                fill={"none"}
              >
                <path
                  d="M12.5 21H6.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16.5 6C16.5 5.37191 16.5 5.05787 16.4194 4.78267C16.2518 4.21026 15.8066 3.71716 15.2541 3.49226C14.9886 3.38413 14.6885 3.35347 14.0884 3.29216C12.6695 3.14718 10.8874 3 9.5 3C8.11262 3 6.33047 3.14718 4.91161 3.29216C4.3115 3.35347 4.01144 3.38413 3.74586 3.49226C3.19344 3.71716 2.74816 4.21026 2.58057 4.78267C2.5 5.05787 2.5 5.37191 2.5 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M9.5 3.34863L9.5 20.8486"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M21.5 21H19.5C19.0286 21 18.7929 21 18.6464 20.8566C18.5 20.7133 18.5 20.4825 18.5 20.021V19.0766C18.5 18.2812 18.676 18.1253 19.5004 18.1094C20.2769 18.0944 20.7401 18.0388 21.0607 17.8333C21.5 17.5516 21.5 17.0983 21.5 16.1916C21.5 14.4594 18.5 15.1262 18.5 15.1262"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span className="text">Subscript</span>
            </DropDownItem>
            <DropDownItem
              onClick={() => {
                activeEditor.dispatchCommand(
                  FORMAT_TEXT_COMMAND,
                  "superscript",
                );
              }}
              className={dropDownActiveClass(toolbarState.isSuperscript)}
              title="Superscript,"
              aria-label="Format text with a superscript"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={20}
                height={20}
                fill={"none"}
              >
                <path
                  d="M12.5 21H6.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16.5 6C16.5 5.37191 16.5 5.05787 16.4194 4.78267C16.2518 4.21026 15.8066 3.71716 15.2541 3.49226C14.9886 3.38413 14.6885 3.35347 14.0884 3.29216C12.6695 3.14718 10.8874 3 9.5 3C8.11262 3 6.33047 3.14718 4.91161 3.29216C4.3115 3.35347 4.01144 3.38413 3.74586 3.49226C3.19344 3.71716 2.74816 4.21026 2.58057 4.78267C2.5 5.05787 2.5 5.37191 2.5 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M9.5 3.34863L9.5 20.8486"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M22 12H20C19.5286 12 19.2929 12 19.1464 11.8566C19 11.7133 19 11.4825 19 11.021V10.0766C19 9.28117 19.176 9.12533 20.0004 9.10939C20.7769 9.09438 21.2401 9.03883 21.5607 8.83328C22 8.55161 22 8.09827 22 7.19159C22 5.45943 19 6.12617 19 6.12617"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text">Superscript</span>
            </DropDownItem>
            <DropDownItem
              onClick={() => clearFormatting(activeEditor)}
              className="item wide"
              title="Clear text formatting"
              aria-label="Clear all text formatting"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={20}
                height={20}
                fill={"none"}
              >
                <path
                  d="M11 20.001H5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 4L8 20.0008M12 4C13.3874 4 15.1695 4.03054 16.5884 4.17648C17.1885 4.23819 17.4886 4.26905 17.7541 4.37789C18.3066 4.60428 18.7518 5.10062 18.9194 5.6768C19 5.95381 19 6.26991 19 6.90214M12 4C10.6126 4 8.83047 4.03054 7.41161 4.17648C6.8115 4.23819 6.51144 4.26905 6.24586 4.37789C5.69344 4.60428 5.24816 5.10062 5.08057 5.6768C5 5.95381 5 6.26991 5 6.90214"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M14 15L19 20M14 20L19 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Clear Formatting</span>
            </DropDownItem>
          </DropDown>
        </>
      )}
      {toolbarState.blockType in blockTypeToBlockName &&
        activeEditor === editor && (
          <>
            <BlockFormatDropDown
              disabled={!isEditable}
              blockType={toolbarState.blockType}
              rootType={toolbarState.rootType}
              editor={activeEditor}
            />
            <Divider />
          </>
        )}
    </div>
  );
}
