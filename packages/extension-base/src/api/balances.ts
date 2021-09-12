// Copyright 2019-2021 @polkadot/extension-ui authors & contributors
// Copyright 2021 @cennznet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { formatUnits, isNull } from '@cennznet/util';

import { DEFAULT_DECIMALS, defaultBalances } from './constants';
import { getConnection } from './connections';
import { Balances } from '../types';
import { Connection } from './types';

const cache = new Map<string, Balances>();

export function addBalances (addressAndHash: string, balances: Balances) {
  cache.set(addressAndHash, balances);
}

export function getStoredBalances (address: string, genesisHash: string): Balances {
  const key = `${address}_${genesisHash}`;

  if (cache.has(key)) {
    return cache.get(key) as Balances;
  }

  return defaultBalances;
}

export function getBalances (address: string, genesisHash: string): Promise<Balances | null> {
  return new Promise<Balances | null>(async (resolve, reject) => {
    const onConnect = async (connection: Connection) => {
      const { api, assets } = connection as Connection;
      const cennzWei = (api && assets) ? (await api.query.genericAsset.freeBalance(assets.cennz.id, address)).toString() : '0';
      const cpayWei = (api && assets) ? (await api.query.genericAsset.freeBalance(assets.cpay.id, address)).toString() : '0';
      const balances = {
        cennz: parseFloat(formatUnits(cennzWei, assets ? assets.cennz.decimals : DEFAULT_DECIMALS)),
        cpay: parseFloat(formatUnits(cpayWei, assets ? assets.cpay.decimals : DEFAULT_DECIMALS)),
      };

      addBalances(`${address}_${genesisHash}`, balances);

      resolve(balances);
    };

    const connection = getConnection(genesisHash, onConnect);
    if (isNull(connection)) {
      resolve(null);
    }

    if (!connection?.isConnecting) {
      await onConnect(connection as Connection);
    }
  });
}
