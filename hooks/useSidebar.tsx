/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useMemo, useState } from "react";
import * as React from "react";

import Sidebar from "@/components/ui/sidebar";

export default function useSidebar(): [
  React.JSX.Element | null,
  (
    title: string,
    showSidebar: (onClose: () => void) => React.JSX.Element,
    closeOnClickOutside: boolean
  ) => void,
] {
  const [sidebarContent, setSidebarContent] = useState<null | {
    closeOnClickOutside: boolean;
    content: React.JSX.Element;
    title: string;
  }>(null);

  const onClose = useCallback(() => {
    setSidebarContent(null);
  }, []);

  const sidebar = useMemo(() => {
    if (sidebarContent === null) {
      return null;
    }
    const { title, content, closeOnClickOutside } = sidebarContent;
    return (
      <Sidebar
        onClose={onClose}
        title={title}
        closeOnClickOutside={closeOnClickOutside}
      >
        {content}
      </Sidebar>
    );
  }, [sidebarContent, onClose]);

  const showSidebar = useCallback(
    (
      title: string,
      // eslint-disable-next-line no-shadow
      getContent: (onClose: () => void) => React.JSX.Element,
      closeOnClickOutside = false
    ) => {
      setSidebarContent({
        closeOnClickOutside,
        content: getContent(onClose),
        title,
      });
    },
    [onClose]
  );

  return [sidebar, showSidebar];
}
