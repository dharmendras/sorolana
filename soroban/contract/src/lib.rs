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
    USER_ALREADY_CLAIMED = 2,
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

const CURRENT_VALIDATOR: [&str; 4] = [
    "9tplgeinj8sHOID2s/znZ8OAIu0/zBhVPUyayBnS320=",
    "WMJN8yXuwl2vDFH+XSOavdKG1DdbBWOQe7rQzmhgPuI=",
    "dhuypGVkMF4cWvFO+h9XsHuiBe8RH+bawNzhQkTK5bk=",
    "oPAOzqSzSjDhFpcl3+awVhYvnOFr8Bw7YMBSWcgEQJo=",
];
const ONE_DAY_LEDGER: u32 = 17280;
const HIGH_WATERFALL: u32 = 30 * ONE_DAY_LEDGER;
const LOW_WATERFALL: u32 = HIGH_WATERFALL - ONE_DAY_LEDGER;

fn compare_validator_public_key(env: Env, key_to_compare: BytesN<32>) -> bool {
    let mut result: Bytes = key_to_compare.into_val(&env);
    let validator_pubkey: Bytes = [
        246, 218, 101, 129, 232, 167, 143, 203, 7, 56, 128, 246, 179, 252, 231, 103, 195, 128, 34,
        237, 63, 204, 24, 85, 61, 76, 154, 200, 25, 210, 223, 109,
    ]
    .into_val(&env);
    let mut IS_TRUE: bool = false;

    if validator_pubkey == result {
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

    env.storage()
        .persistent()
        .bump(&DataKeyToken::TokenAdmin, LOW_WATERFALL, HIGH_WATERFALL);
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
        .persistent()
        .set(&DataKeyToken::TokenShare, &contract);

    e.storage()
        .persistent()
        .bump(&DataKeyToken::TokenShare, LOW_WATERFALL, HIGH_WATERFALL);
}
fn get_token(e: &Env) -> Address {
    e.storage()
        .persistent()
        .get(&DataKeyToken::TokenShare)
        .unwrap()
}
fn put_native_token(e: &Env, token: Address) {
    e.storage()
        .persistent()
        .set(&DataKeyToken::NativeToken, &token);

    e.storage()
        .persistent()
        .bump(&DataKeyToken::NativeToken, LOW_WATERFALL, HIGH_WATERFALL);
}
fn get_native_token(e: &Env) -> Address {
    e.storage()
        .persistent()
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
    ) -> Result<(), VerifyError>;

    fn withdraw(env: Env, amount: i128, user: Address, to: String) -> (i128);
    fn release(
        env: Env,
        // public_key: BytesN<32>,
        // message: Bytes,
        // signature: BytesN<64>,
        user: Address,
        amount: i128,
    ) -> (i128);
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

        let depositevent = DepositEvent {
            method,
            amount,
            token_address,
            token_chain,
            receiver_address,
            from,
            to_chain,
            fee,
        };
        // //   env.storage().persistent().set(&DataKey::Transfer, &transfer);
        let symbol: Symbol = symbol_short!("deposit");

        env.events()
            .publish((DataKey::DepositEvent, symbol), depositevent);
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
            &9,
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
    ) -> Result<(), VerifyError> {
        user.require_auth();

        let counter_bytes: Bytes = message.slice(11..=11);

        let counter: i128 = 0;

        let mut random_address: [u8; 100] = [0u8; 100];
        let (sl, _) = random_address.split_at_mut(counter_bytes.len() as usize);
        counter_bytes.copy_into_slice(sl);

        let counter_str = core::str::from_utf8(sl).unwrap();
        let parse_counter: i128 = counter_str.parse().unwrap();

        let is_available = env
            .storage()
            .persistent()
            .has(&DataKey::Counter((user.clone())));

        if is_available {
            let mut get_user_counter: i128 = env
                .storage()
                .persistent()
                .get(&DataKey::Counter((user.clone())))
                .unwrap();

            if parse_counter == get_user_counter {
                let check = compare_validator_public_key(env.clone(), public_key.clone());

                if check == true {
                    env.crypto()
                        .ed25519_verify(&public_key, &message, &signature);

                    let token_address = get_token(&env.clone());
                    let client = wrappedtoken::Client::new(&env, &token_address);
                    client.mint(&user.clone(), &amount);

                    get_user_counter += 1;

                    env.storage()
                        .persistent()
                        .set(&DataKey::Counter((user.clone())), &get_user_counter);
              
                        let method: String = "claim".into_val(&env);
                        let Claim_Counter: i128 =  get_user_counter;
                        let user_address: Address = user;

                        let claim_event = ClaimEvent {
                            method,
                            Claim_Counter,
                            user_address,
                        };
        
                        let symbol: Symbol = symbol_short!("Claim");
        
                        env.events()
                            .publish((DataKey::ClaimEvent, symbol), claim_event);
                } else {
                    // validator public key not valid
                }

                Ok(())
            } else {
                //     // parse counter does not matched
                //return -1
                return Err(VerifyError::USER_ALREADY_CLAIMED);
            }
        } else {
            env.storage()
                .persistent()
                .set(&DataKey::Counter((user.clone())), &counter);

            let mut get_user_counter: i128 = env
                .storage()
                .persistent()
                .get(&DataKey::Counter((user.clone())))
                .unwrap();
            if parse_counter == get_user_counter {
                let check = compare_validator_public_key(env.clone(), public_key.clone());

                if check == true {
                    env.crypto()
                        .ed25519_verify(&public_key, &message, &signature);

                    let token_address = get_token(&env.clone());
                    let client = wrappedtoken::Client::new(&env, &token_address);
                    client.mint(&user.clone(), &amount);

                    get_user_counter += 1;

                    env.storage()
                        .persistent()
                        .set(&DataKey::Counter((user.clone())), &get_user_counter);
              
                        let method: String = "claim".into_val(&env);
                        let Claim_Counter: i128 =  counter;
                        let user_address: Address = user;

                        let claim_event = ClaimEvent {
                            method,
                            Claim_Counter,
                            user_address,
                        };
        
                        let symbol: Symbol = symbol_short!("Claim");
        
                        env.events()
                            .publish((DataKey::ClaimEvent, symbol), claim_event);
                } else {
                    // validator public key not valid
                }

                Ok(())
            } else {
                //     // parse counter does not matched
                //return -1
                return Err(VerifyError::USER_ALREADY_CLAIMED);
            }
          
        }
    }

    fn withdraw(env: Env, amount: i128, user: Address, recipient: String) -> i128 {
        user.require_auth();

        let token_address = get_token(&env);

        let client = wrappedtoken::Client::new(&env, &token_address);

        client.burn(&user, &amount);

        let balance = client.balance(&user);

        let method: String = "Withdraw".into_val(&env);

        let amount: i128 = amount;

        let token_chain: i128 = 456;
        let to_chain: i128 = 123;

        let withdrawer_Address: Address = user;
        let receiver_address: String = recipient;

        let fee: u32 = 100;

        let withdrawevent = WithdrawEvent {
            method,
            amount,
            token_chain,
            to_chain,
            withdrawer_Address,
            receiver_address,
            fee,
        };
        // //   env.storage().persistent().set(&DataKey::Transfer, &transfer);
        let symbol: Symbol = symbol_short!("Withdraw");

        env.events()
            .publish((DataKey::WithdrawEvent, symbol), withdrawevent);

        balance

        // share_contract
    }

    fn release(
        env: Env,
        // public_key: BytesN<32>,
        // message: Bytes,
        // signature: BytesN<64>,
        receipent: Address,
        amount: i128,
    ) -> i128 {
        receipent.require_auth();

        // let counter_bytes: Bytes = message.slice(11..=11);

        // let mut random_address: [u8; 100] = [0u8; 100];
        // let (sl, _) = random_address.split_at_mut(counter_bytes.len() as usize);
        // counter_bytes.copy_into_slice(sl);

        // let counter_str = core::str::from_utf8(sl).unwrap();
        // let parse_counter: i128 = counter_str.parse().unwrap();

        // let mut get_user_counter: i128 = env
        //     .storage()
        //     .persistent()
        //     .get(&DataKey::Counter((receipent.clone())))
        //     .unwrap();

        //  if parse_counter == get_user_counter {
        //   let check = compare_validator_public_key(env.clone(), public_key.clone());

        //   if check == true {
        // env.crypto()
        //     .ed25519_verify(&public_key, &message, &signature);

        let token_address = get_native_token(&env);
        let client = token::Client::new(&env, &token_address);
        client.transfer(&env.current_contract_address(), &receipent, &amount);

        // get_user_counter = get_user_counter + 1;

        // env.storage()
        //     .persistent()
        //     .set(&DataKey::Counter((receipent.clone())), &get_user_counter);
        //  }
        //}

        0
    }
    fn upgrade(e: Env, new_wasm_hash: BytesN<32>) {
        // // TODO: Only admin can upgrade this contract
        // let admin: Address = e.storage().persistent().get(&DataKey::Admin).unwrap();
        // admin.require_auth();

        e.deployer().update_current_contract_wasm(new_wasm_hash);
    }
}

mod test;
