use anchor_lang::prelude::*;
use anchor_lang::{
   
    solana_program::{program::invoke, system_instruction},
    
    };
    use anchor_spl::token;
    // use anchor_spl::{
    //     token::{Token,MintTo , Mint, mint_to },
    // };
    use ed25519_dalek::ed25519::signature::Verifier;
    use ed25519_dalek::PublicKey;
    use ed25519_dalek::Signature;
    use std::convert::TryFrom;
    use solana_program::sysvar::Sysvar;
    use solana_program::ed25519_program::{ID as ED25519_ID};
    use solana_program::sysvar::instructions::{ID as IX_ID, load_instruction_at_checked};
    use solana_program::instruction::Instruction;
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
    pub fn verify_ed25519(ctx: Context<Verify>,  pubkey: String , sign: String , msg: String) -> Result<()> {
        // Get what should be the Ed25519Program instruction
        let ix: Instruction = load_instruction_at_checked(0, &ctx.accounts.ix_sysvar)?;

        // Check that ix is what we expect to have been sent
       // utils::verify_ed25519_ix(&ix, &pubkey, &msg, &sig)?;

        // Do other stuff
        
        Ok(())
    }
   
}
pub mod utils {
    use super::*; 
     /// Verify Ed25519Program instruction fields
     pub fn verify_ed25519_ix(ix: &Instruction, pubkey: &[u8], msg: &[u8], sig: &[u8]) -> Result<()> {
        if  ix.program_id       != ED25519_ID                   ||  // The program id we expect
            ix.accounts.len()   != 0                            ||  // With no context accounts
            ix.data.len()       != (16 + 64 + 32 + msg.len())       // And data of this size
        {
           // return Err(ErrorCode::SigVerificationFailed.into());    // Otherwise, we can already throw err
        }

        check_ed25519_data(&ix.data, pubkey, msg, sig)?;            // If that's not the case, check data

        Ok(())
    }
    /// Verify serialized Ed25519Program instruction data
    pub fn check_ed25519_data(data: &[u8], pubkey: &[u8], msg: &[u8], sig: &[u8]) -> Result<()> {
        // According to this layout used by the Ed25519Program
        // https://github.com/solana-labs/solana-web3.js/blob/master/src/ed25519-program.ts#L33

        // "Deserializing" byte slices

        let num_signatures                  = &[data[0]];        // Byte  0
        let padding                         = &[data[1]];        // Byte  1
        let signature_offset                = &data[2..=3];      // Bytes 2,3
        let signature_instruction_index     = &data[4..=5];      // Bytes 4,5
        let public_key_offset               = &data[6..=7];      // Bytes 6,7
        let public_key_instruction_index    = &data[8..=9];      // Bytes 8,9
        let message_data_offset             = &data[10..=11];    // Bytes 10,11
        let message_data_size               = &data[12..=13];    // Bytes 12,13
        let message_instruction_index       = &data[14..=15];    // Bytes 14,15

        let data_pubkey                     = &data[16..16+32];  // Bytes 16..16+32
        let data_sig                        = &data[48..48+64];  // Bytes 48..48+64
        let data_msg                        = &data[112..];      // Bytes 112..end

        // Expected values

        let exp_public_key_offset:      u16 = 16; // 2*u8 + 7*u16
        let exp_signature_offset:       u16 = exp_public_key_offset + pubkey.len() as u16;
        let exp_message_data_offset:    u16 = exp_signature_offset + sig.len() as u16;
        let exp_num_signatures:          u8 = 1;
        let exp_message_data_size:      u16 = msg.len().try_into().unwrap();

        // Header and Arg Checks

        // Header
        if  num_signatures                  != &exp_num_signatures.to_le_bytes()        ||
            padding                         != &[0]                                     ||
            signature_offset                != &exp_signature_offset.to_le_bytes()      ||
            signature_instruction_index     != &u16::MAX.to_le_bytes()                  ||
            public_key_offset               != &exp_public_key_offset.to_le_bytes()     ||
            public_key_instruction_index    != &u16::MAX.to_le_bytes()                  ||
            message_data_offset             != &exp_message_data_offset.to_le_bytes()   ||
            message_data_size               != &exp_message_data_size.to_le_bytes()     ||
            message_instruction_index       != &u16::MAX.to_le_bytes()  
        {
          //  return Err(ErrorCode::SigVerificationFailed.into());
        }

        // Arguments
        if  data_pubkey != pubkey   ||
            data_msg    != msg      ||
            data_sig    != sig
        {
          //  return Err(ErrorCode::SigVerificationFailed.into());
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
  #[derive(Accounts)]
pub struct Verify<'info> {
    pub sender: Signer<'info>,
    /// CHECK:` doc comment explaining why no checks through types are necessary
    pub ix_sysvar: AccountInfo<'info>,

    
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
#[error_code]
pub enum MyError {
    #[msg("Signature verification failed.")]
    SigVerificationFailed
}
