module moduleAddress::TicketNFT {
    use std::string;

    struct Ticket has store, key, drop {
        id: u64,
        name: string::String,
        description: string::String,
        image_url: string::String,
    }

    struct TicketInfo has drop {
        id: u64,
        name: string::String,
        description: string::String,
        image_url: string::String,
    }

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

        move_to(account, ticket);
    }

    public fun get_ticket(account: address): TicketInfo acquires Ticket {
        let ticket = borrow_global<Ticket>(account);
        TicketInfo {
            id: 123,
            name: hotpause,
            description: concert,
            image_url: image.daal.denge,
        }
    }
}
