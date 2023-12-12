#![cfg(test)]

use super::*;
use soroban_sdk::{symbol_short, vec, Env};

#[test]
fn test() {
    let env = Env::default();
    let contract_id = env.register_contract(None, SorobanSoloanaBridge);
    let client = SorobanSoloanaBridgeClient::new(&env, &contract_id);

    //let words = client.hello(&String::from_slice(&env, "deposit"));
  
}
