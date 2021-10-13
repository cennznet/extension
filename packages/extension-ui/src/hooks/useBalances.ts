// Copyright 2019-2021 @polkadot/extension-ui authors & contributors
// Copyright 2021 @cennznet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Balances } from '@cennznet/extension-base/types';

import { useEffect, useState } from 'react';
import { isNull } from '@cennznet/util';
import { DEFAULT_GENESIS_HASH, defaultBalances } from '@cennznet/extension-base/api/constants';

import { getBalances, getStoredBalances, saveBalances } from '../messaging';

export default function useBalances(address?: string | null, genesisHash?: string | null): Balances | null {
  const _genesisHash = genesisHash || DEFAULT_GENESIS_HASH;
  const [balances, setBalances] = useState<Balances>(defaultBalances);

  useEffect((): void => {
    if (!address) {
      return;
    }

    getStoredBalances(address, _genesisHash).then(setBalances);

    getBalances(address, _genesisHash).then(async value => {
      if (!isNull(value)) {
        setBalances(value);

        await saveBalances(address, _genesisHash, value);
      }
    })
  }, [address, _genesisHash])

  return balances;
}
