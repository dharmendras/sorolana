#![no_std]
use soroban_sdk::{
    contractimpl, contracttype, vec, Address, Bytes, BytesN, Env, IntoVal, Symbol, Vec,panic_with_error,
};
mod types;
use types::*;
mod  error;
use  error::*;
mod token {
    soroban_sdk::contractimport!(file = "./soroban_token_contract.wasm");
}
pub struct SorobanSoloanaBridge;
#[contractimpl]
impl SorobanSoloanaBridge { 
    pub fn deposit(
        env: Env,
        token_id: BytesN<32>,
        user: Address,
        amount: i128,
        
    ) -> Transfer{
        //user.require_auth();

        let amount: i128 = 100;

        let token_address: Symbol = Symbol::short("hello");
        let token_chain: i128 = 1234;
        let to: Symbol = Symbol::short("s");
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
        env.storage().set(&DataKey::Transfer, &transfer);
        env.events()
            .publish((DataKey::Transfer, Symbol::short("deposit")), transfer);

        let token_client = token::Client::new(&env, &token_id);

       //token_client.xfer(&user, &env.current_contract_address(), &amount);

              
         let result  = env.storage().get(&DataKey::Transfer);

            

         match result{
             Some(Ok(results)) => results,
             _ => panic_with_error!(&env, Error::TransferNotFound),
         }
    }
}