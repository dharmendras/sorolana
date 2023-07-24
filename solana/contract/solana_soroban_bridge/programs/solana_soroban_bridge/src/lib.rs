use anchor_lang::prelude::*;
use solana_program::instruction::Instruction;
use solana_program::sysvar::instructions::{load_instruction_at_checked, ID as IX_ID};
use solana_program::ed25519_program::ID as ED25519_ID;
use anchor_lang::{
   solana_program::{program::invoke, system_instruction},
    
    };
    use anchor_spl::token;
    use anchor_spl::{
        associated_token::AssociatedToken,
        token::{Token,Mint,MintTo , mint_to , TokenAccount , Burn , Transfer},
    };
  
declare_id!("4w3iT8iTfRGUpdA1hz4gDfnCv2SiZ8YeGUthGi6dMSfS");

#[program]
pub mod solana_soroban_bridge {
    use super::*;

   pub const  current_validators :[&str; 4]= ["SDFTLC3274HR57LB7JTFG6EQBZRUE5T5ICVEPCCABADUGQS7HZVKGRDX" ,
                                 "5tCpncznFkwTvauTxjyuHj6E2Eef86bv8coicC1gnvhu" ,
                                 "3FArMmrnhs4r2NpGaBkugfrz6MxDSnbv9sNoAcvPuwkX" ,
                                  "7BLoSwV7MSFA66krJztzut7rhy8mXmCyk5Hnnm2S2k7"];

  pub fn hello(ctx: Context<Hello>) -> Result<()> { 
    msg!("Hii Zafar You can do");
    Ok(())
  }
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

