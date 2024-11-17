import './App.css';
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { InputTransactionData, useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState } from "react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const moduleAddress = process.env.REACT_APP_MODULE_ADDRESS;
const moduleName = process.env.REACT_APP_MODULE_NAME;

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
      const payload: InputTransactionData = {
        data: {
          function: `${moduleAddress}::${moduleName}::mint_ticket`,
          functionArguments: [
            "HotPause Concert", // Collection name
            "HotPause Ticket #1", // NFT Name
            "Exclusive concert ticket", // Description
            "https://example.com/nft-image.png" // Metadata URI
          ],
        },
      };

      const tx = await signAndSubmitTransaction({ payload });
      console.log("Transaction submitted:", tx);

      await client.getTransactionByHash(tx.hash); // Wait for confirmation
      alert("NFT Minted Successfully!");
    } catch (err) {
      console.error("Minting failed:", err);
      alert("Failed to mint the ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return (
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
          <div className="event">
            <h2>Blockchain Expo</h2>
            <p>Coming Soon...</p>
          </div>
          <div className="event">
            <h2>India Blockchain Week 2024</h2>
            <p>Coming Soon...</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
