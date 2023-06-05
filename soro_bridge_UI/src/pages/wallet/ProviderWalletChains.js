import * as SorobanClient from "soroban-client";
import { isNotNullish } from './utils/IsNotNullish';
import { WalletChain } from '@soroban-react/types';

const chainMetadataByName = {
    public: {
        id: "public",
        name: "Public",
        networkPassphrase: SorobanClient.Networks.PUBLIC,
        iconBackground: '#e84141',
    },
    testnet: {
        id: "testnet",
        name: "Testnet",
        networkPassphrase: SorobanClient.Networks.TESTNET,
        iconBackground: '#484c50',
    },
    futurenet: {
        id: "futurenet",
        name: "Futurenet",
        networkPassphrase: SorobanClient.Networks.FUTURENET,
        iconBackground: '#96bedc',
    },
    sandbox: {
        id: "sandbox",
        name: "Sandbox",
        networkPassphrase: SorobanClient.Networks.SANDBOX,
        iconBackground: '#dac695',
    },
    standalone: {
        id: "standalone",
        name: "Standalone",
        networkPassphrase: "Standalone Network ; February 2017",
        iconBackground: '#dac695',
    },
};

const chainMetadataById = Object.fromEntries(
    Object.values(chainMetadataByName)
        .filter(isNotNullish)
        .map(({ id, ...metadata }) => [id, metadata])
);

export const chain = chainMetadataByName;

export function provideWalletChains(
    chains
) {
    return chains.map(chain => ({
        ...(chainMetadataById[chain.id] ?? {}),
        ...chain,
    }));
}