/* eslint-disable sort-destructure-keys/sort-destructure-keys, sort-keys-fix/sort-keys-fix */
import type { AuthType } from '@particle-network/auth';
import { Chain } from '../components/RainbowKitProvider/RainbowKitChainContext';
import { WalletList } from './Wallet';
import { connectorsForWallets } from './connectorsForWallets';
import { braveWallet } from './walletConnectors/braveWallet/braveWallet';
import { coinbaseWallet } from './walletConnectors/coinbaseWallet/coinbaseWallet';
import { injectedWallet } from './walletConnectors/injectedWallet/injectedWallet';
import { metaMaskWallet } from './walletConnectors/metaMaskWallet/metaMaskWallet';
import { particleWallet } from './walletConnectors/particleWallet/particleWallet';
import { rainbowWallet } from './walletConnectors/rainbowWallet/rainbowWallet';
import { walletConnectWallet } from './walletConnectors/walletConnectWallet/walletConnectWallet';

export const getDefaultWallets = ({
  appName,
  chains,
  authTypes,
}: {
  appName: string;
  chains: Chain[];
  authTypes?: AuthType[];
}): {
  connectors: ReturnType<typeof connectorsForWallets>;
  wallets: WalletList;
} => {
  const defaultWallets = [
    injectedWallet({ chains }),
    rainbowWallet({ chains }),
    coinbaseWallet({ appName, chains }),
    metaMaskWallet({ chains }),
    walletConnectWallet({ chains }),
    braveWallet({ chains }),
  ];

  if (typeof window !== 'undefined' && window.particle) {
    defaultWallets.unshift(particleWallet({ chains }));
    if (authTypes && authTypes.length > 0) {
      const size = authTypes.length;
      for (let i = 0; i < size; i++) {
        defaultWallets.unshift(
          particleWallet({ chains, authType: authTypes[size - i - 1] })
        );
      }
    }
  }

  const wallets: WalletList = [
    {
      groupName: 'Popular',
      wallets: defaultWallets,
    },
  ];

  return {
    connectors: connectorsForWallets(wallets),
    wallets,
  };
};
