use anchor_lang::prelude::*;
use anchor_lang::{
   
    solana_program::{program::invoke, system_instruction},
    
    };
    use anchor_spl::token;
    // use anchor_spl::{
    //     token::{Token,MintTo , Mint, mint_to },
    // };

declare_id!("9inMRAuig1bbuLXbLXTEpTG4Km5aCU3DctamwhjH5fQ5");

#[program]
pub mod solana_soroban_bridge {
    use super::*;

   pub const  current_validators :[&str; 4]= ["SDFTLC3274HR57LB7JTFG6EQBZRUE5T5ICVEPCCABADUGQS7HZVKGRDX" ,
                                 "5tCpncznFkwTvauTxjyuHj6E2Eef86bv8coicC1gnvhu" ,
                                 "3FArMmrnhs4r2NpGaBkugfrz6MxDSnbv9sNoAcvPuwkX" ,
                                  "7BLoSwV7MSFA66krJztzut7rhy8mXmCyk5Hnnm2S2k7"];

    pub fn deposite(ctx: Context<Deposit> , amount: u64) -> Result<()> {

        
        let from_account = &ctx.accounts.from;
        let to_account = &ctx.accounts.to;

        //  transfer instruction
       let transfer_instruction = system_instruction::transfer(
        from_account.key , 
       to_account.key , 
       amount);

       // invoke the  transfer  instruction
        invoke( 
        &transfer_instruction,
        &[ from_account.to_account_info(),
          to_account.to_account_info(),
          ],
        
         
        );
        emit!(DepositEvent {
            amount: 12,
            token_address: "9ZJdKLk57wS3NDPqHNybYX8aoApzZXmRhCKzZ3fLhZpo".to_string(),
            token_chain: 123,
            to: "ALeMyZqeNSzZKTrcwHU1EJnBkxTnWXHc22iCvhyzZ3f".to_string(),
            to_chain: 456,
            fee: 100,
        });
        Ok(())
    }

    pub fn claim(ctx: Context<Claim> , value: String) -> Result<()>  { 
        msg!("solana55{}" , value);
        
        
            for  i in 0..current_validators.len() { 
                
                if  current_validators[i] == value{ 
                    msg!("chal ja");
                    break;
                }
                else { 
                    msg!("nhi chala ")
                }
             }
      
        Ok(())
    }
   
}

#[derive(Accounts)]
pub struct Deposit<'info> { 

   #[account(mut)]
   pub from: Signer<'info>,
   #[account(mut)]
   /// CHECK:` doc comment explaining why no checks through types are necessary
   pub to : AccountInfo<'info>,
   pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct Claim { 

  }




#[event]
pub struct DepositEvent{ 
    pub amount:u16,

    #[index]
    pub  token_address: String,
    pub token_chain: u16,
    pub to: String,
    pub to_chain: u16,
    pub fee: u16,
}
