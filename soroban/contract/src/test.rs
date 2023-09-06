#![cfg(test)]
extern crate std;


use super::*;
use soroban_sdk::{
    symbol_short,
    testutils::{Address as _, AuthorizedFunction, AuthorizedInvocation },
    token, Address, Env, IntoVal,String , Vec
};

use soroban_sdk::testutils::Logs;
//use token_contract::AdminClient as TokenAdminClient;
use token_contract::Client as TokenClient;
///home/imentus/imentus_project/sorolana/soroban/contract/token/soroban_token_contract.wasm
mod contract {
    soroban_sdk::contractimport!(
        file =
            "/home/imentus/imentus_project/sorolana/soroban/contract/token/soroban_token_contract.wasm"
    );
}


fn create_token_contract<'a>(e: &Env, admin: &Address) -> TokenClient<'a> {
    TokenClient::new(e, &e.register_stellar_asset_contract(admin.clone()))
}

fn SorobanSoloanaBridge_contract(e: &Env) -> SorobanSoloanaBridgeClient {
    SorobanSoloanaBridgeClient::new(e, &e.register_contract(None, SorobanSoloanaBridge {}))
}


#[test]
fn test() {
    let env = Env::default();
    env.mock_all_auths();

    let user = Address::random(&env);
 //   println!("hii");
    // let b = Address::random(&env);

    let token_admin = Address::random(&env);

    let  token_a_admin = create_token_contract(&env, &token_admin);
    let wasm_hash = env.deployer().upload_contract_wasm(contract::WASM);
    let salt = BytesN::from_array(&env, &[0; 32]);
   // let (token_b, token_b_admin) = create_token_contract(&env, &token_admin);
    token_a_admin.mint(&user, &1000);
    //token_b_admin.mint(&b, &5000);
    std::println!("user balance before deposit{:?}" , token_a_admin.balance(&user));
    let contract = SorobanSoloanaBridge_contract(&env);
    std::println!("========><======={:?}" , token_a_admin.address);
   let result =  contract.deposit(
        &user,
       
        &token_a_admin.address,
        
        &1000,
        
    );
    std::println!("Contract Address Balance {:?}" , result);
//     std::println!("user balance after deposit{:?}" , token_a_admin.balance(&user));

  let a = Address:: random(&env);
  let b = Address::random(&env);
  let user = Address::random(&env);
  contract.set_admin(&a , &b);
  let balance = contract.claim(&wasm_hash , &salt , &user);
  std::println!("balance{:?}" , balance);
//contract.test();

// std::println!("=====>tmp<======{:?}" , temp);




// let logs = env.logs().all();
//     //assert_eq!logs, std::vec!["[Diagnostic Event] contract:0808080808080808080808080808080808080808080808080808080808080808, topics:[log], data:[\"Hello {}\", Dev]"]);
//     std::println!("{}", logs.join("\n"));
     //claim
//      let mut str1 ="This is a test of the Ed25519 signature in Rust.";


//      let args: Vec<String> = env::args(collect;
     
//      if args.len >1 { str1 = args[1].as_str();
   
   
//    let keypair: Keypair = Keypair::generate(&mut OsRng);
// let mut str1 ="This is a test of the Ed25519 signature in Rust.";
// let message: &u8 = str1.as_bytes;
// let input_string = "2d0CE7hfsbM04onvWtwZD0TmQZqCN/L28sh+XFa/xEVvzvacva4bNsC+uBTGmZctppnWnnkuY8PZtk2WalAZAw==";
// let input_bytes = input_string.as_bytes();
// let base64_string = base64::encode(input_bytes);
// let decoded_bytes = base64::decode(base64_string).expect("Failed to decode base64");
// let decoded_string = String::from_utf8(decoded_bytes).expect("Invalid UTF-8 sequence");
//std::println!("Base64 decoded_string: ", base64_string);

//contract.claim();
}
