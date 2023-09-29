use soroban_sdk::{contracttype, Address, Symbol , String};

#[derive(Clone, Debug)]
#[contracttype]

pub struct Transfer {
    pub amount: i128,
    pub token_address: Address,
    pub token_chain: i128,
    pub to: String,
    pub to_chain: i128,
    pub fee: u32,
}

#[derive(Clone)]
#[contracttype]

pub enum DataKey {
    Transfer,
}