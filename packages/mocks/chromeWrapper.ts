// Copyright 2019-2025 @polkadot/extension-mocks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import sinonChrome from 'sinon-chrome';

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace ChromeWrapper {
  export interface IAction {
    /* eslint-disable @typescript-eslint/ban-types */
    setBadgeText: (content: object) => Promise<void>;
  }
  export const action: IAction = {
    setBadgeText: (_: object) => {
      return new Promise<void>((resolve, reject) => {
        resolve();
      });
    }
  };
}
const extendedSinonChrome = {
  ...sinonChrome,
  action: ChromeWrapper.action
};

export default extendedSinonChrome;