    pub fn claim(ctx: Context<Claim> , pubkey: [u8; 32],
        msg: Vec<u8>,
        sig: [u8; 64],) -> Result<()>  { 
      msg!("claim method star executing");
    let ix: Instruction = load_instruction_at_checked(0, &ctx.accounts.ix_sysvar)?;
    utils::verify_ed25519_ix(&ix, &pubkey, &msg, &sig)?;
    msg!("varify done");

    Ok(())
    }
    pub fn initialize_mint(ctx: Context<InitializeMint>) -> Result<()> {
        Ok(())
    }
    pub fn mint_token(ctx: Context<MintToken> , amount: u64) -> Result<()>{
        msg!("amount is at the time of mint token {}" , amount);
        // Create the MintTo struct for our context
     
        let cpi_accounts = MintTo {
            mint: ctx.accounts.mint.to_account_info(),
           
            to: ctx.accounts.token_account.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        // Create the CpiContext we need for the request
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        // Execute anchor's helper function to mint tokens
        token::mint_to(cpi_ctx, amount)?;
  
    Ok(())
    }
    pub fn withdraw(ctx: Context<Withdraw> , amount: u64) -> Result<()>{ 

        // Create the Transfer struct for our context
        let transfer_instruction = Transfer{
            from: ctx.accounts.from.to_account_info(),
            to: ctx.accounts.to.to_account_info(),
            authority: ctx.accounts.from_authority.to_account_info(),
        };
         
        let cpi_program = ctx.accounts.token_program.to_account_info();
        // Create the Context for our Transfer request
        let cpi_ctx = CpiContext::new(cpi_program, transfer_instruction);

        // Execute anchor's helper function to transfer tokens
        anchor_spl::token::transfer(cpi_ctx, amount)?;
        Ok(())
    }
    pub fn burn_token(ctx: Context<BurnToken>, amount: u64) -> Result<()> {
        
        let cpi_accounts = Burn {
            mint: ctx.accounts.mint.to_account_info(),
            from: ctx.accounts.from.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        // Create the CpiContext we need for the request
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        // Execute anchor's helper function to burn tokens
        token::burn(cpi_ctx, amount)?;
        Ok(())
    }
}
pub mod utils {
    use super::*;

    /// Verify Ed25519Program instruction fields
    pub fn verify_ed25519_ix(
        ix: &Instruction,
        pubkey: &[u8],
        msg: &[u8],
        sig: &[u8],
    ) -> Result<()> {
        msg!("Verify Ed25519Program instruction fields");

        if ix.program_id       != ED25519_ID                   ||  // The program id we expect
            ix.accounts.len()   != 0                            ||  // With no context accounts
            ix.data.len()       != (16 + 64 + 32 + msg.len())
        // And data of this size
        {
            return Err(CustomErrorCode::SigVerificationFailed.into()); // Otherwise, we can already throw err
        }

        check_ed25519_data(&ix.data, pubkey, msg, sig)?; // If that's not the case, check data

        Ok(())
    }

   

    /// Verify serialized Ed25519Program instruction data
    pub fn check_ed25519_data(data: &[u8], pubkey: &[u8], msg: &[u8], sig: &[u8]) -> Result<()> {
        // According to this layout used by the Ed25519Program
        // https://github.com/solana-labs/solana-web3.js/blob/master/src/ed25519-program.ts#L33
        msg!("Verify serialized Ed25519Program instruction data");

        // "Deserializing" byte slices

        let num_signatures = &[data[0]]; // Byte  0
        let padding = &[data[1]]; // Byte  1
        let signature_offset = &data[2..=3]; // Bytes 2,3
        let signature_instruction_index = &data[4..=5]; // Bytes 4,5
        let public_key_offset = &data[6..=7]; // Bytes 6,7
        let public_key_instruction_index = &data[8..=9]; // Bytes 8,9
        let message_data_offset = &data[10..=11]; // Bytes 10,11
        let message_data_size = &data[12..=13]; // Bytes 12,13
        let message_instruction_index = &data[14..=15]; // Bytes 14,15

        let data_pubkey = &data[16..16 + 32]; // Bytes 16..16+32
        let data_sig = &data[48..48 + 64]; // Bytes 48..48+64
        let data_msg = &data[112..]; // Bytes 112..end

        // Expected values

        let exp_public_key_offset: u16 = 16; // 2*u8 + 7*u16
        let exp_signature_offset: u16 = exp_public_key_offset + pubkey.len() as u16;
        let exp_message_data_offset: u16 = exp_signature_offset + sig.len() as u16;
        let exp_num_signatures: u8 = 1;
        let exp_message_data_size: u16 = msg.len().try_into().unwrap();

        // Header and Arg Checks

        // Header
        if num_signatures != &exp_num_signatures.to_le_bytes()
            || padding != &[0]
            || signature_offset != &exp_signature_offset.to_le_bytes()
            || signature_instruction_index != &u16::MAX.to_le_bytes()
            || public_key_offset != &exp_public_key_offset.to_le_bytes()
            || public_key_instruction_index != &u16::MAX.to_le_bytes()
            || message_data_offset != &exp_message_data_offset.to_le_bytes()
            || message_data_size != &exp_message_data_size.to_le_bytes()
            || message_instruction_index != &u16::MAX.to_le_bytes()
        {
            return Err(CustomErrorCode::SigVerificationFailed.into());
        }

        // Arguments
        if data_pubkey != pubkey || data_msg != msg || data_sig != sig {
            return Err(CustomErrorCode::SigVerificationFailed.into());
        }
        msg!("Verify serialized Ed25519Program instruction data Done");

        Ok(())
    }

  
}
#[derive(Accounts)]
pub struct Hello { 

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
pub struct Withdraw<'info> { 
    pub token_program: Program<'info, Token>,
    /// CHECK: The associated token account that we are transferring the token from
    #[account(mut)]
    pub from: UncheckedAccount<'info>,
    /// CHECK: The associated token account that we are transferring the token to
    #[account(mut)]
    pub to: AccountInfo<'info>,
    // the authority of the from account 
    pub from_authority: Signer<'info>,
}
#[derive(Accounts)]
pub struct Claim<'info>{ 
    pub sender: Signer<'info>,
    /// CHECK:` doc comment explaining why no checks through types are necessary
    #[account(address = IX_ID)]
    pub ix_sysvar: AccountInfo<'info>,
  }
  #[derive(Accounts)]
pub struct InitializeMint<'info> {
    #[account(
        init,
        payer = payer,
        mint::decimals = 9,
        mint::authority = payer,
        mint::freeze_authority = payer,
    )]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    ///CHECK: This is not dangerous because we don't read or write from this account
    pub rent: AccountInfo<'info>,
}
#[derive(Accounts)]
pub struct MintToken<'info> {
   /// CHECK: This is the token that we want to mint
   #[account(mut)]
   pub mint: UncheckedAccount<'info>,
   pub token_program: Program<'info, Token>,
   /// CHECK: This is the token account that we want to mint tokens to
   #[account(mut)]
   pub token_account: UncheckedAccount<'info>,
   /// CHECK: the authority of the mint account
   #[account(mut)]
   pub authority: AccountInfo<'info>,
}
#[derive(Accounts)]
pub struct BurnToken<'info> {
    /// CHECK: This is the token that we want to mint
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
    /// CHECK: This is the token account that we want to mint tokens to
    #[account(mut)]
    pub from: AccountInfo<'info>,
    /// CHECK: the authority of the mint account
    pub authority: Signer<'info>,
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
/// Custom error codes
#[error_code]
pub enum CustomErrorCode {
    #[msg("Signature verification failed.")]
    SigVerificationFailed,
}
