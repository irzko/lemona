/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from "react";
import { ReactNode } from "react";

type Props = Readonly<{
  "data-test-id"?: string;
  children: ReactNode;
}>;

export function DialogButtonsList({ children }: Props): React.JSX.Element {
  return <div className="flex flex-col justify-end mt-5">{children}</div>;
}

export function DialogActions({
  "data-test-id": dataTestId,
  children,
}: Props): React.JSX.Element {
  return (
    <div className="flex flex-row justify-end mt-5" data-test-id={dataTestId}>
      {children}
    </div>
  );
}
