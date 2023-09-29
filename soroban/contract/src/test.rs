//! This is a translation of `fuzz_target_1.rs`
//! into a reusable property test,
//! using the `proptest` and `proptest-arbitrary-interop` crates.

#![cfg(test)]

// #[derive(Arbitrary)] expects `std` to be in scope,
// but the contract is a no_std crate.
extern crate std;
extern crate base64;
use super::*;

use soroban_sdk::testutils::{Address as _, Ledger, LedgerInfo};
//use soroban_sdk::token::Client as TokenClient;
use soroban_sdk::token::StellarAssetClient as TokenAdminClient;

use soroban_sdk::{Address, Env};
use token_contract::Client as TokenClient;
mod contract {
    soroban_sdk::contractimport!(
        file =
            "/home/imentus/Documents/imentus_project/sorolana/soroban/contract/token/soroban_token_contract.wasm"
    );
}
fn create_token_contract<'a>(e: &Env, admin: &Address) -> TokenClient<'a> {
    TokenClient::new(e, &e.register_stellar_asset_contract(admin.clone()))
}
//#[derive(Arbitrary, Debug, Clone)]
// 1) Test Case For Deposit
#[test]
fn test() {
    let env = Env::default();

    env.mock_all_auths();

    // Turn off the CPU/memory budget for testing.

    let depositor_address = Address::random(&env);
    let claimant_address = Address::random(&env);
    let token_admin = Address::random(&env);
    let user = Address::random(&env);
    let token_admin = Address::random(&env);
    let token_a_admin = create_token_contract(&env, &token_admin);
    token_a_admin.mint(&user, &1000);

    // let token_contract_id = env.register_stellar_asset_contract(token_admin.clone());
    // let token_client = TokenClient::new(&env, &token_contract_id);
    // let token_admin_client = TokenAdminClient::new(&env, &token_contract_id);

    let timelock_contract_id = env.register_contract(None, SorobanSoloanaBridge {});
    let timelock_client = SorobanSoloanaBridgeClient::new(&env, &timelock_contract_id);
    let user_balance = token_a_admin.balance(&user);
  //  std::println!("===>USER balance Before DEPOSIT <==={:?}", user_balance);
    //   token_admin_client.mint(&depositor_address, &i128::max_value());
     let balance = timelock_client.deposit(&user, &token_a_admin.address, &10);
  //   std::println!("===>balance<==={:?}" , balance );
     let user_balance1 = token_a_admin.balance(&user);
     //std::println!("===>USER balance AFTER DEPOSIT <==={:?}" , user_balance1 );

    //2) W
    // let wasm_hash = env.deployer().upload_contract_wasm(contract::WASM);
    // let salt = BytesN::from_array(&env, &[0; 32]);

    // let wAddress = timelock_client.create_wrapped_Token(&wasm_hash, &salt);

   
    // //3) C
    //    let user_balance = timelock_client.claim(&user);
    //     std::println!("===>USER_BALANCE<==={:?}" ,user_balance);

        //4) W
        // let withdraw_balance = timelock_client.withdraw(&10, &user);
        // std::println!("===>WITHDRAW_BALANCE<==={:?}" , withdraw_balance);


        // let to_address_str = String::from_utf8(user_balance.to_vec()).unwrap();
        // println!(" to address {}", to_address_str);
    //     let mut s: [u8; 100] = [0; 100];
    //      let ( sl, _) = s.split_at_mut(user_balance.len() as usize);
    //      user_balance.copy_into_slice(sl);
    //      std::println!("sl{:?}" , sl);
    //      let mystr = core::str::from_utf8(sl).unwrap();
    //     // let encoded_string1 = base64::encode(sl);
    //     let decoded_bytes = base64::decode(mystr).unwrap();

    //       std::println!("mystr{:?}" , mystr);
    //    //  std::println!("mystr{:?}" , mystr);
        
    //     // let decoded_bytes = base64::decode(mystr).unwrap();
    //      std::println!("decoded_bytes line number 81 {:?}" , decoded_bytes);
     //  let to_address = Address::from_contract_id(&env.crypto().sha256(&decoded_bytes));
    

}
// // 2) Test Case For setAdmin
// #[test]
// fn test1() {
//     let env = Env::default();
//     // let native_asset = Asset::Native;
//     // let contract_id_preimage = ContractIdPreimage::Asset(native_asset);
//     let pubkey1: Bytes = [
//         24, 18, 128, 96, 212, 184, 67, 190, 208, 92, 160, 143, 32, 99, 152, 36, 3, 70, 28, 144,
//         247, 33, 37, 88, 91, 179, 136, 39, 181, 248, 223, 164, 198, 232, 20, 86, 56, 93, 149, 52,
//         133, 18,
//     ]
//     .into_val(&env);
//    // let bytes = Bytes::from_slice(&env, &contract_id_preimage.to_xdr().unwrap());
//     let native_asset_address = Address::from_contract_id(&env.crypto().sha256(&pubkey1));
//    // std::println!("===>native_asset_address<==={:?}", native_asset_address);
//     //CDF3YSDVBXV3QU2QSOZ55L4IVR7UZ74HIJKXNJMN4K5MOVFM3NDBNMLY
//     // env.mock_all_auths();

