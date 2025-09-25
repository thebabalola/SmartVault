use alloc::{string::String, vec::Vec};
use core::marker::PhantomData;
use stylus_sdk::{
    alloy_primitives::{Address, U256},
    alloy_sol_types::sol,
    prelude::*,
};

pub trait Erc20Params {
    const NAME: &'static str;
    const SYMBOL: &'static str;
    const DECIMALS: u8;
}

sol_storage! {
    /// Erc20 implements all ERC-20 methods.
    pub struct Erc20<T> {
        /// Maps users to balances
        mapping(address => uint256) balances;
        /// Maps users to a mapping of each spender's allowance
        mapping(address => mapping(address => uint256)) allowances;
        /// The total supply of the token
        uint256 total_supply;
        /// Used to allow [`Erc20Params`]
        PhantomData<T> phantom;
    }
}

// Declare events and Solidity error types
sol! {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    error InsufficientBalance(address from, uint256 have, uint256 want);
    error InsufficientAllowance(address owner, address spender, uint256 have, uint256 want);
}

pub enum Erc20Error {
    InsufficientBalance(InsufficientBalance),
    InsufficientAllowance(InsufficientAllowance),
}

// We will soon provide a #[derive(SolidityError)] to clean this up
impl From<Erc20Error> for Vec<u8> {
    fn from(err: Erc20Error) -> Vec<u8> {
        match err {
            Erc20Error::InsufficientBalance(e) => e.abi_encode(),
            Erc20Error::InsufficientAllowance(e) => e.abi_encode(),
        }
    }
}

// These methods aren't exposed to other contracts
impl<T: Erc20Params> Erc20<T> {
    pub fn transfer_impl(
        &mut self,
        from: Address,
        to: Address,
        value: U256,
    ) -> Result<(), Erc20Error> {
        let old_sender_balance = self.balances.get(from);
        if old_sender_balance < value {
            return Err(Erc20Error::InsufficientBalance(InsufficientBalance {
                from,
                have: old_sender_balance,
                want: value,
            }));
        }
        self.balances.get(from).set(old_sender_balance - value);
        let new_to_balance = self.balances.get(to) + value;
        self.balances.get(to).set(new_to_balance);
        // Note: Event logging would be handled by the VM in a real implementation
        Ok(())
    }

    pub fn mint(&mut self, address: Address, value: U256) {
        let new_balance = self.balances.get(address) + value;
        self.balances.get(address).set(new_balance);
        self.total_supply.set(self.total_supply.get() + value);
        // Note: Event logging would be handled by the VM in a real implementation
    }

    pub fn burn(&mut self, address: Address, value: U256) -> Result<(), Erc20Error> {
        let old_balance = self.balances.get(address);
        if old_balance < value {
            return Err(Erc20Error::InsufficientBalance(InsufficientBalance {
                from: address,
                have: old_balance,
                want: value,
            }));
        }
        self.balances.get(address).set(old_balance - value);
        self.total_supply.set(self.total_supply.get() - value);
        // Note: Event logging would be handled by the VM in a real implementation
        Ok(())
    }
}

// These methods are external to other contracts
#[public]
impl<T: Erc20Params> Erc20<T> {
    pub fn name() -> Result<String, Erc20Error> {
        Ok(T::NAME.into())
    }

    pub fn symbol() -> Result<String, Erc20Error> {
        Ok(T::SYMBOL.into())
    }

    pub fn decimals() -> Result<u8, Erc20Error> {
        Ok(T::DECIMALS)
    }

    pub fn balance_of(&self, address: Address) -> Result<U256, Erc20Error> {
        Ok(self.balances.get(address))
    }

    pub fn transfer(&mut self, to: Address, value: U256) -> Result<bool, Erc20Error> {
        let from = self.vm().msg_sender();
        self.transfer_impl(from, to, value)?;
        Ok(true)
    }

    pub fn approve(&mut self, spender: Address, value: U256) -> Result<bool, Erc20Error> {
        let owner = self.vm().msg_sender();
        self.allowances.get(owner).set(spender, value);
        // Note: Event logging would be handled by the VM in a real implementation
        Ok(true)
    }

    pub fn transfer_from(
        &mut self,
        from: Address,
        to: Address,
        value: U256,
    ) -> Result<bool, Erc20Error> {
        let spender = self.vm().msg_sender();
        let old_allowance = self.allowances.get(from).get(spender);
        if old_allowance < value {
            return Err(Erc20Error::InsufficientAllowance(InsufficientAllowance {
                owner: from,
                spender,
                have: old_allowance,
                want: value,
            }));
        }
        self.allowances.get(from).set(spender, old_allowance - value);
        self.transfer_impl(from, to, value)?;
        Ok(true)
    }

    pub fn allowance(&self, owner: Address, spender: Address) -> Result<U256, Erc20Error> {
        Ok(self.allowances.get(owner).get(spender))
    }

    pub fn total_supply(&self) -> U256 {
        self.total_supply.get()
    }
}