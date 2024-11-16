module TicketNFT {
    use aptos_framework::token::{self, TokenData, TokenId};

    public entry fun mint_ticket(
        creator: &signer,
        collection_name: vector<u8>,
        name: vector<u8>,
        description: vector<u8>,
        uri: vector<u8>,
    ): TokenId {
        // Create a new collection
        let collection = token::create_collection(
            creator,
            collection_name,
            description,
            uri,
            false, // Disable transfer
        );

        // Mint the ticket as a token
        let token_id = token::create_token(
            creator,
            collection,
            name,
            description,
            uri,
            1, // Maximum supply
        );

        token_id
    }
}