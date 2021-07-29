// Copyright 2019-2021 @polkadot/extension-inject authors & contributors
// SPDX-License-Identifier: Apache-2.0

const extension = typeof chrome !== 'undefined'
  ? chrome
  : typeof browser !== 'undefined'
    ? browser
    : null;

export default extension as typeof chrome;

export function getBrowser() {
  if (typeof chrome !== "undefined") {
    if (typeof browser !== "undefined") {
      return "Firefox";
    } else {
      return "Chrome";
    }
  } else {
    return "Edge";
  }
}
