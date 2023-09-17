"use client";
import { useState, useEffect } from 'react';
import abi from "../contracts/HolymolyPlayer.json"
import contractAddress from "../contracts/contract-address.json"
import { ethers } from "ethers"

interface StateType {
  provider: ethers.BrowserProvider | null;
  signer: any | null;
  contract: ethers.Contract | null;
}


const useUserAddress = () => {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [state, setState] = useState<StateType>({
    provider: null,
    signer: null,
    contract: null,
  });
  const SEPOLIA_NETWORK_ID = '11155111';
  const contract_address = contractAddress.HolymolyPlayer;
  const contractABI = abi.abi;
  

  useEffect(() => {
    const connectWallet = async () => {
      try {
        const { ethereum } = window;
        if (ethereum) {
          window.ethereum.on("chainChanged", () => {
            window.location.reload();
          });

          window.ethereum.on("accountsChanged", () => {
            window.location.reload();
          }); 

          if (ethereum.networkVersion === SEPOLIA_NETWORK_ID) {
            const accounts = await ethereum.request({
              method: "eth_requestAccounts",
            });
            const provider = new ethers.BrowserProvider(ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(
              contract_address,
              contractABI,
              signer
            );
            setUserAddress(accounts[0]);
            setState({ provider, signer, contract });
          }else{
            setUserAddress("Other Network");
          }
                   
        } else {
          setUserAddress(null)
        } 
      } catch (error) {
        console.error('Error connecting to the wallet:', error);
      }
    };
    connectWallet();
  }, []);

  return { userAddress, state };
};

export default useUserAddress;