//     // // Turn off the CPU/memory budget for testing.

//     // let admin_address = Address::random(&env);
//     // let claimant_address = Address::random(&env);
//     // let token_admin = Address::random(&env);

//     // let token_contract_id = env.register_stellar_asset_contract(token_admin.clone());
//     // let token_client = TokenClient::new(&env, &token_contract_id);
//     // let token_admin_client = TokenAdminClient::new(&env, &token_contract_id);

//     // let timelock_contract_id = env.register_contract(None, SorobanSoloanaBridge {});
//     // let timelock_client = SorobanSoloanaBridgeClient::new(&env, &timelock_contract_id);
//     //     let store_admin_add = timelock_client.set_admin(&admin_address);
//     //     std::println!("===>store_admin_add<==={:?}" , store_admin_add );
// }

// // 3) Test Case For custom token
// #[test]
// fn test2() {
//     let env = Env::default();

//     // env.mock_all_auths();

//     // Turn off the CPU/memory budget for testing.

//     let admin_address = Address::random(&env);
//     let claimant_address = Address::random(&env);
//     let token_admin = Address::random(&env);

//     let token_contract_id = env.register_stellar_asset_contract(token_admin.clone());
//     let token_client = TokenClient::new(&env, &token_contract_id);
//     let token_admin_client = TokenAdminClient::new(&env, &token_contract_id);

//     let timelock_contract_id = env.register_contract(None, SorobanSoloanaBridge {});
//     let timelock_client = SorobanSoloanaBridgeClient::new(&env, &timelock_contract_id);
//     //     let wasm_hash = env.deployer().upload_contract_wasm(contract::WASM);
//     //     let salt = BytesN::from_array(&env, &[0; 32]);

//     //    let wAddress =  timelock_client.create_wrapped_Token(&wasm_hash , &salt);
//     //std::println!("===>wAddress<==={:?}" ,wAddress );
// }

// // 4) Test Case For claim
// #[test]
// fn test3() {
//     let env = Env::default();

//     env.mock_all_auths();

//     // Turn off the CPU/memory budget for testing.

//     let user = Address::random(&env);
//     let claimant_address = Address::random(&env);
//     let token_admin = Address::random(&env);

//     let token_contract_id = env.register_stellar_asset_contract(token_admin.clone());
//     let token_client = TokenClient::new(&env, &token_contract_id);
//     let token_admin_client = TokenAdminClient::new(&env, &token_contract_id);

//     let timelock_contract_id = env.register_contract(None, SorobanSoloanaBridge {});
//     let timelock_client = SorobanSoloanaBridgeClient::new(&env, &timelock_contract_id);

//     // let user_balance = timelock_client.claim();
//     // std::println!("===>user_balance<==={:?}" ,user_balance);
// }
