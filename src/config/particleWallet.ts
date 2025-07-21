import { Config } from "@particle-network/auth";
// import { ParticleProvider } from "@particle-network/provider";
import { Chain } from "@wagmi/chains";
import {
  getAddress,
  numberToHex,
  SwitchChainError,
  UserRejectedRequestError,
} from "viem";
import { Connector, createConnector, ProviderNotFoundError } from "wagmi";

export type ParticleWalletParameters = {
  /**
   * Some injected providers do not support programmatic disconnect.
   * This flag simulates the disconnect behavior by keeping track of connection status in storage.
   * @default true
   */
  shimDisconnect?: boolean | undefined;
  /**
   * [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193) Ethereum Provider to target
   */
  unstable_shimAsyncInject?: boolean | number | undefined;
  chains?: Chain[];
  options?: Config;
};
particleWallet.type = "particleWallet" as const;
/* eslint-disable @typescript-eslint/no-explicit-any */
export function particleWallet({ options }: ParticleWalletParameters = {}) {
  let client: any;
  let provider: any;
  const id = "Particle";
  const name = "Particle";

  let accountsChanged: Connector["onAccountsChanged"] | undefined;
  let chainChanged: Connector["onChainChanged"] | undefined;
  let connect: Connector["onConnect"] | undefined;
  let disconnect: Connector["onDisconnect"] | undefined;

  return createConnector((config) => ({
    type: particleWallet.type,

    id: id,

    name: name,

    async disconnect() {
      if (!provider) provider = await this.getProvider();
      provider.removeListener("accountsChanged", this.onAccountsChanged);
      provider.removeListener("chainChanged", this.onChainChanged);
      provider.removeListener("disconnect", this.onDisconnect.bind(this));

      await (provider as any)?.disconnect?.();
    },

    async getChainId() {
      provider = await this.getProvider();
      if (!provider) throw new ProviderNotFoundError();
      const hexChainId = await provider.request({ method: "eth_chainId" });
      return Number(hexChainId);
    },

    async getAccounts() {
      const provider: any = await this.getProvider();
      if (!provider) throw new ProviderNotFoundError();
      const accounts = await provider.request({ method: "eth_accounts" });
      return accounts.map((x: any) => getAddress(x));
    },

    async isAuthorized() {
      try {
        await this.getProvider();
        return client!.auth.isLogin();
      } catch {
        return false;
      }
    },

    async onConnect(connectInfo) {
      const accounts = await this.getAccounts();
      if (accounts.length === 0) return;

      const chainId = Number(connectInfo.chainId);
      config.emitter.emit("connect", { accounts, chainId });

      // Manage EIP-1193 event listeners
      if (!provider) provider = await this.getProvider();

      if (provider) {
        if (connect) {
          provider.removeListener("connect", connect);
          connect = undefined;
        }
        if (!accountsChanged) {
          accountsChanged = this.onAccountsChanged.bind(this);
          provider.on("accountsChanged", accountsChanged);
        }
        if (!chainChanged) {
          chainChanged = this.onChainChanged.bind(this);
          provider.on("chainChanged", chainChanged);
        }
        if (!disconnect) {
          disconnect = this.onDisconnect.bind(this);
          provider.on("disconnect", disconnect);
        }
      }
    },

    async onAccountsChanged(accounts) {
      if (accounts.length === 0) this.onDisconnect();
      // Connect if emitter is listening for connect event (e.g. is disconnected and connects through wallet interface)
      else if (config.emitter.listenerCount("connect")) {
        const chainId = (await this.getChainId()).toString();
        this.onConnect!({ chainId });
      }
      // Regular change event
      else
        config.emitter.emit("change", {
          accounts: accounts.map((x) => getAddress(x)),
        });
    },

    onChainChanged(chain) {
      const chainId = Number(chain);
      config.emitter.emit("change", { chainId });
    },

    async onDisconnect() {
      if (!provider) provider = await this.getProvider();
      provider.removeListener("accountsChanged", this.onAccountsChanged);
      provider.removeListener("chainChanged", this.onChainChanged);
      provider.removeListener("disconnect", this.onDisconnect.bind(this));

      await (provider as any)?.disconnect?.();
    },

    async switchChain({ chainId }) {
      if (!provider) provider = await this.getProvider();
      const id = numberToHex(chainId);

      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: id }],
        });
        return (
          config.chains.find((x) => x.id === chainId) ?? {
            id: chainId,
            name: `Chain ${id}`,
            network: `${id}`,
            nativeCurrency: { name: "Ether", decimals: 18, symbol: "ETH" },
            rpcUrls: { default: { http: [""] }, public: { http: [""] } },
          }
        );
      } catch (error) {
        throw new SwitchChainError(error as Error);
      }
    },

    async getProvider() {
      if (!provider) {
        const [{ ParticleNetwork }, { ParticleProvider }] = await Promise.all([
          import("@particle-network/auth"),
          import("@particle-network/provider"),
        ]);
        // Workaround for Vite dev import errors
        // https://github.com/vitejs/vite/issues/7112
        client = new ParticleNetwork(options);
        provider = new ParticleProvider(client.auth);
      }

      return provider;
    },

    async connect({ chainId } = {}) {
      try {
        if (!provider) provider = await this.getProvider();
        provider.on("accountsChanged", this.onAccountsChanged);
        provider.on("chainChanged", this.onChainChanged);
        provider.on("disconnect", this.onDisconnect.bind(this));

        if (!client?.auth.isLogin()) {
          await client?.auth.login({
            preferredAuthType: "email",
            supportAuthTypes: "all",
          });
        }

        const accounts = await provider.enable();

        let id = await this.getChainId();
        // let unsupported = this.isChainUnsupported(id);
        if (chainId && id !== chainId) {
          const chain = await this.switchChain!({ chainId });
          id = chain.id;
          // unsupported = this.isChainUnsupported(id);
        }

        return {
          accounts,
          chainId: id,
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.code === 4001) {
          error.name = error.code.toString();
          throw new UserRejectedRequestError(error as Error);
        }

        throw error;
      }
    },
  }));
}

