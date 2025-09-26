#![cfg_attr(not(any(test, feature = "export-abi")), no_main)]

#[cfg(not(any(test, feature = "export-abi")))]
#[no_mangle]
pub extern "C" fn main() {}

#[cfg(feature = "export-abi")]
fn main() {
    use stylus_sdk::abi::export::print_from_args;
    print_from_args::<vault_factory::VaultFactory>();
}
