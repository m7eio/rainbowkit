/* eslint-disable import/order, sort-imports */
import { providers, ethers } from 'ethers';
import type { ParticleProvider } from '@particle-network/provider';
import { Chain } from '../../../components/RainbowKitProvider/RainbowKitChainContext';
import {
  Connector,
  ConnectorData,
  ChainNotConfiguredError,
  ConnectorNotFoundError,
  ResourceUnavailableError,
  SwitchChainError,
  UserRejectedRequestError,
} from 'wagmi';
import type { AuthType } from '@particle-network/auth';

type ParticleSigner = providers.JsonRpcSigner;

type ParticleAuth = ConstructorParameters<typeof ParticleProvider>[0];

type ParticleOptions = {
  auth: ParticleAuth;
  authType?: AuthType;
};
export class ParticleConnector extends Connector<
  ParticleProvider,
  ParticleOptions,
  ParticleSigner
> {
  readonly id = 'particle';
  readonly name = 'Particle';
  readonly ready = true;

  #provider?: ParticleProvider;

  async connect({ chainId }: { chainId?: number } = {}): Promise<
    Required<ConnectorData<any>>
  > {
    try {
      const provider = await this.getProvider();
      provider.on('accountsChanged', this.onAccountsChanged);
      provider.on('chainChanged', this.onChainChanged);
      provider.on('disconnect', this.onDisconnect);

      this.emit('message', { type: 'connecting' });

      if (!this.options.auth.isLogin()) {
        await this.options.auth.login({
          preferredAuthType: this.options.authType,
        });
      }

      let id = await this.getChainId();
      let unsupported = this.isChainUnsupported(id);

      if (chainId && id !== chainId) {
        const chain = await this.switchChain(chainId);
        id = chain.id;
        unsupported = this.isChainUnsupported(id);
      }

      const account = await this.getAccount();

      return {
        account,
        chain: { id, unsupported },
        provider: new providers.Web3Provider(
          provider as providers.ExternalProvider
        ),
      };
    } catch (error: any) {
      if (error.code === 4001) {
        throw new UserRejectedRequestError(error);
      }
      if (error.code === -32002) {
        throw new ResourceUnavailableError(error);
      }
      throw error;
    }
  }

  async disconnect() {
    const provider = await this.getProvider();
    await provider.disconnect();

    provider.removeListener('accountsChanged', this.onAccountsChanged);
    provider.removeListener('chainChanged', this.onChainChanged);
    provider.removeListener('disconnect', this.onDisconnect);
  }

  async getAccount(): Promise<string> {
    const provider = await this.getProvider();
    const accounts = await provider.request({ method: 'eth_accounts' });
    // return checksum address
    return ethers.utils.getAddress(accounts[0]);
  }

  async getChainId(): Promise<number> {
    const provider = await this.getProvider();
    const chainId = await provider.request({ method: 'eth_chainId' });
    return Number(chainId);
  }

  async getProvider(): Promise<ParticleProvider> {
    if (!this.#provider) {
      const { ParticleProvider } = await import('@particle-network/provider');
      this.#provider = new ParticleProvider(this.options.auth);
    }
    return this.#provider;
  }

  async getSigner(): Promise<ParticleSigner> {
    const [provider, account] = await Promise.all([
      this.getProvider(),
      this.getAccount(),
    ]);
    return new providers.Web3Provider(
      provider as providers.ExternalProvider
    ).getSigner(account);
  }

  async isAuthorized(): Promise<boolean> {
    return this.options.auth.isLogin() && this.options.auth.walletExist();
  }

  async switchChain(chainId: number): Promise<Chain> {
    const provider = await this.getProvider();
    if (!provider) throw new ConnectorNotFoundError();
    const id = ethers.utils.hexValue(chainId);
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: id }],
      });
      return (
        this.chains.find(x => x.id === chainId) ?? {
          id: chainId,
          name: `Chain ${id}`,
          network: `${id}`,
          rpcUrls: { default: '' },
        }
      );
    } catch (error) {
      const chain = this.chains.find(x => x.id === chainId);
      if (!chain)
        throw new ChainNotConfiguredError({
          chainId,
          connectorId: `Chain ${chainId}`,
        });

      throw new SwitchChainError(error);
    }
  }

  protected onAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) this.emit('disconnect');
    else this.emit('change', { account: ethers.utils.getAddress(accounts[0]) });
  };

  protected onChainChanged = (chainId: number | string) => {
    const id = Number(chainId);
    const unsupported = this.isChainUnsupported(id);
    this.emit('change', { chain: { id, unsupported } });
  };

  protected onDisconnect = () => {
    this.emit('disconnect');
  };
}
