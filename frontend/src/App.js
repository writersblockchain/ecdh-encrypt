import React, { useState } from "react";
import { SecretNetworkClient, MetaMaskWallet, Wallet } from "secretjs";
import "./App.css";
import { ethers, Contract } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import ABI from "./abi/Encrypt.json";
import encrypt from "./functions/encrypt";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [secretWalletAddress, setSecretWalletAddress] = useState("");
  const [message, setMessage] = useState("");
  const [decryptInput, setDecryptInput] = useState("");
  const [decryptedMessage, setDecryptedMessage] = useState("");
  const [transactionLink, setTransactionLink] = useState("");

  const ECC_PUBLIC_KEY = [
    3, 118, 120, 142, 29, 35, 3, 21, 172, 209, 97, 236, 216, 110, 118, 24, 11,
    161, 53, 45, 56, 193, 141, 235, 56, 13, 177, 99, 213, 172, 58, 4, 124,
  ];

  function hexToArray(hexString) {
    // Check if the string starts with '0x' and remove it
    const hex = hexString.startsWith("0x") ? hexString.slice(2) : hexString;

    const numberArray = [];

    for (let i = 0; i < hex.length; i += 2) {
      numberArray.push(parseInt(hex.substr(i, 2), 16));
    }

    return numberArray;
  }

  const encryptAddress = "0x3575c7C4B48c53a834fcbbCd76EAF84e00F5E972";
  const contractABI = ABI.abi;

  const connectWallet = async () => {
    try {
      const [ethAddress] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const wallet = await MetaMaskWallet.create(window.ethereum, ethAddress);
      const secretjs = new SecretNetworkClient({
        url: "https://api.pulsar3.scrttestnet.com",
        chainId: "pulsar-3",
        wallet: wallet,
        walletAddress: wallet.address,
      });
      console.log("Connected to Secret Network", secretjs);
      setSecretWalletAddress(secretjs.address);
      setIsConnected(true);
    } catch (error) {
      console.error("Error connecting to MetaMask", error);
    }
  };

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const handleDecryptInputChange = (event) => {
    setDecryptInput(event.target.value);
  };

  const encryptMessage = async () => {
    if (message) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contract = new Contract(encryptAddress, contractABI, signer);
      let my_encrypted_message = await encrypt(message);
      const tx = await contract.storeData(my_encrypted_message);
      console.log("Transaction data:", tx.data);
      const txLink = `https://mumbai.polygonscan.com/tx/${tx.hash}`;
      setTransactionLink(txLink);
    } else {
      console.log("No message to encrypt");
    }
  };

  let get_decrypted_query = async () => {
    let contractAddress = "secret1ms3tt405tlh6un3w0kzmr6tzf7q50ksjgm54z4";
    let contractCodeHash =
      "90984df210c5a88e55e4de115db283c047538e0e704ea1d03a7434528be7af63";

    // Dummy wallet and SecretNetworkClient setup for demonstration; replace with actual values
    const wallet = new Wallet(
      "desk pigeon hammer sleep only mistake stool december offer patrol once vacant"
    );

    const secretjs = new SecretNetworkClient({
      url: "https://api.pulsar3.scrttestnet.com",
      chainId: "pulsar-3",
      wallet: wallet,
      walletAddress: wallet.address,
    });

    let query = await secretjs.query.compute.queryContract({
      contract_address: contractAddress,
      query: {
        decrypt_query: {
          public_key: ECC_PUBLIC_KEY,
          encrypted_message: await hexToArray(decryptInput),
        },
      },
      code_hash: contractCodeHash,
    });

    console.log("Decryption query result:", query);
    // Process and display the decryption result as needed
    setDecryptedMessage(query || "Decryption failed or not implemented");
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={connectWallet} disabled={isConnected}>
          {isConnected ? "Connected" : "Connect Wallet"}
        </button>
        <input
          type="text"
          value={message}
          onChange={handleChange}
          placeholder="Type your message"
        />
        <button onClick={encryptMessage}>Encrypt Message</button>
        {transactionLink && (
          <a href={transactionLink} target="_blank" rel="noopener noreferrer">
            {transactionLink}
          </a>
        )}
        <input
          type="text"
          value={decryptInput}
          onChange={handleDecryptInputChange}
          placeholder="Input hex string to decrypt"
        />
        <button onClick={get_decrypted_query}>Decrypt</button>
        {decryptedMessage && <p>Decrypted Message: {decryptedMessage}</p>}
      </header>
    </div>
  );
}

export default App;
