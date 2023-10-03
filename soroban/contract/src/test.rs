//! This is a translation of `fuzz_target_1.rs`
//! into a reusable property test,
//! using the `proptest` and `proptest-arbitrary-interop` crates.

#![cfg(test)]

// #[derive(Arbitrary)] expects `std` to be in scope,
// but the contract is a no_std crate.
extern crate std;

use super::*;




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
        let claimant_address = Address::random(&env);
        let token_admin = Address::random(&env);

        let token_contract_id = env.register_stellar_asset_contract(token_admin.clone());
        let token_client = TokenClient::new(&env, &token_contract_id);
        let token_admin_client = TokenAdminClient::new(&env, &token_contract_id);

        let timelock_contract_id = env.register_contract(None, SorobanSoloanaBridge { });
        let timelock_client = SorobanSoloanaBridgeClient::new(&env, &timelock_contract_id);
      
        token_admin_client.mint(&depositor_address, &i128::max_value());
        //  timelock_client.deposit(
        //             &depositor_address,
        //             &token_contract_id,
        //             &10,
                   
        //         );

        

           
       

      
    }



