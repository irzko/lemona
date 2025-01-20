/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createTableNodeWithDimensions,
  INSERT_TABLE_COMMAND,
  TableNode,
} from "@lexical/table";
import {
  $insertNodes,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  EditorThemeClasses,
  Klass,
  LexicalCommand,
  LexicalEditor,
  LexicalNode,
} from "lexical";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as React from "react";
import invariant from "../shared/invariant";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

export type InsertTableCommandPayload = Readonly<{
  columns: string;
  rows: string;
  includeHeaders?: boolean;
}>;

export type CellContextShape = {
  cellEditorConfig: null | CellEditorConfig;
  cellEditorPlugins: null | React.JSX.Element | Array<React.JSX.Element>;
  set: (
    cellEditorConfig: null | CellEditorConfig,
    cellEditorPlugins: null | React.JSX.Element | Array<React.JSX.Element>
  ) => void;
};

export type CellEditorConfig = Readonly<{
  namespace: string;
  nodes?: ReadonlyArray<Klass<LexicalNode>>;
  onError: (error: Error, editor: LexicalEditor) => void;
  readOnly?: boolean;
  theme?: EditorThemeClasses;
}>;

export const INSERT_NEW_TABLE_COMMAND: LexicalCommand<InsertTableCommandPayload> =
  createCommand("INSERT_NEW_TABLE_COMMAND");

export const CellContext = createContext<CellContextShape>({
  cellEditorConfig: null,
  cellEditorPlugins: null,
  set: () => {
    // Empty
  },
});

export function TableContext({ children }: { children: React.JSX.Element }) {
  const [contextValue, setContextValue] = useState<{
    cellEditorConfig: null | CellEditorConfig;
    cellEditorPlugins: null | React.JSX.Element | Array<React.JSX.Element>;
  }>({
    cellEditorConfig: null,
    cellEditorPlugins: null,
  });
  return (
    <CellContext.Provider
      value={useMemo(
        () => ({
          cellEditorConfig: contextValue.cellEditorConfig,
          cellEditorPlugins: contextValue.cellEditorPlugins,
          set: (cellEditorConfig, cellEditorPlugins) => {
            setContextValue({ cellEditorConfig, cellEditorPlugins });
          },
        }),
        [contextValue.cellEditorConfig, contextValue.cellEditorPlugins]
      )}
    >
      {children}
    </CellContext.Provider>
  );
}

export function InsertTableDialog({
  activeEditor,
}: {
  activeEditor: LexicalEditor;
}): React.JSX.Element {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [rows, setRows] = useState("5");
  const [columns, setColumns] = useState("5");
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    const row = Number(rows);
    const column = Number(columns);
    if (row && row > 0 && row <= 500 && column && column > 0 && column <= 50) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [rows, columns]);

  const onClick = () => {
    activeEditor.dispatchCommand(INSERT_TABLE_COMMAND, {
      columns,
      rows,
    });

    onClose();
  };

  return (
    <>
      <Button onPress={onOpen} isIconOnly variant="light" size="sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width={20}
          height={20}
          fill={"none"}
        >
          <path
            d="M3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M2.5 9L21.5 9" stroke="currentColor" strokeWidth="2" />
          <path d="M2.5 13L21.5 13" stroke="currentColor" strokeWidth="2" />
          <path d="M2.5 17L21.5 17" stroke="currentColor" strokeWidth="2" />
          <path
            d="M12 21.5L12 9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Chèn bảng
              </ModalHeader>
              <ModalBody>
                <Input
                  placeholder={"# of rows (1-500)"}
                  label="Rows"
                  onChange={(e) => setRows(e.target.value)}
                  value={rows}
                  data-test-id="table-modal-rows"
                  type="number"
                />
                <Input
                  placeholder={"# of columns (1-50)"}
                  label="Columns"
                  onChange={(e) => setColumns(e.target.value)}
                  value={columns}
                  data-test-id="table-modal-columns"
                  type="number"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  isDisabled={isDisabled}
                  onPress={onClick}
                >
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export function TablePlugin({
  cellEditorConfig,
  children,
}: {
  cellEditorConfig: CellEditorConfig;
  children: React.JSX.Element | Array<React.JSX.Element>;
}): React.JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const cellContext = useContext(CellContext);

  useEffect(() => {
    if (!editor.hasNodes([TableNode])) {
      invariant(false, "TablePlugin: TableNode is not registered on editor");
    }

    cellContext.set(cellEditorConfig, children);

    return editor.registerCommand<InsertTableCommandPayload>(
      INSERT_NEW_TABLE_COMMAND,
      ({ columns, rows, includeHeaders }) => {
        const tableNode = $createTableNodeWithDimensions(
          Number(rows),
          Number(columns),
          includeHeaders
        );
        $insertNodes([tableNode]);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [cellContext, cellEditorConfig, children, editor]);

  return null;
}
