use soroban_sdk::{contracttype, Address, Symbol , String};

#[derive(Clone, Debug)]
#[contracttype]

pub struct Transfer {
    pub method: String,
    pub amount: i128,
    pub token_address: Address,
    pub token_chain: i128,
    pub receiver_address: String,
    pub from: Address,
    pub to_chain: i128,
    pub fee: u32,
}

#[derive(Clone, Debug)]
#[contracttype]

pub struct Withdraw {
    pub method: String,
    pub amount: i128,

    pub token_chain: i128,
    pub from: String,
    pub to_chain: i128,
    pub fee: u32,
}
#[derive(Clone, Debug)]
#[contracttype]

pub struct TestTransfer {
    pub amount: i128,
   
}
#[derive(Clone, Debug)]
#[contracttype]
pub struct Customtokenstruct {
   pub custom_token: Address,
 }
#[derive(Clone)]
#[contracttype]

pub enum DataKey {
    Transfer, Withdraw
}
#[derive(Clone)]
#[contracttype]
pub enum TokenKey{ 
    Customtokenstruct
}

#[derive(Clone)]
#[contracttype]

pub enum TestDataKey {
    TestTransfer,
}