"use client";
import dynamic from "next/dynamic";
import { forwardRef } from "react";
import { type MDXEditorMethods, type MDXEditorProps } from "@mdxeditor/editor";

const MDXEditor = dynamic(() => import("./InitializedMDXEditor"), {
  ssr: false,
});

const Editor = forwardRef<MDXEditorMethods, MDXEditorProps>((props, ref) => (
  <MDXEditor {...props} editorRef={ref} />
));

Editor.displayName = "Editor";
export default Editor;
