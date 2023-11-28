use soroban_sdk::{contracttype, Address, Symbol , String};

#[derive(Clone, Debug)]
#[contracttype]

pub struct DepositEvent {
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

pub struct WithdrawEvent {
    pub method: String,
    pub amount: i128,
    pub token_chain: i128,
    pub to_chain: i128,
    pub withdrawer_Address: Address,
    pub receiver_address: String,
    pub fee: u32,
}
#[derive(Clone, Debug)]
#[contracttype]

pub struct ClaimEvent {
    pub method: String,
    pub Claim_Counter: i128,
    pub user_address: Address,
   
}

#[derive(Clone, Debug)]
#[contracttype]

pub struct ReleaseEvent {
    pub method: String,
    pub Release_Counter: i128,
    pub user_address: Address,
   
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
    DepositEvent,   WithdrawEvent , ClaimEvent , ReleaseEvent,
    Counter (Address),
    ReleaseCounter(Address),
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