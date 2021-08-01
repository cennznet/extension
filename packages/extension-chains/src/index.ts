// Copyright 2019-2021 @polkadot/extension-chains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { MetadataDef } from '@cennznet/extension-inject/types';
import type { Chain, MetadataFetched, RuntimeTypes } from './types';

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

/** when metadata definition stored in extension is outdated
 * get the definition for @cennznet/api/extension-releases
 * for cennznet specific chains **/
export function getLatestMetaFromServer(genesisHashExpected: string): MetadataFetched | null {
  try {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "https://raw.githubusercontent.com/cennznet/api.js/master/extension-releases/metaCalls.json", false);
    xmlHttp.send(null);
    let response = xmlHttp.responseText;
    const metadataDetails = JSON.parse(response);
    const metaCallsList = metadataDetails?.metaCalls;
    if (metaCallsList) {
      // metaCalls is { genesisHash-specVersion: metaCalls }
      const key = Object.keys(metaCallsList).filter(v => v.includes(genesisHashExpected));
      if (!key[0]) {
        return null;
      }
      const [, specVersion] = key[0].split('-');
      const metaCalls = metaCallsList[key[0]];
      return {metaCalls, specVersion: parseInt(specVersion)};
    }
    return null;
  } catch (e) {
    console.log('Err:',e);
    return null;
  }
}

/** when types stored in extension is outdated
 * get the types for @cennznet/api/extension-releases
 * for cennznet specific chains **/
export function getLatestTypesFromServer(genesisHashExpected: string): RuntimeTypes | null {
  try {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "https://raw.githubusercontent.com/cennznet/api.js/master/extension-releases/runtimeModuleTypes.json", false);
    xmlHttp.send(null);
    let response = xmlHttp.responseText;
    const additionalTypes = JSON.parse(response);
    const typesForCurrentChain = additionalTypes[genesisHashExpected];
    if (typesForCurrentChain) {
      const types = typesForCurrentChain.types;
      const userExtensions = typesForCurrentChain.userExtensions;
      return {types, userExtensions};
    }
    return null;
  } catch (e) {
    console.log('Err:',e);
    return null;
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
