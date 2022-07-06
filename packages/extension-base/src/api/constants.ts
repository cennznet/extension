// Copyright 2019-2021 @polkadot/extension-ui authors & contributors
// Copyright 2021 @cennznet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Asset, Endpoints, GenesisHashes } from './types';
import { Balances } from '../types';

export const genesisHashes: GenesisHashes = {
  AZALEA: '0x0d0971c150a9741b8719b3c6c9c2e96ec5b2e3fb83641af868e6650f3e263ef0',
  NIKAU: '0xc65170707265757d8a1fb8e039062286b8f0092f2984f5938588bd8e0f21ca2e',
  RATA: '0x6f2ca0f5c770a9212d30b49604b2e45e2d3c949a3a940bfe908d68dbc4a0415e',
  DEVELOPMENT: '0xba29ccef64182e17dee0f9d8bbaddc69e439acdc9409149e5c409d696c14232e',
};

export const endpoints: Endpoints = {
  [genesisHashes.AZALEA]: 'wss://cennznet.unfrastructure.io/public/ws',
  [genesisHashes.NIKAU]: 'wss://nikau.centrality.me/public/ws',
  [genesisHashes.RATA]: 'wss://kong2.centrality.me/public/rata/ws',
  [genesisHashes.DEVELOPMENT]: 'ws://localhost:9944',
};

export const defaultBalances: Balances = {
  cennz: 0,
  cpay: 0,
};

export const defaultAsset: Asset = {
  id: 0,
  decimals: 0,
};

export const DEFAULT_DECIMALS = 4;

export const DEFAULT_GENESIS_HASH = genesisHashes.AZALEA;
