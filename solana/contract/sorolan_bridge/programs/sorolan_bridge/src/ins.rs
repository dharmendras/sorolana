use anchor_lang::prelude::*;
use crate::state::*;
use crate::constants::*;

#[derive(Accounts)]
pub struct AccountsInvolvedInInitProgramPda<'info> 
{
    #[account(mut)]
    pub authority: Signer<'info>,
    // game
    #[account(
      init, 
      payer = authority, 
      space = 8,
      seeds = [
        PROGRAM_SEED_PREFIX.as_bytes(),
        authority.key().as_ref()
      ],
      bump
    )]
    pub program_pda: Account<'info, ProgramPda>,
    pub system_program: Program<'info, System>,
  }

#[derive(Accounts)]
pub struct AccountsForDeposit<'info> { 

   #[account(mut)]
   pub from: Signer<'info>,

   #[account(mut)]
   /// CHECK:` doc comment explaining why no checks through types are necessary
   pub authority: AccountInfo<'info>,
   
   #[account(
    mut,
    seeds = [
      PROGRAM_SEED_PREFIX.as_bytes(),
      authority.key.as_ref(),
      ],
      bump
    )]
    pub program_pda: Account<'info, ProgramPda>,
 
   pub system_program: Program<'info, System>,
}