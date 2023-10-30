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
use mpl_token_metadata::instructions::CreateMetadataAccountV3;

use constants::AUTHORITY;

use ins::*;
use state::{ClaimEvent, CustomErrorCode, DepositEvent, WithdrawEvent};
declare_id!("4YXajmGwhTcszkZoae6TWQKvxwt5XAhvj4naV7biSnpT");

#[program]
pub mod sorolan_bridge {

    // use crate::constants::PROGRAM_SEED_PREFIX;

    // use mpl_token_metadata::{instructions::CreateMetadataAccountV3InstructionArgs, types::DataV2};

    use super::*;

    #[access_control(authorized_admin(&ctx.accounts.authority))]
    pub fn init_authority_pda(ctx: Context<AccountsForInitAuthorityPda>, bump: u8) -> Result<()> {
        let authority_pda_account = &mut ctx.accounts.authority_pda;
        authority_pda_account.authority = ctx.accounts.authority.key();
        authority_pda_account.bump = bump;
        msg!(
            "Authority pda created successfully: {}",
            authority_pda_account.key()
        );
        Ok(())
    }

    // pub fn initialize(ctx: Context<AccountsInvolvedInInitMintToken>) -> Result<()> {
    //     let seeds = &["mint".as_bytes(), &[*ctx.bumps.get("mint").unwrap()]];
    //     let signer = [&seeds[..]];

    //     let account_info = vec![
    //         ctx.accounts.metadata.to_account_info(),
    //         ctx.accounts.mint.to_account_info(),
    //         ctx.accounts.authority.to_account_info(),
    //         ctx.accounts.token_metadata_program.to_account_info(),
    //         ctx.accounts.token_program.to_account_info(),
    //         ctx.accounts.system_program.to_account_info(),
    //         ctx.accounts.rent.to_account_info(),
    //     ];

    //     let data: DataV2 = mpl_token_metadata::types::DataV2 {
    //         name: "Wrapped XLM",
    //         symbol: "W-XLM",
    //         uri: "ertyuio",
    //         seller_fee_basis_points: 100,
    //         creators: ,
    //         collection: None,
    //         uses: None,
    //     };

    //     let c = CreateMetadataAccountV3InstructionArgs{
    //          data: {
    //             name: "Wrapped XLM",
    //             symbol: "W-XLM",
    //             uri: "ertyuio",
    //             seller_fee_basis_points: 100,
    //             creators: ,
    //             collection: None,
    //             uses: None,
    //         },
    //          is_mutable: true,
    //          collection_details: None,
    //     };
    //     let i = CreateMetadataAccountV3::instruction(c);

    //     invoke_signed(
    //         &CreateMetadataAccountV3::instruction(
    //             ctx.accounts.token_metadata_program.key(), // token metadata program
    //             ctx.accounts.metadata.key(),               // metadata account PDA for mint
    //             ctx.accounts.mint.key(),                   // mint account
    //             ctx.accounts.mint.key(),                   // mint authority
    //             ctx.accounts.user.key(),                   // payer for transaction
    //             ctx.accounts.mint.key(),                   // update authority
    //             name,                                      // name
    //             symbol,                                    // symbol
    //             uri,                                       // uri (offchain metadata)
    //             None,                                      // (optional) creators
    //             0,                                         // seller free basis points
    //             true,                                      // (bool) update authority is signer
    //             true,                                      // (bool) is mutable
    //             None,                                      // (optional) collection
    //             None,                                      // (optional) uses
    //             None,                                      // (optional) collection details
    //         ),
    //         account_info.as_slice(),
    //         &signer,
    //     )?;
    //     Ok(())
    // }

