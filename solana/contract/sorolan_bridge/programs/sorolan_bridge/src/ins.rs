use anchor_lang::prelude::*;
use anchor_lang::solana_program::sysvar::instructions::ID as IX_ID;
use anchor_spl::token:: {Mint, Token, TokenAccount};
use anchor_spl::associated_token::AssociatedToken;
#[derive(Accounts)]
pub struct AccountsInvolvedInInitTokenMint<'info> 
{
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
      init,
      payer = authority,
      mint::decimals = 9,
      mint::authority = authority,
      mint::freeze_authority = authority,
    )]
    pub mint: Account<'info, Mint>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
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
pub struct AccountsInvolvedInMint<'info>{ 
  #[account(mut)]
  pub user: Signer<'info>,
  #[account(
    init_if_needed,
    payer = user, 
    associated_token::mint = mint, // the mint constraint has to be an account field for token initializations (not a public key)
    associated_token::authority = user,
    // mut, // mut cannot be provided with init
    constraint = token_account.owner == user.key()
  )]
  pub token_account: Account<'info, TokenAccount>,
  /// CHECK: This is the token that we want to mint
  #[account(mut)]
  pub mint: Account<'info, Mint>,
  pub token_program: Program<'info, Token>,
  pub associated_token_program: Program<'info, AssociatedToken>,
  /// CHECK:
  #[account(mut)]
  pub authority: AccountInfo<'info>,
  /// CHECK:` doc comment explaining why no checks through types are necessary
  #[account(address = IX_ID)]
  pub ix_sysvar: AccountInfo<'info>,
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
  pub struct AccountsForReleaseFunds<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    /// CHECK: address of program pda
    #[account(mut)]
    pub program_pda: AccountInfo<'info>,
    /// CHECK: address of the user
    #[account(mut)]
    pub receiver: AccountInfo<'info>,
    /// CHECK:` doc comment explaining why no checks through types are necessary
    #[account(address = IX_ID)]
    pub ix_sysvar: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
  }