particleGoogleWallet.type = "particleGoogleWallet" as const;

/* eslint-disable @typescript-eslint/no-explicit-any */
export function particleGoogleWallet({
  options,
}: ParticleWalletParameters = {}) {
  let client: any;
  let provider: any;
  const id = "ParticleGoogle";
  const name = "ParticleGoogle";

  let accountsChanged: Connector["onAccountsChanged"] | undefined;
  let chainChanged: Connector["onChainChanged"] | undefined;
  let connect: Connector["onConnect"] | undefined;
  let disconnect: Connector["onDisconnect"] | undefined;

  return createConnector((config) => ({
    type: particleGoogleWallet.type,

    id: id,
    name: name,

    async connect({ chainId } = {}) {
      try {
        if (!provider) provider = await this.getProvider();
        provider.on("accountsChanged", this.onAccountsChanged);
        provider.on("chainChanged", this.onChainChanged);
        provider.on("disconnect", this.onDisconnect.bind(this));

        if (!client?.auth.isLogin()) {
          await client?.auth.login({
            preferredAuthType: "google",
            supportAuthTypes: "all",
          });
        }

        const accounts = await provider.enable();

        let id = await this.getChainId();
        // let unsupported = this.isChainUnsupported(id);
        if (chainId && id !== chainId) {
          const chain = await this.switchChain!({ chainId });
          id = chain.id;
          // unsupported = this.isChainUnsupported(id);
        }

        return {
          accounts,
          chainId: id,
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.code === 4001) {
          error.name = error.code.toString();
          throw new UserRejectedRequestError(error as Error);
        }

        throw error;
      }
    },
    async disconnect() {
      if (!provider) provider = await this.getProvider();
      provider.removeListener("accountsChanged", this.onAccountsChanged);
      provider.removeListener("chainChanged", this.onChainChanged);
      provider.removeListener("disconnect", this.onDisconnect.bind(this));

      await (provider as any)?.disconnect?.();
    },
    async getAccounts() {
      const provider: any = await this.getProvider();
      if (!provider) throw new ProviderNotFoundError();
      const accounts = await provider.request({ method: "eth_accounts" });
      return accounts.map((x: any) => getAddress(x));
    },
    async getChainId() {
      provider = await this.getProvider();
      if (!provider) throw new ProviderNotFoundError();
      const hexChainId = await provider.request({ method: "eth_chainId" });
      return Number(hexChainId);
    },
    async getProvider() {
      if (!provider) {
        const [{ ParticleNetwork }, { ParticleProvider }] = await Promise.all([
          import("@particle-network/auth"),
          import("@particle-network/provider"),
        ]);
        // Workaround for Vite dev import errors
        // https://github.com/vitejs/vite/issues/7112
        client = new ParticleNetwork(options);
        provider = new ParticleProvider(client.auth);
      }

      return provider;
    },
    async isAuthorized() {
      try {
        await this.getProvider();
        return client!.auth.isLogin();
      } catch {
        return false;
      }
    },
    async onAccountsChanged(accounts) {
      if (accounts.length === 0) this.onDisconnect();
      // Connect if emitter is listening for connect event (e.g. is disconnected and connects through wallet interface)
      else if (config.emitter.listenerCount("connect")) {
        const chainId = (await this.getChainId()).toString();
        this.onConnect!({ chainId });
      }
      // Regular change event
      else
        config.emitter.emit("change", {
          accounts: accounts.map((x) => getAddress(x)),
        });
    },

    onChainChanged(chain) {
      const chainId = Number(chain);
      config.emitter.emit("change", { chainId });
    },

    async onDisconnect() {
      config.emitter.emit("disconnect");

      const provider = await this.getProvider();
      provider.removeListener("accountsChanged", this.onAccountsChanged);
      provider.removeListener("chainChanged", this.onChainChanged);
      provider.removeListener("disconnect", this.onDisconnect.bind(this));
    },

    async switchChain({ chainId }) {
      if (!provider) provider = await this.getProvider();
      const id = numberToHex(chainId);

      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: id }],
        });
        return (
          config.chains.find((x) => x.id === chainId) ?? {
            id: chainId,
            name: `Chain ${id}`,
            network: `${id}`,
            nativeCurrency: { name: "Ether", decimals: 18, symbol: "ETH" },
            rpcUrls: { default: { http: [""] }, public: { http: [""] } },
          }
        );
      } catch (error) {
        throw new SwitchChainError(error as Error);
      }
    },
    async onConnect(connectInfo) {
      const accounts = await this.getAccounts();
      if (accounts.length === 0) return;

      const chainId = Number(connectInfo.chainId);
      config.emitter.emit("connect", { accounts, chainId });

      // Manage EIP-1193 event listeners
      if (!provider) provider = await this.getProvider();

      if (provider) {
        if (connect) {
          provider.removeListener("connect", connect);
          connect = undefined;
        }
        if (!accountsChanged) {
          accountsChanged = this.onAccountsChanged.bind(this);
          provider.on("accountsChanged", accountsChanged);
        }
        if (!chainChanged) {
          chainChanged = this.onChainChanged.bind(this);
          provider.on("chainChanged", chainChanged);
        }
        if (!disconnect) {
          disconnect = this.onDisconnect.bind(this);
          provider.on("disconnect", disconnect);
        }
      }
    },
  }));
}
