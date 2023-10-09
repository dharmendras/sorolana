#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, token, vec, Address, Bytes, BytesN, Env,
    IntoVal, String, Symbol, Val, Vec,
};
mod token_contract {
    soroban_sdk::contractimport!(file = "./token/soroban_token_contract.wasm");
}

//use stellar_strkey::*;
//extern crate std;
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

//const COUNTER: Symbol = symbol_short!("COUNTER");
fn set_contract_deployer_address(env: &Env, admin: Address) {
    env.storage().persistent().set(&Globals::Admin, &admin);
    // env.storage().persistent().bump( &Globals::Admin, 52600);
}
fn get_contract_deployer(env: &Env) -> Address {
    let add: Address = env.storage().persistent().get(&Globals::Admin).unwrap();
    add
}
// fn get_data(env: &)

#[contract]
pub struct SorobanSoloanaBridge;

#[contractimpl]
impl SorobanSoloanaBridge {
    pub fn deposit(env: Env, from: Address, token: Address, amount: i128) -> i128 {
        from.require_auth();

        // // Transfer token from `from` to this contract address.
        let x = token::Client::new(&env, &token);
        x.transfer(&from, &env.current_contract_address(), &amount);

        let balance = x.balance(&env.current_contract_address());

        //message
        let amount: i128 = amount;
        let token_address: String =
            "CB5ABZGAAFXZXB7XHAQT6SRT6JXH2TLIDVVHJVBEJEGD2CQAWNFD7D2U".into_val(&env);
        let token_chain: i128 = 1234;
        let to: String = "to".into_val(&env);
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
        let symbol: Symbol = symbol_short!("deposit");

        env.events().publish((DataKey::Transfer, symbol), transfer);
        balance
    }

    pub fn createcustomtoken(env: Env, token_wasm_hash: BytesN<32>, salt: BytesN<32>) -> Address {
        // let admin_address = get_contract_deployer(&env);
        // let admin_address1 = get_contract_deployer(&env);
        let wrapped_token = env
            .deployer()
            .with_address(env.current_contract_address(), salt)
            .deploy(token_wasm_hash);

        let client = token_contract::Client::new(&env, &wrapped_token);
        client.initialize(
            &env.current_contract_address(),
            &8,
            &"solana".into_val(&env),
            &"sol".into_val(&env),
        );

        wrapped_token
    }
    pub fn claim(env: Env, public_key: BytesN<32>, message: Bytes, signature: BytesN<64> , token_address: Address) -> i128 {
        env.crypto()
            .ed25519_verify(&public_key, &message, &signature);
        let client = token_contract::Client::new(&env, &token_address);
        client.mint(&env.current_contract_address(), &10);

        0
        //  wrapped_token
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
