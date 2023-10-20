#![no_std]

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, symbol_short, token, vec, Address, Bytes,
    BytesN, ConversionError, Env, IntoVal, String, Symbol, TryFromVal, Val, Vec,
};
mod token_contract {
    soroban_sdk::contractimport!(file = "./token/soroban_token_contract.wasm");
}

//use stellar_strkey::*;
//extern crate std;

mod wrappedtoken;
use wrappedtoken::create_wtoken;

mod types;
use types::*;
mod error;
use error::*;

#[derive(Clone, Copy)]
#[repr(u32)]
pub enum DataKeyToken {
    TokenAdmin,
    NativeToken,
    TokenShare,
}
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
pub enum VerifyError {
    InvalidPublickey = 1,
}
#[derive(Clone, Copy)]
#[repr(u32)]
pub enum DataStore {
    validators,
}
impl TryFromVal<Env, DataKeyToken> for Val {
    type Error = ConversionError;

    fn try_from_val(_env: &Env, v: &DataKeyToken) -> Result<Self, Self::Error> {
        Ok((*v as u32).into())
    }
}

fn compare(env: Env, key_to_compare: &BytesN<32>) -> bool {
    let public_keys: Bytes = [
        246, 218, 101, 129, 232, 167, 143, 203, 7, 56, 128, 246, 179, 252, 231, 103, 195, 128, 34,
        237, 63, 204, 24, 85, 61, 76, 154, 200, 25, 210, 223, 109,
    ]
    .into_val(&env);
    // Replace this with your actual parameter
    // In this example, we're using the key we generated earlier
    //let parameter_bytes: [u8; 32] = public_keys.to_bytes().try_into().unwrap();
    let mut result: Bytes = key_to_compare.into_val(&env);
    // let public: Bytes = public_keys.into_val();
    // Check if the parameter matches any of the stored public keys
    //let is_match = public_keys.iter().any(|&public_key| public_key == result);

    if public_keys == result {
        true
    } else {
        false
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
//fn put_native_token()
fn put_token(e: &Env, contract: Address) {
    e.storage()
        .instance()
        .set(&DataKeyToken::TokenShare, &contract);
}
fn get_token(e: &Env) -> Address {
    e.storage()
        .instance()
        .get(&DataKeyToken::TokenShare)
        .unwrap()
}
fn put_native_token(e: &Env, token: Address) {
    e.storage()
        .instance()
        .set(&DataKeyToken::NativeToken, &token);
}
fn get_native_token(e: &Env) -> Address {
    e.storage()
        .instance()
        .get(&DataKeyToken::NativeToken)
        .unwrap()
}
// fn get_data(env: &)
pub trait SorobanSoloanaBridgeTrait {
    fn deposit(env: Env, from: Address, token: Address, amount: i128, to: String) -> (i128);
    fn admin(env: Env, admin: Address);
    fn createwrappedtoken(env: Env, token_wasm_hash: BytesN<32>, salt: BytesN<32>) -> (Address);
    fn claim(
        env: Env,
        public_key: BytesN<32>,
        message: Bytes,
        signature: BytesN<64>,
        user: Address,
        amount: i128,
    ) -> i128;

    fn withdraw(env: Env, amount: i128, user: Address, to: String) -> (i128);
    fn release(env: Env, user: Address, amount: i128) -> (i128);
    fn upgrade(e: Env, new_wasm_hash: BytesN<32>);
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
        put_native_token(&env, token.clone());
        // //message
        let method: String = "Deposit".into_val(&env);
        let amount: i128 = amount;
        let token_address: Address = token;

        let token_chain: i128 = 456;
        let receiver_address: String = to;
        let from: Address = from;
        let to_chain: i128 = 123;
        let fee: u32 = 100;

        let transfer = Transfer {
            method,
            amount,
            token_address,
            token_chain,
            receiver_address,
            from,
            to_chain,
            fee,
        };
        // //   env.storage().instance().set(&DataKey::Transfer, &transfer);
        let symbol: Symbol = symbol_short!("deposit");

        env.events().publish((DataKey::Transfer, symbol), transfer);
        // //env.events().publish( symbol, transfer);
        balance
    }
    fn admin(env: Env, admin: Address) {
        admin.require_auth();
        set_contract_deployer_address(env, admin);
    }
    fn createwrappedtoken(env: Env, token_wasm_hash: BytesN<32>, salt: BytesN<32>) -> Address {
        let share_contract = create_wtoken(&env, token_wasm_hash, salt);
        let client = wrappedtoken::Client::new(&env, &share_contract);
        client.initialize(
            &env.current_contract_address(),
            &8,
            &"solana".into_val(&env),
            &"WSOL".into_val(&env),
        );
        put_token(&env, share_contract.clone());
        share_contract
    }

    fn claim(
        env: Env,
        public_key: BytesN<32>,
        message: Bytes,
        signature: BytesN<64>,
        user: Address,
        amount: i128,
    ) -> i128 {
        user.require_auth();

        let check = compare(env.clone(), &public_key);
        env.crypto()
            .ed25519_verify(&public_key, &message, &signature);
        if check == true {
            let share_contract = get_token(&env.clone());
            let client = wrappedtoken::Client::new(&env, &share_contract);
            client.mint(&user, &amount);
            let balance = client.balance(&user);
            // //   balance
            1 // if true
        } else {
            //return Err(VerifyError::InvalidPublickey);
            0
        }
        //  Ok(())
    }

    fn withdraw(env: Env, amount: i128, user: Address, to: String) -> i128 {
        user.require_auth();

        let token_address = get_token(&env);

        let client = wrappedtoken::Client::new(&env, &token_address);

        client.burn(&user, &amount);

        let balance = client.balance(&user);

        let method: String = "Withdraw".into_val(&env);

        let amount: i128 = balance;

        let token_chain: i128 = 456;

        let from: String = to;

        let to_chain: i128 = 123;

        let fee: u32 = 100;

        let transfer = Withdraw {
            method,
            amount,
            token_chain,
            from,
            to_chain,
            fee,
        };
        // //   env.storage().instance().set(&DataKey::Transfer, &transfer);
        let symbol: Symbol = symbol_short!("Withdraw");

        env.events().publish((DataKey::Withdraw, symbol), transfer);

        balance
        //0
        // share_contract
    }
    fn release(env: Env, to: Address, amount: i128) -> i128 {
        to.require_auth();
        let token_address = get_native_token(&env);
        let client = token::Client::new(&env, &token_address);
        client.transfer(&env.current_contract_address(), &to, &amount);
        0
    }
    fn upgrade(e: Env, new_wasm_hash: BytesN<32>) {
        // // TODO: Only admin can upgrade this contract
        // let admin: Address = e.storage().instance().get(&DataKey::Admin).unwrap();
        // admin.require_auth();

        e.deployer().update_current_contract_wasm(new_wasm_hash);
    }
}

mod test;
