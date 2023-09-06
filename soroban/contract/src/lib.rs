
#![no_std]
use soroban_sdk::{contract, contractimpl, token, Address, contracttype ,Env,Vec, log , String ,Bytes , Map ,  IntoVal ,BytesN  ,Symbol};
mod token_contract {
    soroban_sdk::contractimport!(file = "./token/soroban_token_contract.wasm");
}
extern crate std;


 //use serde_json::Value;
//use base64;

mod types;
use types::*;
mod  error;
use  error::*;

pub struct TokenMap {
 pub  token_add : Address
}
#[derive(Clone)]
#[contracttype]

pub enum DataKey1 {
    val,
}
#[derive(Clone)]
#[contracttype]
pub enum Globals { 
   Admin
}
//const COUNTER: Symbol = symbol_short!("COUNTER");
fn set_contract_deployer_address(env: &Env , admin: Address) { 
  env.storage().persistent().set( &Globals::Admin , &admin);
  env.storage().persistent().bump( &Globals::Admin, 52600);
}
fn get_contract_deployer(env: &Env) -> Address{ 
  let add: Address = env.storage().persistent().get(&Globals::Admin).unwrap();
  add
}
fn mint_tokens(env: &Env , a: Address , amount: i128 , receiver: Address ) { 
   //to_address mint
    let token_client = token_contract::Client::new(&env,&a);
   // std::println!("mint called line 23 {:?}" , receiver);
 //   token_client.mint(&receiver , &amount);
  //  withdraw(&env , receiver , amount , a);
        }
        fn withdraw(env: &Env , to: Address , amount: i128 , token_address: Address) { 
            let token_client = token_contract::Client::new(&env,&token_address);
            token_client.transfer(&env.current_contract_address() , &to , &amount);
           // burn(&env , token_address , to , amount);
           }
           fn burn(env: &Env , token_address: Address ,to: Address ,  amount: i128) { 
            let token_client = token_contract::Client::new(&env,&token_address);
          token_client.burn(&to , &amount);
           }
#[contract]
pub struct SorobanSoloanaBridge;


#[contractimpl]
impl SorobanSoloanaBridge {
    
    pub fn deposit(
        env: Env,
         a: Address,
          token_a: Address,
        amount_a: i128,
        )-> i128  {
         let token = token_contract::Client::new(&env, &token_a);
         
        let contract_address =  env.current_contract_address();
          
        token.transfer(&a, &contract_address, &amount_a);
           let balance = token.balance(&contract_address);
           let token_add1 = token_a;

          
          
    //     //message
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
    //  //    mint_tokens(&env ,  token_a  , amount_a , a);
           balance
    }

    pub fn set_admin(env: Env , a: Address , admin: Address) {
        
        set_contract_deployer_address(&env , admin);
        let admin_address = get_contract_deployer(&env);
  std::println!(" admin address {:?}" , admin_address);
    }
    //pub fn claim(env: Env, public_key: BytesN<32>, message: Bytes, signature: BytesN<64>) -> Bytes
    // pub fn claim(env: Env, public_key: Vec<BytesN<32>>, message: Bytes, signature: Vec<BytesN<64>>)
    pub fn claim(env: Env , wasm_hash: BytesN<32> , salt: BytesN<32> , user: Address) -> i128   {
         // std::println!("claim called");
        // let result = env.crypto().ed25519_verify(&public_key , &message , &signature);
       let message: Bytes = [123, 34, 97, 109, 111, 117, 110, 116, 34, 58, 49, 50, 44, 34, 116, 111, 107, 101, 110, 65, 100, 100, 114, 101, 115, 115, 34, 58, 34, 66, 112, 114, 53, 106, 106, 53, 75, 113, 83, 98, 78, 97, 120, 104, 118, 111, 98, 76, 118, 65, 69, 103, 117, 76, 82, 65, 70, 76, 53, 57, 84, 75, 87, 99, 111, 65, 54, 52, 105, 56, 107, 113, 72, 34, 44, 34, 116, 111, 107, 101, 110, 67, 104, 97, 105, 110, 34, 58, 49, 50, 51, 44, 34, 116, 111, 34, 58, 34, 54, 85, 119, 115, 68, 97, 53, 90, 111, 109, 83, 76, 86, 112, 107, 104, 104, 81, 104, 110, 101, 52, 101, 90, 99, 103, 86, 51, 115, 120, 112, 53, 101, 103, 103, 115, 82, 69, 89, 111, 65, 118, 97, 51, 34, 44, 34, 116, 111, 67, 104, 97, 105, 110, 34, 58, 52, 53, 54, 44, 34, 102, 101, 101, 34, 58, 49, 48, 48, 125].into_val(&env);
        let amount_slice = message.slice(10..12);; //amount 10..12 
        let token_address_slice = message.slice(29..73);; // token address 29..73
        let to_address_slice = message.slice(98..141);; // to_address 98..141
         
        let token_address = Address::from_contract_id(&env.crypto().sha256(&token_address_slice));
        let to_address = Address::from_contract_id(&env.crypto().sha256(&to_address_slice));
        let admin_address = get_contract_deployer(&env);
        let admin_address1 = get_contract_deployer(&env);
        let  mut map_token = Map::<Address, Address>::new(&env);
        std::println!(" admin address {:?}" , admin_address);

        let wrapped_token = env
            .deployer()
            .with_address(admin_address, salt)
            .deploy(wasm_hash);
       //  map_token.set(token_address , to_address);

       let name:String = "Zafar".into_val(&env);
       let symbol:String = "zaf".into_val(&env);
       
        let token_client = token_contract::Client::new(&env , &wrapped_token);
        token_client.initialize(&admin_address1 , &7 , &name , &symbol);
        token_client.mint(&admin_address1 , &10);
        token_client.transfer(&admin_address1 , &to_address , &5);
       let balance =  token_client.balance(&to_address);
       // std::println!("token address {:?}" , to_address);
      //  mint_tokens(&env , token_address , 10 , to_address);

     // let// (msg, _) = serde_json_core::from_slice::<Message>(sl).unwrap();

//  //   for (i, el) in public_key.iter().enumerate() {
//       for (i1, el1) in signature.iter().enumerate() {
//         let result = env.crypto().ed25519_verify(&el , &message , &el1);
//         break;
//   }
  
/// }
//message
balance
      }

    }

mod test;
