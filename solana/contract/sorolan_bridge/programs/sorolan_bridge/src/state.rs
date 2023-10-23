use anchor_lang::prelude::*;

#[account]
pub struct UserPda {
    pub claim_counter: u64,
    pub user: Pubkey,
    pub bump: u8
}

impl UserPda
{
    pub const LEN: usize =  std::mem::size_of::<UserPda>();
}
#[account]
pub struct AuthorityPda {
    pub authority: Pubkey, // game_authority
    pub bump: u8, // bump used to create this game_pda
}

impl AuthorityPda
{
    pub const LEN: usize =  std::mem::size_of::<AuthorityPda>();
}

// 5. Define the init token params
#[derive(AnchorSerialize, AnchorDeserialize, Debug, Clone)]
pub struct InitTokenParams {
    pub name: String,
    pub symbol: String,
    pub uri: String,
    pub decimals: u8,
}

#[event]
pub struct DepositEvent {
    // pub sender: Pubkey,    //32
    pub method: String,    //7
    pub amount: u64,        //8
    pub token_address: String, //40
    pub token_chain: u16,   //2
    pub reciever_address: String, //40
    pub to_chain: u16,  //2
    pub fee: u64,  //8
}
#[event]
pub struct ClaimEvent {
    pub amount: u64,
    pub claim_counter: u64,
    pub user_validator_address: Pubkey
}
#[event]
pub struct WithdrawEvent {
    // pub sender: Pubkey,
    pub method: String,
    pub amount: u64,
    pub token_address: String,
    pub token_chain: u16,
    pub withdrawer_address: String,
    pub to_chain: u16,
    pub fee: u64,
}

#[error_code]
pub enum CustomErrorCode {
    #[msg("Signature verification failed.")]
    SigVerificationFailed,
    #[msg("Only Admin can invoke this method")]
    WrongAdmin,
    #[msg("Wrong user or multiple times claimed.")]
    WrongInvokation,
}
