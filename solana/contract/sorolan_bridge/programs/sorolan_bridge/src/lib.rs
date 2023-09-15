mod constants;
mod ins;
mod state;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::{program::invoke, system_instruction};
use constants::AUTHORITY;

use ins::*;
use state::{CustomErrorCode, DepositEvent};
declare_id!("5w7LLcjXEwmzh3W8yhsxZxrPx6Xo83pa69kSf4mRZAUp");

#[program]
pub mod sorolan_bridge {
    use super::*;

    #[access_control(authorized_admin(&ctx.accounts.authority))]
    pub fn init_program_pda(ctx: Context<AccountsInvolvedInInitProgramPda>) -> Result<()>{
        let program_pda = &mut ctx.accounts.program_pda;
        let program_authority = &mut ctx.accounts.authority;
        msg!("Program pda: {}", program_pda.key());
        msg!("Program Authority: {}", program_authority.key());
        Ok(())
    }

    pub fn deposit(ctx: Context<AccountsForDeposit>, amount: u64, to: String) -> Result<()> {
        let program_id = ctx.program_id;

        // Derive the program's address using the program's ID
        let program_address =
            Pubkey::create_with_seed(&program_id, "MyProgramAddress", &program_id);

        msg!("Program Address: {:?}", program_address);
        let from_account = &ctx.accounts.from;
        let to_account = &ctx.accounts.program_pda;

        msg!("to_account:{}", to_account.key());
        //  transfer instruction
        let transfer_instruction =
            system_instruction::transfer(from_account.key, &to_account.key(), amount);

        // invoke the  transfer  instruction
        let _ = invoke(
            &transfer_instruction,
            &[from_account.to_account_info(), to_account.to_account_info()],
        );

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
