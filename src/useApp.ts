
// todo: refact
import { useState } from 'react';
import Web3 from "web3";
import Web3Modal from "web3modal";
// import WalletConnectProvider from "@walletconnect/web3-provider";

import { IAssetData } from "./helpers/types";
import { apiGetAccountAssets } from "./helpers/api";
import {
  getChainData
} from "./helpers/utilities";

interface IAppState {
  fetching: boolean;
  address: string;
  web3: any;
  provider: any;
  connected: boolean;
  chainId: number;
  networkId: number;
  assets: IAssetData[];
  showModal: boolean;
  pendingRequest: boolean;
  result: any | null;
  web3Modal: object;
}

const INITIAL_STATE: IAppState = {
  fetching: false,
  address: "",
  web3: null,
  provider: null,
  connected: false,
  chainId: 1,
  networkId: 1,
  assets: [],
  showModal: false,
  pendingRequest: false,
  result: null,
  web3Modal: {},
};

function initWeb3(provider: any) {
  const web3: any = new Web3(provider);

  web3.eth.extend({
    methods: [
      {
        name: "chainId",
        call: "eth_chainId",
        outputFormatter: web3.utils.hexToNumber
      }
    ]
  });

  return web3;
}
const getNetwork = (chainId: any) => getChainData(chainId).network;
export const web3Modal = new Web3Modal({
  network: getNetwork(INITIAL_STATE.chainId),
  cacheProvider: true,
});

function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
  }
  return result;
}

const TEST_WELLETS = [...Array(2)].map((_, i) => ({
  address: ['0xdE2F26fe3F6fC28C64344B2B415CF6bb3C68022a', '0x326f581DEfe6DD4E96833D20381552cDd850A5De'][i],
  balance: Math.random(),
  master: false,
  disconnected: i === 4 ? true : false,
}));


interface WalletProps {
  // address: string;
  address?: any;
  balance?: any;
  master?: boolean;
  disconnect?: Function;
}

export default function useApp() {
  const [state, setState] = useState(INITIAL_STATE);
  const [wallets, setWallets] = useState<WalletProps[]>([]); // todo: use obj instead of array

  const onConnect = async () => {
    const provider = await web3Modal.connect();

    await subscribeProvider(provider);

    const web3: any = initWeb3(provider);

    const accounts = await web3.eth.getAccounts();
    const address = accounts[0];

    const networkId = await web3.eth.net.getId();

    const chainId = await web3.eth.chainId();

    await setState(prevState => ({
      ...prevState,
      web3,
      provider,
      connected: true,
      address,
      chainId,
      networkId
    }));
    const assets = await apiGetAccountAssets(address, chainId);
    setWallets([
      {
        address,
        balance: assets[0].balance,
        master: true
      },
      ...TEST_WELLETS
    ])
  };

  const subscribeProvider = async (provider: any) => {
    if (!provider.on) {
      return;
    }
    provider.on("close", () => resetApp());
    provider.on("accountsChanged", async (accounts: string[]) => {
      await setState(prevState => ({ ...prevState, address: accounts[0] }));
      await getAccountAssets();
    });
    provider.on("chainChanged", async (chainId: number) => {
      const { web3 } = state;
      const networkId = await web3.eth.net.getId();
      await setState(prevState => ({ ...prevState, chainId, networkId }));
      await getAccountAssets();
    });

    provider.on("networkChanged", async (networkId: number) => {
      const { web3 } = state;
      const chainId = await web3.eth.chainId();
      await setState(prevState => ({ ...prevState, chainId, networkId }));
      await getAccountAssets();
    });
  };

  const getAccountAssets = async () => {
    const { address, chainId } = state;
    await setState(prevState =>({ ...prevState, fetching: true }));
    try {
      // get account balances
      const assets = await apiGetAccountAssets(address, chainId);

      setState(prevState =>({ ...prevState, fetching: false, assets }));
    } catch (error) {
      console.error(error); // tslint:disable-line
      setState(prevState =>({ ...prevState, fetching: false }));
    }
  };

  const toggleModal = () => {
    setState(prevState => ({ ...prevState, showModal: !state.showModal, result: {yes: true} }));
  }

  const resetApp = async () => {
    const { web3 } = state;
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }
    await web3Modal.clearCachedProvider();
    setState({ ...INITIAL_STATE });
  };

  const toMaster = (address) => {
    // resetApp();
    // const prevMasterIndex = wallets.findIndex(({ master }) => master === true );
    const index = wallets.findIndex((wallet) => wallet.address === address);
    const result = [...wallets];
    result.shift();
    result[index] = {
      ...result[index],
      master: true,
    }
    setWallets(result);
  }

  const disconnect = (address) => {
    const index = wallets.findIndex((wallet) => wallet.address === address);
    const result = [...wallets];
    result.splice(index, 1);
    result[0] = {
      ...result[0],
      master: true,
    }
    setWallets(result);
  }
  
  return {
    state,
    setState,
    wallets,
    setWallets,
    methods: {
      onConnect,
      toggleModal,
      getAccountAssets,
      resetApp,
      toMaster,
      disconnect,
    }
  }
};