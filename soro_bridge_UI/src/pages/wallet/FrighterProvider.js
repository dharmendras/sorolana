import React from 'react';
import { useState, useEffect } from 'react';
import { SorobanReactProvider, getDefaultConnectors } from '@soroban-react/core';
import { ChainMetadata } from "@soroban-react/types";

import { chain } from './ProvideWalletChains';

const chains = [chain.sandbox, chain.standalone, chain.futurenet];
const { connectors } = getDefaultConnectors({
    appName: "Example Stellar App",
    chains
});

export default function FreighterProvider({ children }) {
    return (
        <SorobanReactProvider
            chains={chains}
            appName={"Example Stellar App"}
            autoconnect={false}
            connectors={connectors}
        >
            {children}
        </SorobanReactProvider>
    );
}
