// Copyright 2019-2021 @polkadot/extension-ui authors & contributors
// Copyright 2021 @cennznet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Api } from '@cennznet/api';

import { defaultAsset, endpoints } from './constants';
import { Assets, Connection, Connections } from './types';

const connections: Connections = {};

export function getConnection (genesisHash: string, onConnect?: (connection: Connection) => void): Connection | null {
  if (connections.hasOwnProperty(genesisHash)) {
    return connections[genesisHash];
  }

  if (endpoints.hasOwnProperty(genesisHash)) {
    connections[genesisHash] = {
      isConnecting: true,
    }

    Api.create({ provider: endpoints[genesisHash] }).then(async (api: Api) => {
      const cennzId = parseInt((await api.query.genericAsset.stakingAssetId()).toString());
      const cpayId = parseInt((await api.query.genericAsset.spendingAssetId()).toString());
      const assets: Assets = { cennz: defaultAsset, cpay: defaultAsset };

      try {
        const registeredAssets = (await api.rpc.genericAsset.registeredAssets()).toJSON();
        registeredAssets.forEach((asset: [number, { symbol: string, decimalPlaces: number }]) => {
          if (asset[0] === cennzId) {
            assets.cennz = {
              id: cennzId,
              decimals: asset[1].decimalPlaces,
            };
          } else if (asset[0] === cpayId) {
            assets.cpay = {
              id: cpayId,
              decimals: asset[1].decimalPlaces,
            };
          }
        });
      } catch (e) {
        assets.cennz = {
          id: cennzId,
          decimals: 4,
        };
        assets.cpay = {
          id: cpayId,
          decimals: 4,
        };
      }

      connections[genesisHash].api = api;
      connections[genesisHash].assets = assets;
      connections[genesisHash].isConnecting = false;

      onConnect && onConnect(connections[genesisHash]);
    });

    return connections[genesisHash];
  }

  return null;
}

