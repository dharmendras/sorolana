use anchor_lang::prelude::*;

#[account]
pub struct ProgramPda {}

#[event]
pub struct DepositEvent {
    pub amount: u64,
    pub token_address: String,
    pub token_chain: u16,
    pub reciever_address: String,
    pub to_chain: u16,
    pub fee: u64,
}

#[error_code]
pub enum CustomErrorCode {
    #[msg("Signature verification failed.")]
    SigVerificationFailed,
    #[msg("Signature verification failed.")]
    WrongAdmin,
}
