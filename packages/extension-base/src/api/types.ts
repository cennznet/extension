// Copyright 2019-2021 @polkadot/extension-ui authors & contributors
// Copyright 2021 @cennznet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Api } from '@cennznet/api';

export type GenesisHashes = {
  [chain: string]: string,
};

export type Endpoints = {
  [genesisHash: string]: string
};

export interface Connection {
  api?: Api,
  assets?: Assets,
  isConnecting: boolean,
}

export type Connections = {
  [genesisHash: string]: Connection
};

export interface Asset {
  id: number,
  decimals: number,
}

export interface Assets {
  cennz: Asset,
  cpay: Asset,
}
