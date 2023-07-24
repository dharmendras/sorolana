
#![no_std]

use soroban_sdk::{contract, contractimpl, token, Address, Env, IntoVal , Symbol};
mod token_contract {
    soroban_sdk::contractimport!(file = "./token/soroban_token_contract.wasm");
}
mod types;
use types::*;
mod  error;
use  error::*;
//const COUNTER: Symbol = symbol_short!("COUNTER");

#[contract]
pub struct SorobanSoloanaBridge;

#[contractimpl]
impl SorobanSoloanaBridge {
    
    pub fn deposit(
        env: Env,
        a: Address,
        token_a: Address,
        amount_a: i128,
        ) {
          let token = token::Client::new(&env, &token_a);
          let contract_address = env.current_contract_address();
          token.transfer(&a, &contract_address, &amount_a);
        //message
          let amount: i128 = 100;
          let token_address: Symbol = Symbol::short("ghfktu");
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
          env.storage().instance().set(&DataKey::Transfer, &transfer);
         
         env.events()
         .publish((DataKey::Transfer, Symbol::short("deposit")), transfer);

    }
}
mod test;
