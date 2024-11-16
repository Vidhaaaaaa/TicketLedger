import React, { useState } from "react";
import './App.css'; // Import your custom CSS here

const App = () => {
  // States for wallet address, ticket ID, and amount
  const [address, setAddress] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState<number>(1);  // Static for now, can be dynamic
  const [amount, setAmount] = useState<number>(1000000); // Amount in micro Aptos

  // Function to connect to Petra Wallet
  const connectWallet = async () => {
    if (typeof window.aptos === "undefined") {
      alert("Petra Wallet is not installed. Please install it from https://petra.app/");
      return;
    }

    try {
      const account = await window.aptos.connect();
      setAddress(account.address); // Store the address in state
      console.log("Connected wallet:", account.address);
    } catch (err) {
      console.error("Connection failed:", err);
    }
  };

  // Function to mint ticket and deduct amount
  const mintTicket = async () => {
    if (!address) {
      alert("Please connect your wallet first!");
      return;
    }

    try {
      // Send transaction to mint the ticket and deduct the amount
      const txn = await window.aptos.submitTransaction({
        type: "script_function_payload", // Specify the transaction type
        function: "nft_ticketing::mint_ticket", // Function in Move contract
        arguments: [ticketId, amount], // Arguments: ticketId and amount
      });

      console.log("Transaction sent:", txn.hash);
      await window.aptos.waitForTransaction(txn.hash); // Wait for transaction confirmation
      alert("Ticket minted and amount deducted!");
    } catch (err) {
      console.error("Transaction failed:", err);
      alert("Transaction failed. Please try again.");
    }
  };

  return (
    <div className="app-container">
      {/* Insert your HTML structure here */}
      
      {/* Wallet Connection Section */}
      <div className="wallet-info">
        <button onClick={connectWallet}>
          {address ? `Connected: ${address}` : "Connect Petra Wallet"}
        </button>
      </div>

      {/* Mint Ticket Section */}
      <div className="mint-info">
        <button onClick={mintTicket} disabled={!address}>
          Continue (Mint Ticket & Deduct Amount)
        </button>
      </div>

      {/* Insert any other HTML content you need below */}
      
    </div>
  );
};

export default App;
