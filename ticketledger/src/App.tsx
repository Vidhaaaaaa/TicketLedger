import { useState } from "react";

import './App.css'; // Import your custom CSS here

export {};

declare global {
  interface Window {
    aptos?: any; // Replace `any` with the appropriate type if known
  }
}

const App = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState<number>(1);
  const [amount, setAmount] = useState<number>(1000000); // Amount in micro Aptos

  // Connect to Petra Wallet
  const connectWallet = async () => {
    if (typeof window.aptos === "undefined") {
      alert("Petra Wallet is not installed. Please install it from https://petra.app/");
      return;
    }

    try {
      const account = await window.aptos.connect();
      setAddress(account.address); // Store address
      console.log("Connected wallet:", account.address);
    } catch (err) {
      console.error("Connection failed:", err);
    }
  };

  // Mint Ticket Function
  const mintTicket = async () => {
    if (!address) {
      alert("Please connect your wallet first!");
      return;
    }

    try {
      const txn = await window.aptos.submitTransaction({
        type: "script_function_payload",
        function: "nft_ticketing::mint_ticket",
        arguments: [ticketId, amount], // Ticket ID and the amount
      });

      console.log("Transaction sent:", txn.hash);
      await window.aptos.waitForTransaction(txn.hash); // Wait for confirmation
      alert("Ticket minted and amount deducted!");
    } catch (err) {
      console.error("Transaction failed:", err);
      alert("Transaction failed. Please try again.");
    }
  };

  return (
    <div className="app-container">
      {/* HTML content goes here */}
      
      <div className="wallet-info">
        <button onClick={connectWallet}>
          {address ? `Connected: ${address}` : "Connect Petra Wallet"}
        </button>
      </div>

      <div className="mint-info">
        <button onClick={mintTicket} disabled={!address}>
          Continue (Mint Ticket & Deduct Amount)
        </button>
      </div>

      {/* Additional HTML content for instructions */}
    </div>
  );
};

export default App;
