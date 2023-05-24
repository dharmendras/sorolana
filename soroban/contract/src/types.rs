use soroban_sdk::{contracttype, Address, Symbol};

#[derive(Clone, Debug)]
#[contracttype]

pub struct Transfer {
    pub amount: i128,
    pub token_address: Symbol,
    pub token_chain: i128,
    pub to: Symbol,
    pub to_chain: i128,
    pub fee: u32,
}

#[derive(Clone)]
#[contracttype]

pub enum DataKey {
    Transfer,
}