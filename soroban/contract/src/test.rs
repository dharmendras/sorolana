//! This is a translation of `fuzz_target_1.rs`
//! into a reusable property test,
//! using the `proptest` and `proptest-arbitrary-interop` crates.

#![cfg(test)]

// #[derive(Arbitrary)] expects `std` to be in scope,
// but the contract is a no_std crate.
extern crate std;

use super::*;

mod contract {
    soroban_sdk::contractimport!(
        file =
            "/home/imentus/Documents/imentus_project/sorolana/soroban/contract/token/soroban_token_contract.wasm"
    );
}


use soroban_sdk::testutils::{Address as _, Ledger, LedgerInfo};
use soroban_sdk::token::Client as TokenClient;
use soroban_sdk::token::StellarAssetClient as TokenAdminClient;
use soroban_sdk::{ Address, Env};

//#[derive(Arbitrary, Debug, Clone)]




    #[test]
    fn test() {
        let env = Env::default();

        env.mock_all_auths();

        // Turn off the CPU/memory budget for testing.
       

        let depositor_address = Address::random(&env);
        let user = Address::random(&env);

        let claimant_address = Address::random(&env);
        let token_admin = Address::random(&env);

        let token_contract_id = env.register_stellar_asset_contract(token_admin.clone());
        let token_client = TokenClient::new(&env, &token_contract_id);
        let token_admin_client = TokenAdminClient::new(&env, &token_contract_id);

        let timelock_contract_id = env.register_contract(None, SorobanSoloanaBridge { });
        let bridge_contract = SorobanSoloanaBridgeClient::new(&env, &timelock_contract_id);
      
        token_admin_client.mint(&depositor_address, &i128::max_value());
        let wasm_hash = env.deployer().upload_contract_wasm(contract::WASM);
        let salt = BytesN::from_array(&env, &[0; 32]);

     //   std::println!("wasm_hash{:?}" , wasm_hash);

        // let balance =  bridge_contract.deposit(
        //             &depositor_address,
        //             &token_contract_id,
        //             &10,
                   
        //         );
        //         std::println!("balance{:?}" , balance);

      //  timelock_client.testdeposit(&token_contract_id, &10, &user);

//        std::println!("balance:{:?}" , balance);
//  let balance = timelock_client.claim(&user, &10);
//  std::println!("balance{:?}" ,  balance);
// let add = timelock_client.createcustomtoken(&wasm_hash, &salt);
//    let  balance = timelock_client.claim(&user, &10, &add);
       
// std::println!("balance:{:?}" , balance)
      
    }



