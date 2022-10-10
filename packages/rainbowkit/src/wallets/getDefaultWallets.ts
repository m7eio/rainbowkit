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
}: {
  appName: string;
  chains: Chain[];
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
  if (typeof window !== 'undefined') {
    defaultWallets.unshift(particleWallet({ chains }));
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
