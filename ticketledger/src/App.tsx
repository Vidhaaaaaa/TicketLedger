import './App.css';
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { InputTransactionData, useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState } from "react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

// Safely access the environment variable
const moduleAddress = process.env.REACT_APP_MODULE_ADDRESS || "fallback_address"; // Replace with a default value
const moduleName = "TicketNFT"; // Assuming the contract's module name is TicketNFT

const aptosConfig = new AptosConfig({ network: Network.TESTNET });
const client = new Aptos(aptosConfig);

const App = () => {
  const { account, connected, signAndSubmitTransaction } = useWallet();
  const [loading, setLoading] = useState(false);

  const handleMintTicket = async () => {
    if (!connected || !account) {
      alert("Please connect your wallet first!");
      return;
    }

    setLoading(true);

    try {
      // Preparing transaction payload
      const payload: InputTransactionData = {
        type: "entry_function_payload",
        function: `${moduleAddress}::${moduleName}::mint_ticket`,
        type_arguments: [],
        arguments: ["1"], // Example argument
      };

      const response = await signAndSubmitTransaction(payload);
      console.log("Transaction successful:", response);
      alert("Transaction completed!");
    } catch (err) {
      console.error("Transaction failed:", err);
      alert("Transaction failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <WalletSelector />
      <h1>Mint Your Ticket NFT</h1>
      <button onClick={handleMintTicket} disabled={loading}>
        {loading ? "Minting..." : "Mint Ticket"}
      </button>
    </div>
  );
};

export default App;