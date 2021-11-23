// Copyright 2019-2021 @polkadot/extension-chains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { MetadataDef } from '@cennznet/extension-inject/types';
import type { ExtDef } from '@polkadot/types/extrinsic/signedExtensions/types';
import type { Registry } from '@polkadot/types/types';

export interface Chain {
  definition: MetadataDef;
  genesisHash?: string;
  hasMetadata: boolean;
  icon: string;
  isUnknown?: boolean;
  name: string;
  registry: Registry;
  specVersion: number;
  ss58Format: number;
  tokenDecimals: number;
  tokenSymbol: string;
}

export interface MetadataFetched {
  metaCalls: string,
  specVersion: number
}

export interface RuntimeTypes {
  types: Record<string, Record<string, string> | string>,
  userExtensions?: ExtDef
}
