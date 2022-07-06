// Copyright 2019-2021 @polkadot/extension-ui authors & contributors
// Copyright 2021 @cennznet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { getConnection } from '@cennznet/extension-base/api/connections';
import { Connection } from '@cennznet/extension-base/api/types';
import { Keyring } from '@polkadot/ui-keyring';
import { genesisHashes } from './constants';

export * from './balances';

export function isChainSupported (genesisHash?: string | null, includeAnyChain: boolean = true): boolean {
  return (!genesisHash && includeAnyChain) || Object.values(genesisHashes).includes(genesisHash as string);
}

export function transfer(genesisHash: string, fromAddress: string, toAddress: string, assetType: string, amount: string, password: string, keyring: Keyring): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    const onConnect = async (connection: Connection) => {
      const { api, assets } = connection as Connection;
      const assetId = assets ? (assetType === 'cennz' ? assets.cennz.id : assets.cpay.id) : 0;
      const pair = keyring.getPair(fromAddress);

      try {
        pair.unlock(password);

        if (api && assets) {
          const tx = await api.tx.genericAsset.transfer(assetId, toAddress, amount);

          const txid = (await tx.signAndSend(pair)).toString();

          resolve(txid);
        }
      } catch (e) {
        reject(e);
      }
    };
    const connection = getConnection(genesisHash, onConnect);

    if (!connection?.isConnecting) {
      await onConnect(connection as Connection);
    }
  });
}
