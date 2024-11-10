import Web3 from "web3";
import Web3Modal from "web3modal";
import { ethers, providers } from "ethers";
import {
  CHAIN_ID,
  SITE_ERROR,
  SMARTCONTRACT_ADDRESS_ERC20,
} from "../../config";
import {
  errorAlert,
  errorAlertCenter,
  successAlert,
} from "../components/toastGroup";
import { providerOptions } from "./connectWallet";
require("../pages/api/hello");

export const importToken = () => {
  if (typeof window.ethereum !== "undefined") {
    window.ethereum
      .request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: SMARTCONTRACT_ADDRESS_ERC20,
            symbol: "$Dusty",
            decimals: 0,
            image: "https://dusty-vaults.vercel.app/logo32x32.png",
          },
        },
      })
      .then((success) => {
        if (success) {
          successAlert(
            "$Dusty token has been successfully added to your wallet. Please check your wallet."
          );
        } else {
          throw new Error("Something went wrong.");
        }
      })
      .catch(console.error);
  } else {
    errorAlertCenter(SITE_ERROR[1]);
  }
};

// Function to check the network
export const checkNetwork = async (alert) => {
  // Check if the Ethereum provider is available
  if (typeof window.ethereum === "undefined") {
    if (alert !== "no-alert") errorAlert(SITE_ERROR[1]);
    return false;
  }

  const web3 = new Web3(window.ethereum);
  try {
    const chainId = await web3.eth.getChainId();
    if (chainId === CHAIN_ID) {
      return true;
    } else {
      if (alert !== "no-alert") errorAlert(SITE_ERROR[0]);
      return false;
    }
  } catch (error) {
    console.error("Error getting chain ID:", error);
    if (alert !== "no-alert") errorAlert(SITE_ERROR[0]);
    return false;
  }
};

export const setConnectProvider = async () => {
  const web3Modal = new Web3Modal({
    network: "mainnet",
    cacheProvider: true,
    providerOptions,
  });

  const provider = await web3Modal.connect();
  const web3Provider = new providers.Web3Provider(provider);
  const signer = web3Provider.getSigner();

  return { web3Modal, provider, web3Provider, signer };
};
