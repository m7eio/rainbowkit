/* eslint-disable sort-keys-fix/sort-keys-fix, sort-destructure-keys/sort-destructure-keys */
import type { AuthType } from '@particle-network/auth';
import { Chain } from '../../../components/RainbowKitProvider/RainbowKitChainContext';
import { titleCase } from '../../../utils/titleCase';
import { Wallet } from '../../Wallet';
import { ParticleConnector } from './particleConnector';

export interface ParticleWalletOptions {
  chains: Chain[];
  authType?: AuthType;
}

export const particleWallet = ({
  chains,
  authType,
}: ParticleWalletOptions): Wallet => ({
  id: authType ? `particle${authType}` : 'particle',
  name: authType ? titleCase(authType) : 'Particle',
  iconUrl: async () => {
    const icons = await import('./icons');
    return authType ? icons[authType] : icons.particle;
  },
  iconBackground: authType ? '#ffffff' : '#d61ace',
  installed: typeof window !== 'undefined',
  createConnector: () => {
    if (!window.particle) {
      throw new Error('Please init Particle first');
    }
    const connector = new ParticleConnector({
      chains: chains,
      options: {
        auth: window.particle.auth,
        authType: authType,
      },
    });

    return {
      connector,
    };
  },
});
