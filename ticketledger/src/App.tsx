import './App.css';
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { InputTransactionData, useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState } from "react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

// Make sure these are correctly set up from .env
const moduleAddress = process.env.REACT_APP_MODULE_ADDRESS!;
const moduleName = "TicketNFT";  // Assuming the contract's module name is TicketNFT

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
        data: {
          function: `${moduleAddress}::${moduleName}::mint_ticket`,
          functionArguments: [
            1,  // Unique ID for the ticket
            "HotPause Concert", 
            "Exclusive concert ticket for HotPause",
            "https://www.svgrepo.com/show/8605/tickets.svg", // Image URL for the ticket
          ],
        },
      };

      // Sending the transaction to mint the ticket
      const tx = await signAndSubmitTransaction(payload);
      console.log("Transaction submitted:", tx);

      await client.getTransactionByHash(tx.hash);  // Wait for transaction confirmation
      alert("NFT Minted Successfully!");  // Alert on success
    } catch (err) {
      console.error("Minting failed:", err);
      alert("Failed to mint the ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return (
      <>
      <div className="app-container">
        <header>
          <h1>TicketLedger</h1>
          <p>Your gateway to exclusive events</p>
          <p>Please connect your wallet to continue</p>
        </header>
        <div className="wallet-selector">
          <WalletSelector />
        </div>
      </div>
      </>
    );
  }

  return (
    <div className="app-container">
      {loading && (
        <div className="loading-overlay">
          <div className="loading-message">Processing your transaction...</div>
        </div>
      )}

      <header>
        <h1>TicketLedger</h1>
        <p>Your gateway to exclusive events</p>
      </header>

      <main>
        <section className="events">
          <div className="event">
            <h2>HotPause Concert</h2>
            <p>16th December 2024</p>
            <button onClick={handleMintTicket}>Book Now</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
