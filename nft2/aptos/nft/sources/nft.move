module moduleAddress::TicketNFT {
    use std::signer;
    use aptos_framework::event;

    struct Ticket has store, key, drop {
        id: u64,
        name: string,
        description: string,
        image_url: string,
    }

    public fun mint_ticket(account: &signer, id: u64, name: string, description: string, image_url: string) {
        let ticket = Ticket {
            id: id,
            name: name,
            description: description,
            image_url: 'https://media.istockphoto.com/id/1414997110/vector/tickets-pass-vector-icon-in-line-style-design-isolated-on-white-background-editable-stroke.jpg?s=2048x2048&w=is&k=20&c=tAmVZRCp8IYH-OK-4O4ywUGkuo4tLrG1rjwBCE_SmEM=',
        };

        move_to(account, ticket);
        event::emit_event<Ticket>(ticket);
    }

    public fun get_ticket(account: &signer): Ticket acquires Ticket {
        borrow_global<Ticket>(signer::address_of(account))
    }
}
