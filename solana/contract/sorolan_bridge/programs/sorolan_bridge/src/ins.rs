use anchor_lang::prelude::*;
use anchor_lang::solana_program::sysvar::instructions::ID as IX_ID;
use anchor_spl::token:: {Mint, Token, TokenAccount};
use anchor_spl::associated_token::AssociatedToken;

use crate::constants::{USER_SEED_PREFIX, TOKEN_SEED_PREFIX};
use crate::state::UserPda;

#[derive(Accounts)]
// #[instruction(
//   _token_seed: String
// )]
pub struct AccountsForInitToken<'info>{
  /// CHECK: New Metaplex Account being created
  #[account(mut)]
  pub metadata: UncheckedAccount<'info>,
  #[account(
      init,
      seeds = [TOKEN_SEED_PREFIX.as_bytes(),],
      bump,
      payer = authority,
      mint::decimals = 7,
      mint::authority = mint,
  )]
  pub mint: Account<'info, Mint>,
  #[account(mut)]
  pub authority: Signer<'info>,
  pub rent: Sysvar<'info, Rent>,
  pub system_program: Program<'info, System>,
  pub token_program: Program<'info, Token>,
  /// CHECK: account constraint checked in account trait
  #[account(address = mpl_token_metadata::ID)]
  pub token_metadata_program: UncheckedAccount<'info>,
}
#[derive(Accounts)]
pub struct AccountsForDeposit<'info> {
  #[account(mut)]
  pub user: Signer<'info>,
  #[account(mut)]
  /// CHECK:` doc comment explaining why no checks through types are necessary
  pub authority: AccountInfo<'info>,
  
  #[account(mut)]
  ///CHECK: program pda
  pub program_pda: AccountInfo<'info>,
  pub system_program: Program<'info, System>,
}

  #[derive(Accounts)]
  pub struct BurnToken<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
    #[account(mut, constraint = token_account.owner == user.key())]
    pub token_account: Account<'info, TokenAccount>,
    // #[account(mut)]
    // pub authority: AccountInfo<'info>,
  }

  #[derive(Accounts)]
  pub struct AccountsForClaim<'info>{ 
    #[account(mut)]
    pub claimer: Signer<'info>,                                  //Claimer, Invoker of the method
    ///CHECK: user address
    #[account(mut)]
    pub user: AccountInfo<'info>,                                // User address

    ///CHECK: validator address
    #[account(mut)]
    pub validator: AccountInfo<'info>,                                // Validator address
  
    ///CHECK: Authority address
    #[account(mut)]
    pub authority: AccountInfo<'info>,
    /// CHECK: address of program pda
    #[account(mut)]
    pub program_pda: AccountInfo<'info>,

    // #[account(
    //   mut,
    //   seeds = [
    //     AUTHORITY_SEED_PREFIX.as_bytes(),
    //     authority_pda.authority.as_ref(),
    //   ],
    //   bump = authority_pda.bump,
    // )]
    // pub authority_pda: Account<'info, AuthorityPda>,            // mint authority, used in mint method
  
    #[account(
      init_if_needed, 
      payer = claimer, 
      space = 10000,
      seeds = [USER_SEED_PREFIX.as_bytes(),validator.key().as_ref(), user.key().as_ref(),],
      bump,
    )]
    pub user_pda: Box<Account<'info, UserPda>>,                // Keep tracks of counter to prevent multiple invokation
    // pub user_pda: Account<'info, UserPda>,                     // Keep tracks of counter to prevent multiple invokation
  
    #[account(
      init_if_needed,
      payer = claimer, 
      associated_token::mint = mint, // the mint constraint has to be an account field for token initializations (not a public key)
      associated_token::authority = user,
    )]
    pub token_account: Account<'info, TokenAccount>,
    /// CHECK: This is the token that we want to mint
    #[account(mut,
      seeds = [TOKEN_SEED_PREFIX.as_bytes(),],
      bump,
      mint::authority = mint,
    )]
    pub mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    /// CHECK:` doc comment explaining why no checks through types are necessary
    #[account(address = IX_ID)]
    pub ix_sysvar: AccountInfo<'info>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
    }