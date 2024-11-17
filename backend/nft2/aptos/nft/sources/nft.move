module 0xa1220646a44eea69225e2a387aaec4a2460b5d70d89b1c189a6d0b4bdec273aa::MyModule {
    use std::signer;

    struct MyResource has key {
        value: u64
    }

    public fun initialize(account: &signer) {
        move_to(account, MyResource { value: 0 });
    }

    public fun increment_value(account: &signer) acquires MyResource {
        let resource = borrow_global_mut<MyResource>(signer::address_of(account));
        resource.value = resource.value + 1;
    }
}