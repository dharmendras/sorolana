mod constants;
mod ins;
mod state;
// use solana_program::ed25519_program::ID as ED25519_ID;

use anchor_lang::prelude::*;
use anchor_lang::solana_program::ed25519_program::ID as ED25519_ID;
use anchor_lang::solana_program::sysvar::instructions::load_instruction_at_checked;
use anchor_lang::solana_program::{
    instruction::Instruction,
    program::{invoke, invoke_signed},
    system_instruction,
};
use anchor_spl::token::{mint_to, Burn, MintTo};

use constants::AUTHORITY;

use ins::*;
use state::{CustomErrorCode, DepositEvent, WithdrawEvent};
declare_id!("5w7LLcjXEwmzh3W8yhsxZxrPx6Xo83pa69kSf4mRZAUp");

#[program]
pub mod sorolan_bridge {

    // use crate::constants::PROGRAM_SEED_PREFIX;

    use super::*;

    #[access_control(authorized_admin(&ctx.accounts.authority))]
    pub fn init_token_mint(ctx: Context<AccountsInvolvedInInitTokenMint>) -> Result<()> {
        let program_authority = &mut ctx.accounts.authority;
        msg!(
            "Program Pda is initialized successfully, the authority of the pda is : {}",
            program_authority.key()
        );
        msg!("Token mint created successfully.");
        Ok(())
    }

    pub fn deposit(ctx: Context<AccountsForDeposit>, amount: u64, to: String) -> Result<()> {
        let program_id = ctx.program_id;

        // Derive the program's address using the program's ID
        let program_address =
            Pubkey::create_with_seed(&program_id, "MyProgramAddress", &program_id);
        msg!("Program Address: {:?}", program_address);

        let (program_pda, _pda_bump) = Pubkey::find_program_address(
            &[b"soroban_solana", ctx.accounts.authority.key().as_ref()],
            ctx.program_id,
        );

        msg!("Derived pda: {}", program_pda.key());
        msg!("Passed pda: {}", ctx.accounts.program_pda.key());

        invoke(
            &system_instruction::transfer(
                &ctx.accounts.user.key(), // from
                &program_pda.key(), // to // double checked by deriving treasury PDA in program itself
                amount,
            ),
            &[
                ctx.accounts.user.to_account_info(),
                ctx.accounts.program_pda.to_account_info(), // this is only possible to sign here, if we get this account from ctx.accounts
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        emit!(DepositEvent {
            amount: amount,
            token_address: "CB5ABZGAAFXZXB7XHAQT6SRT6JXH2TLIDVVHJVBEJEGD2CQAWNFD7D2U".to_string(),
            token_chain: 123,
            reciever_address: to,
            to_chain: 456,
            fee: 6000,
        });
        Ok(())
    }

    pub fn claim(
        ctx: Context<AccountsInvolvedInMint>,
        pubkey: [u8; 32],
        msg: Vec<u8>,
        sig: [u8; 64],
    ) -> Result<()> {
        msg!("claim method start executing");
        msg!("message{:?}", msg);
        let ix: Instruction = load_instruction_at_checked(0, &ctx.accounts.ix_sysvar)?;
        msg!("ix: {:?}", ix);
        utils::verify_ed25519_ix(&ix, &pubkey, &msg, &sig)?;
        msg!("varify done");

        // Parse amount
        let mut amount_string = String::from_utf8(msg.to_vec()).unwrap();
        let mut amt_bracket = amount_string.split_off(177); // hard coded
        let amount: String = amt_bracket.drain(..amt_bracket.len() - 1).collect();
        let amt: u64 = amount.parse().unwrap();
        msg!("Amount to be mint: {}", amt);
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
        let a = mint_to(cpi_ctx, amt * 1000000000)?;
        msg!("a: {:?}", a);

        Ok(())
    }

    pub fn withdraw(ctx: Context<BurnToken>, amount: u64) -> Result<()> {
        msg!("Amount to be burn: {}", amount);
        let cpi_accounts = Burn {
            mint: ctx.accounts.mint.to_account_info(),
            from: ctx.accounts.token_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        // Create the CpiContext we need for the request
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        // Execute anchor's helper function to burn tokens
        anchor_spl::token::burn(cpi_ctx, amount)?;

        emit!(WithdrawEvent {
            amount: amount,
            token_address: "CB5ABZGAAFXZXB7XHAQT6SRT6JXH2TLIDVVHJVBEJEGD2CQAWNFD7D2U".to_string(),
            token_chain: 123,
            withdrawer_address: ctx.accounts.token_account.key().to_string(),
            to_chain: 456,
            fee: 6000,
        });
        Ok(())
    }

    pub fn release_funds(
        ctx: Context<AccountsForReleaseFunds>,
        pubkey: [u8; 32],
        msg: Vec<u8>,
        sig: [u8; 64],
    ) -> Result<()> {
        msg!("withdraw message{:?}", msg);
        let ix: Instruction = load_instruction_at_checked(0, &ctx.accounts.ix_sysvar)?;
        msg!("ix: {:?}", ix);
        utils::verify_ed25519_ix(&ix, &pubkey, &msg, &sig)?;
        msg!("varify done");

        // Parse amount
        let mut parsed_amount_string = String::from_utf8(msg.to_vec()).unwrap();
        let mut with_bracket = parsed_amount_string.split_off(177); // hard coded
        let amount_string: String = with_bracket.drain(..with_bracket.len() - 1).collect();
        let withdrawable_amount: u64 = amount_string.parse().unwrap();
        msg!("Amount to be withdraw: {}", withdrawable_amount);

        let (program_pda, generic_bump_seed) = Pubkey::find_program_address(
            &[b"soroban_solana", ctx.accounts.authority.key().as_ref()],
            ctx.program_id,
        );
        invoke_signed(
            &system_instruction::transfer(
                &program_pda.key(),           // local var .key() // from
                &ctx.accounts.receiver.key(), // to // double checked by deriving treasury PDA in program itself
                withdrawable_amount * 1000000000,
            ),
            &[
                ctx.accounts.program_pda.to_account_info(), // from
                ctx.accounts.receiver.to_account_info(),    // to
                ctx.accounts.system_program.to_account_info(),
            ],
            &[&[
                "soroban_solana".as_ref(), // since signing using PDA, therefore passing signers seeds
                ctx.accounts.authority.key().as_ref(),
                &[generic_bump_seed],
            ]],
        )?;
        Ok(())
    }
}

// Utility
pub mod utils {
    // use anchor_lang::solana_program::instruction::Instruction;

    use super::*;

    /// Verify Ed25519Program instruction fields
    pub fn verify_ed25519_ix(
        ix: &Instruction,
        pubkey: &[u8],
        msg: &[u8],
        sig: &[u8],
    ) -> Result<()> {
        msg!("Verify Ed25519Program instruction fields");

        if ix.program_id != ED25519_ID ||  // The program id we expect
            ix.accounts.len() != 0 ||  // With no context accounts
            ix.data.len() != (16 + 64 + 32 + msg.len())
        // And data of this size
        {
            msg!("ix.data.len(): {}", ix.data.len());
            msg!("(16 + 64 + 32 + msg.len()): {}", (16 + 64 + 32 + msg.len()));
            msg!("FAILED 1");

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

pub fn authorized_admin(admin: &Signer) -> Result<()> {
    let authority = AUTHORITY.parse::<Pubkey>().unwrap();
    msg!("Saved Authority: {}", authority.key());
    msg!("Passes Authority: {}", admin.key());
    if authority.key() != admin.key() {
        return Err(CustomErrorCode::WrongAdmin.into());
    }
    Ok(())
}
