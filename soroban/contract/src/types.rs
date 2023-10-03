use soroban_sdk::{contracttype, Address, Symbol , String};

#[derive(Clone, Debug)]
#[contracttype]

pub struct Transfer {
    pub amount: i128,
    pub token_address: String,
    pub token_chain: String,
    pub to: String,
    pub to_chain: String,
    pub fee: String,
}

#[derive(Clone)]
#[contracttype]

pub enum DataKey {
    Transfer,
}