    #[access_control(authorized_admin(&ctx.accounts.authority))]
    pub fn init_token_mint(ctx: Context<AccountsInvolvedInInitMintToken>) -> Result<()> {
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
            method: "Deposit".to_string(),
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
        ctx: Context<AccountsForClaim>,
        pubkey: [u8; 32],
        msg: Vec<u8>,
        sig: [u8; 64],
        bump: u8,
    ) -> Result<()> {
        msg!("claim method start executing");
        msg!("message{:?}", msg);
        msg!("pubKey{:?}", pubkey);
        msg!("sign of validator{:?}", sig);
        let ix: Instruction = load_instruction_at_checked(0, &ctx.accounts.ix_sysvar)?;
        msg!("ix: {:?}", ix);
        utils::verify_ed25519_ix(&ix, &pubkey, &msg, &sig)?;
        msg!("varify done");

        let user_pda_account = &mut ctx.accounts.user_pda;
        let user_account = &mut ctx.accounts.user;
        msg!("user pda counter: {}", user_pda_account.claim_counter);
        if user_pda_account.claim_counter == 0 {
            user_pda_account.bump = bump;
            user_pda_account.claim_counter = 0;
            user_pda_account.user = user_account.key();

            msg!(
                "User pda {} initialized successfully.",
                user_pda_account.key()
            );
        }

        // Parse counter
        let dummy_msg = msg.clone();
        let mut msg_str = String::from_utf8(dummy_msg.to_vec()).unwrap();
        let ctr_index = msg_str.find("\"tokenAddress\":").unwrap_or(msg_str.len());

        let mut counter_string: String =
            msg_str.drain(..ctr_index).collect::<String>().split_off(11);
        let passed_counter = counter_string
            .drain(..counter_string.len() - 1)
            .collect::<String>()
            .parse::<u64>()
            .unwrap();
        msg!("🚀 ~ file: a1.rs:45 ~ ctr: {}", passed_counter);

        let to_index = msg_str.find(",\"toChain\":").unwrap_or(msg_str.len());

        let mut to_string: String = msg_str.drain(..to_index).collect::<String>();
        let _to = to_string.drain(..to_string.len() - 46).collect::<String>();

        msg!("User address in msg {}", to_string);
        msg!(
            "User address in accounts {}",
            user_account.key().to_string()
        );
        if user_pda_account.claim_counter != passed_counter
            && user_account.key().to_string() != to_string
        {
            return Err(CustomErrorCode::WrongInvokation.into());
        }

        let mut message_string = String::from_utf8(msg.clone().to_vec()).unwrap();
        let deposit_method = message_string.contains("Deposit");

        // Parse amount
        let split_index = message_string
            .find("\"amount\":")
            .unwrap_or(message_string.len());
        let _amount_string = message_string.drain(..split_index).collect::<String>();
        let mut amount = message_string.split_off(9);
        msg!("Amount to be mint in str: {}", amount);

        let amt = amount
            .drain(..amount.len() - 1)
            .collect::<String>()
            .parse::<u64>()
            .unwrap();
        msg!("Amount to be mint: {}", amt);
        // Create the MintTo struct for our context

        if deposit_method {
            msg!("Mint method invoked");

            let authority_account = &mut ctx.accounts.authority_pda;

            let signer_seed = [
                constants::AUTHORITY_SEED_PREFIX.as_bytes(),
                authority_account.authority.as_ref(),
                &[authority_account.bump],
            ];
            let cpi_accounts = MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.token_account.to_account_info(),
                authority: authority_account.to_account_info(),
            };
            let binding = [&signer_seed[..]];
            let cpi_ctx = CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                cpi_accounts,
                &binding,
            );
            // let cpi_program = ctx.accounts.token_program.to_account_info();
            // // Create the CpiContext we need for the request
            // let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

            // // Execute anchor's helper function to mint tokens
            let _a = mint_to(cpi_ctx, amt)?;
        } else {
            msg!("Release method invoked");
            let (program_pda, generic_bump_seed) = Pubkey::find_program_address(
                &[b"soroban_solana", ctx.accounts.authority.key().as_ref()],
                ctx.program_id,
            );
            invoke_signed(
                &system_instruction::transfer(
                    &program_pda.key(),  // local var .key() // from
                    &user_account.key(), // to // double checked by deriving treasury PDA in program itself
                    amt,
                ),
                &[
                    ctx.accounts.program_pda.to_account_info(), // from
                    user_account.to_account_info(),             // to
                    ctx.accounts.system_program.to_account_info(),
                ],
                &[&[
                    "soroban_solana".as_ref(), // since signing using PDA, therefore passing signers seeds
                    ctx.accounts.authority.key().as_ref(),
                    &[generic_bump_seed],
                ]],
            )?;
        }

        emit!(ClaimEvent {
            amount: amt,
            claim_counter: user_pda_account.claim_counter,
            user_validator_address: user_pda_account.key()
        });

        user_pda_account.claim_counter += 1;
        msg!(
            "Now pda counter is increased to: {}",
            user_pda_account.claim_counter
        );

        Ok(())
    }

    pub fn withdraw(ctx: Context<BurnToken>, amount: u64, to: String) -> Result<()> {
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
            // sender: ctx.accounts.user.key(),
            method: "Burn".to_string(),
            amount: amount,
            token_address: "CB5ABZGAAFXZXB7XHAQT6SRT6JXH2TLIDVVHJVBEJEGD2CQAWNFD7D2U".to_string(),
            token_chain: 123,
            withdrawer_address: to,
            to_chain: 456,
            fee: 6000,
        });
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
