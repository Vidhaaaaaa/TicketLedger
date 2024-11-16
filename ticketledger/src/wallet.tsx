import { useState } from "react";

const Wallet = () => {
    const [address, setAddress] = useState<string | null>(null);

    const connectWallet = async () => {
        if (window.aptos) {
            try {
                const account = await window.aptos.connect();
                setAddress(account.address);
                console.log("Connected wallet:", account.address);
            } catch (err) {
                console.error("Connection failed:", err);
            }
        } else {
            alert("Petra Wallet not installed!");
        }
    };

    return (
        <div>
            <button onClick={connectWallet}>
                {address ? `Connected: ${address}` : "Connect Wallet"}
            </button>
        </div>
    );
};

const mintTicket = async () => {
    if (!address) return alert("Connect your wallet first!");

    const payload = {
        type: "entry_function_payload",
        function: "<CONTRACT_ADDRESS>::TicketNFT::mint_ticket",
        arguments: [
            "Concert Collection", // Collection Name
            "Concert Ticket",     // Ticket Name
            "Exclusive ticket for concert", // Description
            "https://example.com/ticket.png", // Metadata URI
        ],
        type_arguments: [],
    };

    try {
        const transaction = await window.aptos.signAndSubmitTransaction(payload);
        console.log("NFT Minted:", transaction);
    } catch (err) {
        console.error("Minting failed:", err);
    }
};

return (
    <div>
        <button onClick={connectWallet}>
            {address ? `Connected: ${address}` : "Connect Petra Wallet"}
        </button>
        <button onClick={mintTicket} disabled={!address}>
            Mint NFT Ticket
        </button>
    </div>
);
};
export default Wallet;
