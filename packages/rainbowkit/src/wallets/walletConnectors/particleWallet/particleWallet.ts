/* eslint-disable sort-keys-fix/sort-keys-fix */
import { Chain } from '../../../components/RainbowKitProvider/RainbowKitChainContext';
import { Wallet } from '../../Wallet';
import { ParticleConnector } from './particleConnector';

export interface ParticleWalletOptions {
  chains: Chain[];
}

export const particleWallet = ({ chains }: ParticleWalletOptions): Wallet => ({
  id: 'particle',
  name: 'Particle',
  iconUrl: async () => (await import('./particleWallet.png')).default,
  iconBackground: '#d61ace',
  installed: typeof window !== 'undefined',
  createConnector: () => {
    if (!window.particle) {
      throw new Error('Please init Particle first');
    }
    const connector = new ParticleConnector({
      chains: chains,
      options: window.particle.auth,
    });

    return {
      connector,
    };
  },
});
