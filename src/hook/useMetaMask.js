import { useEffect, useState } from "react";
import { ethers } from "ethers";

const useMetaMask = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectMetaMask = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);

        const signer = provider.getSigner();
        const address = await signer.getAddress();

        setWalletAddress(address);
        setProvider(provider);
        setIsConnected(true);
        setError(null);
      } catch (err) {
        console.error("MetaMask connection error:", err);
        setError("Failed to connect to MetaMask. Please try again.");
      }
    } else {
      alert("MetaMask is not installed. Please install it to continue.");
    }
  };

  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setIsConnected(true);
      } else {
        setWalletAddress(null);
        setIsConnected(false);
      }
    };

    const handleChainChanged = (chainId) => {
      console.log("Chain changed to:", chainId);
      window.location.reload();
    };

    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }

    return () => {
      if (typeof window.ethereum !== "undefined") {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  return { walletAddress, connectMetaMask, provider, error, isConnected };
};

export default useMetaMask;
