import { Api } from '@cennznet/api';
import { formatUnits } from '@cennznet/util';

type GenesisHashes = {
  [chain: string]: string,
};

type Endpoints = {
  [genesisHash: string]: string
};

interface Connection {
  api: Api,
  assets: Assets,
}

type Connections = {
  [genesisHash: string]: Connection
};

interface Asset {
  id: number,
  decimals: number,
}

interface Assets {
  cennz: Asset,
  cpay: Asset,
}

interface Balances {
  cennz: number,
  cpay: number,
}

const genesisHashes: GenesisHashes = {
  AZALEA: '0x0d0971c150a9741b8719b3c6c9c2e96ec5b2e3fb83641af868e6650f3e263ef0',
  NIKAU: '0xc65170707265757d8a1fb8e039062286b8f0092f2984f5938588bd8e0f21ca2e',
  RATA: '0x6f2ca0f5c770a9212d30b49604b2e45e2d3c949a3a940bfe908d68dbc4a0415e',
  DEVELOPMENT: '0xba29ccef64182e17dee0f9d8bbaddc69e439acdc9409149e5c409d696c14232e',
};

const endpoints: Endpoints = {
  [genesisHashes.AZALEA]: 'wss://cennznet.unfrastructure.io/public/ws',
  [genesisHashes.NIKAU]: 'wss://nikau.centrality.me/public/ws',
  [genesisHashes.RATA]: 'wss://kong2.centrality.me/public/rata/ws',
  [genesisHashes.DEVELOPMENT]: 'ws://localhost:9944',
};

const defaultBalances: Balances = {
  cennz: 0,
  cpay: 0,
};

const defaultAsset: Asset = {
  id: 0,
  decimals: 0,
};

const connections: Connections = {};

async function getConnection (genesisHash: string): Promise<Connection | null> {
  if (!genesisHash) {
    genesisHash = genesisHashes.AZALEA;
  }

  if (connections.hasOwnProperty(genesisHash)) {
    return connections[genesisHash];
  }

  if (endpoints.hasOwnProperty(genesisHash)) {
    const api = await Api.create({ provider: endpoints[genesisHash] });
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

    return connections[genesisHash] = {
      api,
      assets,
    };
  }

  return null;
}

export function isChainSupported (genesisHash?: string | null): boolean {
  return !genesisHash || Object.values(genesisHashes).includes(genesisHash);
}

export async function getBalances (address: string, genesisHash?: string | null): Promise<Balances> {
  const connection = await getConnection(genesisHash as string);
  if (!connection) {
    return defaultBalances;
  }

  const { api, assets } = connection;
  const cennzWei = (await api.query.genericAsset.freeBalance(assets.cennz.id, address)).toString();
  const cpayWei = (await api.query.genericAsset.freeBalance(assets.cpay.id, address)).toString();

  return {
    cennz: parseFloat(formatUnits(cennzWei, assets.cennz.decimals)),
    cpay: parseFloat(formatUnits(cpayWei, assets.cpay.decimals)),
  };
}
