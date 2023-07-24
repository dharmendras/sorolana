#![cfg(test)]
extern crate std;

use super::*;
use soroban_sdk::{
    symbol_short,
    testutils::{Address as _, AuthorizedFunction, AuthorizedInvocation},
    token, Address, Env, IntoVal,
};
//use token_contract::AdminClient as TokenAdminClient;
use token_contract::Client as TokenClient;

fn create_token_contract<'a>(e: &Env, admin: &Address) -> TokenClient<'a> {
    TokenClient::new(e, &e.register_stellar_asset_contract(admin.clone()))
}

fn create_atomic_swap_contract(e: &Env) -> SorobanSoloanaBridgeClient {
    SorobanSoloanaBridgeClient::new(e, &e.register_contract(None, SorobanSoloanaBridge {}))
}

#[test]
fn test_atomic_swap() {
    let env = Env::default();
    env.mock_all_auths();

    let user = Address::random(&env);
 //   println!("hii");
    // let b = Address::random(&env);

    let token_admin = Address::random(&env);

    let  token_a_admin = create_token_contract(&env, &token_admin);
    
   // let (token_b, token_b_admin) = create_token_contract(&env, &token_admin);
    token_a_admin.mint(&user, &1000);
    //token_b_admin.mint(&b, &5000);
    std::println!("user balance before deposit{:?}" , token_a_admin.balance(&user));
    let contract = create_atomic_swap_contract(&env);

    contract.deposit(
        &user,
       
        &token_a_admin.address,
        
        &1000,
        
    );
    std::println!("user balance after deposit{:?}" , token_a_admin.balance(&user));

   
}
