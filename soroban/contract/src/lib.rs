#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, token, vec, Address, Bytes, BytesN, Env, IntoVal, String,
    Symbol, Val, Vec,
};
mod token_contract {
    soroban_sdk::contractimport!(file = "./token/soroban_token_contract.wasm");
}

//use stellar_strkey::*;
// extern crate std;
mod types;
use types::*;
mod error;
use error::*;

pub struct TokenMap {
    pub token_add: Address,
}
#[derive(Clone)]
#[contracttype]

pub enum DataKey1 {
    val,
}
#[derive(Clone)]
#[contracttype]
pub enum Globals {
    Admin,
    TokenAddress,
}
 fn create_custom_Token(env: Env, wasm_hash: BytesN<32>, salt: BytesN<32>) -> Address {
    // let admin_address = get_contract_deployer(&env);
    // let admin_address1 = get_contract_deployer(&env);
    let wrapped_token = env
        .deployer()
        .with_address(env.current_contract_address(), salt)
        .deploy(wasm_hash);
    let add1: Address = wrapped_token;
    //  std::println!("wrapped_token {:?}", wrapped_token);
    let name: String = "Zafar".into_val(&env);
    let symbol: String = "zaf".into_val(&env);
    let token_client = token_contract::Client::new(&env, &add1);
    let current_contract_address = env.current_contract_address();
    token_client.initialize(&current_contract_address, &10, &name, &symbol);
    env.storage()
        .persistent()
        .set(&Globals::TokenAddress, &add1);

    add1
}
//const COUNTER: Symbol = symbol_short!("COUNTER");
fn set_contract_deployer_address(env: &Env, admin: Address) {
    env.storage().persistent().set(&Globals::Admin, &admin);
    // env.storage().persistent().bump( &Globals::Admin, 52600);
}
fn get_contract_deployer(env: &Env) -> Address {
    let add: Address = env.storage().persistent().get(&Globals::Admin).unwrap();
    add
}

#[contract]
pub struct SorobanSoloanaBridge;

#[contractimpl]
impl SorobanSoloanaBridge {
    pub fn deposit(env: Env, from: Address, token: Address, amount: i128, to: String) {
        from.require_auth();

        // Transfer token from `from` to this contract address.
        let x = token::Client::new(&env, &token);
        x.transfer(&from, &env.current_contract_address(), &amount);
        x.balance(&from);
          //message
          let amount: i128 = amount;
          let token_address: Address = token;
          let token_chain: i128 = 1234;
          let to: String = to;
          let to_chain: i128 = 6789;
          let fee: u32 = 100;
  
          let transfer = Transfer {
              amount,
              token_address,
              token_chain,
              to,
              to_chain,
              fee,
          };
          env.storage().instance().set(&DataKey::Transfer, &transfer);
  
          env.events()
              .publish((DataKey::Transfer, Symbol::short("deposit")), transfer);
    }
    pub fn set_admin(env: Env, admin: Address) -> Address {
        set_contract_deployer_address(&env, admin);
        let admin_address = get_contract_deployer(&env);
        //   std::println!(" admin address {:?}" , admin_address);
        admin_address
    }
  
    pub fn claim(
        env: Env,
        public_key: BytesN<32>,
        message: Bytes,
        signature: BytesN<64>,
        user: Address,
        amount: i128,
        wasm_hash: BytesN<32>,
        salt: BytesN<32>,
    ) {
    env.crypto().ed25519_verify(&public_key, &message, &signature);
    create_custom_Token(env.clone(), wasm_hash, salt);
        let add: Address = env
            .storage()
            .persistent()
            .get(&Globals::TokenAddress)
            .unwrap();
        let token_client = token_contract::Client::new(&env, &add);
        token_client.mint(&user, &amount);
        let balance = token_client.balance(&user);
    }
    pub fn withdraw(env: Env, amount: i128, user: Address) -> i128 {
        let add: Address = env
            .storage()
            .persistent()
            .get(&Globals::TokenAddress)
            .unwrap();
        let token_client = token_contract::Client::new(&env, &add);
        token_client.burn(&user, &10);
        let balance = token_client.balance(&env.current_contract_address());

        balance
    }
}

mod test;
