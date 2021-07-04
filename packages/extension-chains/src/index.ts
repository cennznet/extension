// Copyright 2019-2021 @polkadot/extension-chains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { MetadataDef } from '@polkadot/extension-inject/types';
import type { Chain } from './types';

import { Metadata } from '@polkadot/metadata';
import { TypeRegistry } from '@polkadot/types';
import { base64Decode } from '@polkadot/util-crypto';
import config from './config';
// imports chain details, generally metadata. For the generation of these,
// inside the api, run `yarn chain:info --ws <url>`

const CENNZNetChain: MetadataDef[] = config.CENNZNetChain;
// Initialise the metadata definition with CENNZNet chains
const definitions = new Map<string, MetadataDef>(
  CENNZNetChain.map((def) => [def.genesisHash, def])
);

export function getLatestMetaFromServer(genesisHashExpected: string) {
  const xmlHttp = new XMLHttpRequest();
//xmlHttp.open( "GET", "https://raw.githubusercontent.com/cennznet/api.js/master/packages/api/src/staticMetadata.ts", false ); // false for synchronous request
  xmlHttp.open("GET", "https://raw.githubusercontent.com/cennznet/api.js/test1/packages/api/src/staticMetadata.ts", false);
  xmlHttp.send( null );
  let response = xmlHttp.responseText;
// Replace all the unwanted stuff and make response a json object
  response = response.replace('export default ','');
  response = response.replace(',\n\};','}');
  const searchRegExp = /\'/g;
  const replaceWith = '"';
  response = response.replace(searchRegExp, replaceWith);
  const staticMetadata = JSON.parse(response);
  const key = Object.keys(staticMetadata).filter(v => v.includes(genesisHashExpected));
  if (!key[0]) {
    return null;
  }
  const [, specVersion] = key[0].split('-');
  const metaInHex = staticMetadata[key[0]];
  const registry = new TypeRegistry();
  const metaFetched = new Metadata(registry, metaInHex);
  const metaCalls = Buffer.from(metaFetched.asCallsOnly.toU8a()).toString('base64');
  return {metaCalls, specVersion: parseInt(specVersion)};
}


export function getLatestTypesFromServer() {
  try {
    const xmlHttp = new XMLHttpRequest();
//xmlHttp.open( "GET", "https://raw.githubusercontent.com/cennznet/api.js/master/packages/types/src/runtimeModuleTypes.ts", false ); // false for synchronous request
    xmlHttp.open("GET", "https://raw.githubusercontent.com/cennznet/api.js/test1/packages/types/src/runtimeModuleTypes.ts", false);
    xmlHttp.send(null);
    let response = xmlHttp.responseText;
// Replace all the unwanted stuff and make response a json object
    response = response.replace('export default ', '');
    const typesAdded = JSON.parse(response);
    return typesAdded;
  } catch (e) {
    return {};
  }
}

const expanded = new Map<string, Chain>();

export function metadataExpand (definition: MetadataDef, isPartial = false): Chain {
  const cached = expanded.get(definition.genesisHash);

  if (cached && cached.specVersion === definition.specVersion) {
    return cached;
  }

  const { chain, genesisHash, icon, metaCalls, specVersion, ss58Format, tokenDecimals, tokenSymbol, types, userExtensions } = definition;
  const registry = new TypeRegistry();

  if (!isPartial) {
    registry.register(types);
  }

  registry.setChainProperties(registry.createType('ChainProperties', {
    ss58Format,
    tokenDecimals,
    tokenSymbol
  }));

  const isUnknown = genesisHash === '0x';
  let hasMetadata = false;

  if (metaCalls && !isPartial) {
    hasMetadata = true;

    const metadata = new Metadata(registry, base64Decode(metaCalls));
    const signedExtensions = metadata.asLatest.extrinsic.signedExtensions.toJSON() as string[];

    registry.setMetadata(metadata, signedExtensions, userExtensions);
  }

  const result = {
    definition,
    genesisHash: isUnknown
      ? undefined
      : genesisHash,
    hasMetadata,
    icon: icon || 'substrate',
    isUnknown,
    name: chain,
    registry,
    specVersion,
    ss58Format,
    tokenDecimals,
    tokenSymbol
  };

  if (result.genesisHash && !isPartial) {
    expanded.set(result.genesisHash, result);
  }

  return result;
}

export function findChain (definitions: MetadataDef[], genesisHash?: string | null): Chain | null {
  const def = definitions.find((def) => def.genesisHash === genesisHash);

  return def
    ? metadataExpand(def)
    : null;
}

export function addMetadata (def: MetadataDef): void {
  definitions.set(def.genesisHash, def);
}

export function knownMetadata (): MetadataDef[] {
  return [...definitions.values()];
}
