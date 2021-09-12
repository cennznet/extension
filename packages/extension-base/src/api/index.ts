// Copyright 2019-2021 @polkadot/extension-ui authors & contributors
// Copyright 2021 @cennznet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { genesisHashes } from './constants';

export function isChainSupported (genesisHash?: string | null, includeAnyChain: boolean = true): boolean {
  return (!genesisHash && includeAnyChain) || Object.values(genesisHashes).includes(genesisHash as string);
}

export * from './balances';
