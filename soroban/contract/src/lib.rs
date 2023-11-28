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
fn parse_message_data(env: Env, amt: &str) -> i128 {
    match amt.parse::<i128>() {
        Ok(parsed_i128) => {
            return parsed_i128;
        }
        Err(e) => 0,
    }
}
fn compare_validator_public_key(env: Env, key_to_compare: BytesN<32>) -> bool {
    let mut result: Bytes = key_to_compare.into_val(&env);
    let validator_pubkey: Bytes = [
        145, 80, 124, 140, 241, 153, 140, 40, 104, 118, 96, 144, 102, 69, 253, 3, 113, 6, 42, 52,
        133, 84, 200, 196, 143, 140, 72, 54, 35, 68, 204, 160,
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
fn put_token(e: &Env, token_address: Address) {
    e.storage()
        .persistent()
        .set(&DataKeyToken::TokenShare, &token_address);

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

    // e.storage()
    // .persistent()
    // .bump(&token, LOW_WATERFALL, HIGH_WATERFALL);
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
    ) -> Result<(), VerifyError>;

    fn withdraw(env: Env, amount: i128, user: Address, to: String) -> (i128);
    fn release(
        env: Env,

        public_key: BytesN<32>,
        message: Bytes,
        signature: BytesN<64>,
        receipent: Address,
    ) -> Result<(), VerifyError>;
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
        //   env.events().publish( symbol, transfer);
        balance
    }
    fn admin(env: Env, admin: Address) {
        admin.require_auth();
        set_contract_deployer_address(env, admin);
    }
    fn createwrappedtoken(env: Env, token_wasm_hash: BytesN<32>, salt: BytesN<32>) -> Address {
        let token_address = create_wtoken(&env, token_wasm_hash, salt);
        let client = wrappedtoken::Client::new(&env, &token_address);
        client.initialize(
            &env.current_contract_address(),
            &9,
            &"solana".into_val(&env),
            &"WSOL".into_val(&env),
        );
        put_token(&env, token_address.clone());
        token_address
    }

    fn claim(
        env: Env,
        public_key: BytesN<32>,
        message: Bytes,
        signature: BytesN<64>,
        user: Address,
    ) -> Result<(), VerifyError> {
        user.require_auth();
        //   let copy_msg: Bytes = message.clone();

        let counter: i128 = 0;

        let mut s: [u8; 500] = [0; 500];
        let (sl1, _) = s.split_at_mut(message.len() as usize);
        message.copy_into_slice(sl1); // <- got your slice into sl

        // // Deserialize
        let (msg, _) = serde_json_core::from_slice::<Message>(sl1).unwrap();
        let parse_counter: i128 = parse_message_data(env.clone(), msg.counter);
        let amount: i128 = parse_message_data(env.clone(), msg.amount);

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

                    let method: String = "claim".into_val(&env);
                    let Claim_Counter: i128 = get_user_counter;
                    let user_address: Address = user.clone();

                    let claim_event = ClaimEvent {
                        method,
                        Claim_Counter,
                        user_address,
                    };

                    let symbol: Symbol = symbol_short!("Claim");

                    env.events()
                        .publish((DataKey::ClaimEvent, symbol), claim_event);
                    get_user_counter += 1;

                    env.storage()
                        .persistent()
                        .set(&DataKey::Counter((user.clone())), &get_user_counter);

                    env.storage().persistent().bump(
                        &DataKey::Counter(user.clone()),
                        LOW_WATERFALL,
                        HIGH_WATERFALL,
                    );
                    Ok(())
                } else {
                    // validator public key not valid
                    return Err(VerifyError::InvalidPublickey);

                }

               // Ok(())
            } else {
               return Err(VerifyError::USER_ALREADY_CLAIMED);
            }
        } else {
            env.storage()
                .persistent()
                .set(&DataKey::Counter((user.clone())), &counter);

            //     env.storage().persistent().bump(
            //         &DataKey::Counter(user.clone()),
            //         LOW_WATERFALL,
            //         HIGH_WATERFALL,
            //     );

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
                    //client.mint(&user.clone(), &amount);
                    client.mint(&user.clone(), &amount);

                    get_user_counter += 1;

                    env.storage()
                        .persistent()
                        .set(&DataKey::Counter((user.clone())), &get_user_counter);

                    env.storage().persistent().bump(
                        &DataKey::Counter(user.clone()),
                        LOW_WATERFALL,
                        HIGH_WATERFALL,
                    );

                    let method: String = "claim".into_val(&env);
                    let Claim_Counter: i128 = counter;
                    let user_address: Address = user;

                    let claim_event = ClaimEvent {
                        method,
                        Claim_Counter,
                        user_address,
                    };

                    let symbol: Symbol = symbol_short!("Claim");

                    env.events()
                        .publish((DataKey::ClaimEvent, symbol), claim_event);
                    Ok(())
                } else {
                    // validator public key not valid
                    return Err(VerifyError::InvalidPublickey);

                }

              //  
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
        public_key: BytesN<32>,
        message: Bytes,
        signature: BytesN<64>,
        receipent: Address,
    ) -> Result<(), VerifyError> {
        receipent.require_auth();
        let counter: i128 = 0;

        let mut s: [u8; 500] = [0; 500];
        let (sl1, _) = s.split_at_mut(message.len() as usize);
        message.copy_into_slice(sl1); // <- got your slice into sl

        // // Deserialize
        let (msg, _) = serde_json_core::from_slice::<Message>(sl1).unwrap();
        let parse_counter: i128 = parse_message_data(env.clone(), msg.counter);
        let amount: i128 = parse_message_data(env.clone(), msg.amount);

        let is_available = env
            .storage()
            .persistent()
            .has(&DataKey::ReleaseCounter((receipent.clone())));

        if is_available {
            let mut get_user_counter: i128 = env
                .storage()
                .persistent()
                .get(&DataKey::ReleaseCounter((receipent.clone())))
                .unwrap();

            if parse_counter == get_user_counter {
                let check = compare_validator_public_key(env.clone(), public_key.clone());

                if check == true {
                    env.crypto()
                        .ed25519_verify(&public_key, &message, &signature);
                    let token_address = get_native_token(&env);
                    let client = token::Client::new(&env, &token_address);
                    client.transfer(&env.current_contract_address(), &receipent, &amount);

                    let method: String = "release".into_val(&env);
                    let Release_Counter: i128 = get_user_counter;
                    let user_address: Address = receipent.clone();

                    let release_event = ReleaseEvent {
                        method,
                        Release_Counter,
                        user_address,
                    };

                    let symbol: Symbol = symbol_short!("Release");

                    env.events()
                        .publish((DataKey::ReleaseEvent, symbol), release_event);

                    get_user_counter += 1;

                    env.storage().persistent().set(
                        &DataKey::ReleaseCounter((receipent.clone())),
                        &get_user_counter,
                    );

                    env.storage().persistent().bump(
                        &DataKey::ReleaseCounter(receipent.clone()),
                        LOW_WATERFALL,
                        HIGH_WATERFALL,
                    );
                    //   return get_user_counter;
                    Ok(())
                } else {
                    // validator public key not valid
                    return Err(VerifyError::InvalidPublickey);
                }

                // Ok(())
            } else {
                //   return -1;
                return Err(VerifyError::USER_ALREADY_CLAIMED);
            }
        } else {
            env.storage()
                .persistent()
                .set(&DataKey::ReleaseCounter((receipent.clone())), &counter);

            //     env.storage().persistent().bump(
            //         &DataKey::ReleaseCounter(user.clone()),
            //         LOW_WATERFALL,
            //         HIGH_WATERFALL,
            //     );

            let mut get_user_counter: i128 = env
                .storage()
                .persistent()
                .get(&DataKey::ReleaseCounter((receipent.clone())))
                .unwrap();
            if parse_counter == get_user_counter {
                let check = compare_validator_public_key(env.clone(), public_key.clone());

                if check == true {
                    env.crypto()
                        .ed25519_verify(&public_key, &message, &signature);
                    let token_address = get_native_token(&env);
                    let client = token::Client::new(&env, &token_address);
                    client.transfer(&env.current_contract_address(), &receipent, &amount);

                    get_user_counter += 1;

                    let method: String = "rlaim".into_val(&env);
                    let Release_Counter: i128 = counter;
                    let user_address: Address = receipent.clone();

                    let release_event = ReleaseEvent {
                        method,
                        Release_Counter,
                        user_address,
                    };

                    let symbol: Symbol = symbol_short!("Release");

                    env.events()
                        .publish((DataKey::ReleaseEvent, symbol), release_event);

                    env.storage().persistent().set(
                        &DataKey::ReleaseCounter((receipent.clone())),
                        &get_user_counter,
                    );

                    env.storage().persistent().bump(
                        &DataKey::ReleaseCounter(receipent.clone()),
                        LOW_WATERFALL,
                        HIGH_WATERFALL,
                    );
                    //   return get_user_counter;
                    Ok(())
                } else {
                    // validator public key not valid
                    return Err(VerifyError::InvalidPublickey);
                }
            } else {
                //     // parse counter does not matched
                //return -1
                return Err(VerifyError::USER_ALREADY_CLAIMED);
            }
        }
    }
    fn upgrade(e: Env, new_wasm_hash: BytesN<32>) {
        // // TODO: Only admin can upgrade this contract
        // let admin: Address = e.storage().persistent().get(&DataKey::Admin).unwrap();
        // admin.require_auth();

        e.deployer().update_current_contract_wasm(new_wasm_hash);
    }
}
#[derive(serde::Deserialize)]
pub struct Message<'a> {
    counter: &'a str,
    tokenAddress: &'a str,
    tokenChain: u32,
    to: &'a str,
    toChain: u32,
    fee: u32,
    method: &'a str,
    amount: &'a str,
}

mod test;
