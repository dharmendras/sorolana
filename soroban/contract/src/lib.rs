#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, token, vec, Address, Bytes, BytesN,
    ConversionError, Env, IntoVal, String, Symbol, TryFromVal, Val, Vec,
};
mod token_contract {
    soroban_sdk::contractimport!(file = "./token/soroban_token_contract.wasm");
}

//use stellar_strkey::*;
//extern crate std;
mod customtoken;

use customtoken::create_contract;

mod types;
use types::*;
mod error;
use error::*;

#[derive(Clone, Copy)]
#[repr(u32)]
pub enum DataKeyToken {
    TokenAdmin,

    TokenShare,
}
impl TryFromVal<Env, DataKeyToken> for Val {
    type Error = ConversionError;

    fn try_from_val(_env: &Env, v: &DataKeyToken) -> Result<Self, Self::Error> {
        Ok((*v as u32).into())
    }
}

fn set_contract_deployer_address(env: Env, admin: Address) {
    env.storage()
        .persistent()
        .set(&DataKeyToken::TokenAdmin, &admin);
    // env.storage().persistent().bump( &Globals::Admin, 52600);
}
fn get_contract_deployer(env: &Env) -> Address {
    let add: Address = env
        .storage()
        .persistent()
        .get(&DataKeyToken::TokenAdmin)
        .unwrap();
    add
}
fn put_token_share(e: &Env, contract: Address) {
    e.storage()
        .instance()
        .set(&DataKeyToken::TokenShare, &contract);
}
fn get_token_share(e: &Env) -> Address {
    e.storage()
        .instance()
        .get(&DataKeyToken::TokenShare)
        .unwrap()
}
// fn get_data(env: &)
pub trait SorobanSoloanaBridgeTrait {
    fn deposit(env: Env, from: Address, token: Address, amount: i128, to: String) -> (i128);
    fn admin(env: Env, admin: Address);
    fn createcustomtoken(env: Env, token_wasm_hash: BytesN<32>, salt: BytesN<32>) -> (Address);
    fn claim(
        env: Env,
        public_key: BytesN<32>,
        message: Bytes,
        signature: BytesN<64>,
        user: Address,
        amount: i128,
    ) -> (i128);
    fn withdraw(env: Env, amount: i128, user: Address) -> (i128);
}
#[contract]
struct SorobanSoloanaBridge;

#[contractimpl]
impl SorobanSoloanaBridgeTrait for SorobanSoloanaBridge {
    fn deposit(env: Env, from: Address, token: Address, amount: i128, to: String) -> i128 {
        from.require_auth();

        // // Transfer token from `from` to this contract address.
        let client = token::Client::new(&env, &token);
        client.transfer(&from, &env.current_contract_address(), &amount);

        let balance = client.balance(&env.current_contract_address());

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
    fn admin(env: Env, admin: Address) {
        set_contract_deployer_address(env, admin);
    }
    fn createcustomtoken(env: Env, token_wasm_hash: BytesN<32>, salt: BytesN<32>) -> Address {
        let admin_address = get_contract_deployer(&env);
        // let admin_address1 = get_contract_deployer(&env);
        admin_address.require_auth();
        let wrapped_token = env
            .deployer()
            .with_address(admin_address.clone(), salt)
            .deploy(token_wasm_hash);

        let client = customtoken::Client::new(&env, &wrapped_token.clone());
        client.initialize(
            &admin_address.clone(),
            &8,
            &"solana".into_val(&env),
            &"SOURCESOL".into_val(&env),
        );
        let add = wrapped_token;
        put_token_share(&env, add.clone());
        add
    }

    fn claim(
        env: Env,
        public_key: BytesN<32>,
        message: Bytes,
        signature: BytesN<64>,
        user: Address,
        amount: i128,
    ) -> i128 {
        env.crypto()
            .ed25519_verify(&public_key, &message, &signature);
        // let client: token_contract::Client<'_> = token_contract::Client::new(&env, &token_address);
        //  user.require_auth();
        let share_contract = get_token_share(&env);
        let admin_address = get_contract_deployer(&env);
        // let admin_address1 = get_contract_deployer(&env);
        admin_address.require_auth();
        let client = customtoken::Client::new(&env, &share_contract);
        client.mint(&user, &amount);
        let balance = client.balance(&user);
        balance
        // 0
        //  wrapped_token
    }
    fn withdraw(env: Env, amount: i128, user: Address) -> i128 {
        let share_contract = get_token_share(&env);
        let admin_address = get_contract_deployer(&env);
        user.require_auth();
        admin_address.require_auth();
        let client = customtoken::Client::new(&env, &share_contract);

        client.burn(&user, &amount);

        let balance = client.balance(&user);

        balance
    }
}

mod test;
