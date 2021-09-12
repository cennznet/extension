// Copyright 2019-2021 @polkadot/extension-ui authors & contributors
// Copyright 2021 @cennznet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Balances } from '../types';
import BaseStore from './Base';

export default class BalancesStore extends BaseStore<Balances> {
  constructor () {
    super('balances');
  }

  public all (cb: (key: string, value: Balances) => void): void {
    super.all(cb);
  }

  public get (key: string, update: (value: Balances) => void): void {
    super.get(key, update);
  }

  public remove (key: string, update?: () => void): void {
    super.remove(key, update);
  }

  public set (key: string, value: Balances, update?: () => void): void {
    super.set(key, value, update);
  }
}
