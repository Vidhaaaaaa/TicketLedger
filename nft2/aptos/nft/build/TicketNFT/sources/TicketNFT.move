module 0x624ebfa1df2b252f89311e536dc783292446abfa0dd2c12512c3101ec733c39e::TicketNFT {
    use std::string;

    // Define the Ticket struct
    struct Ticket has store, key, drop {
        id: u64,
        name: string::String,
        description: string::String,
        image_url: string::String,
    }

    // Struct for returning ticket data
    struct TicketInfo has drop {
        id: u64,
        name: string::String,
        description: string::String,
        image_url: string::String,
    }

    // Mint a ticket
    public entry fun mint_ticket(
        account: &signer,
        id: u64,
        name: string::String,
        description: string::String,
        image_url: string::String
    ) {
        let ticket = Ticket {
            id,
            name,
            description,
            image_url,
        };

        // Move the ticket resource to the owner's account
        move_to(account, ticket);
    }

    // Get ticket information
    public fun get_ticket(account: address): TicketInfo acquires Ticket {
        let ticket = borrow_global<Ticket>(account);
        TicketInfo {
            id: ticket.id,
            name: ticket.name,
            description: ticket.description,
            image_url: ticket.image_url,
        }
    }
}
