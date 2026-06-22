#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;
use anchor_lang::system_program;


declare_id!("ALddDbijDJGatBoQsvNXMGkqyeucEH3aLtLv81Z44hms");

/// Anchor discriminator size in bytes.
pub const DISCRIMINATOR: usize = 8;

#[program]
pub mod tourism_marketplace {
    use super::*;

    pub fn create_article(ctx: Context<CreateArticle>, article_id: String, cid: String) -> Result<()> {
        let article = &mut ctx.accounts.article;
        article.seller = ctx.accounts.seller.key();
        article.article_id = article_id;
        article.cid = cid;
        Ok(())
    }

    pub fn update_article(ctx: Context<UpdateArticle>, _article_id: String, cid: String) -> Result<()> {
        let article = &mut ctx.accounts.article;
        article.cid = cid;
        Ok(())
    }

    pub fn delete_article(_ctx: Context<DeleteArticle>, _article_id: String) -> Result<()> {
        Ok(())
    }

    pub fn buy_article(
        ctx: Context<BuyArticle>,
        _article_id: String,
        history_id: String,
        total_price: u64,
        cid: String,
        history_cid: String,
    ) -> Result<()> {
        require!(total_price > 0, ErrorCode::InvalidPrice);

        let article = &mut ctx.accounts.article;
        article.cid = cid;

        let cpi_ctx = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.buyer.to_account_info(),
                to: ctx.accounts.seller.to_account_info(),
            },
        );
        system_program::transfer(cpi_ctx, total_price)?;

        let purchase_history = &mut ctx.accounts.purchase_history;
        purchase_history.buyer = ctx.accounts.buyer.key();
        purchase_history.seller = ctx.accounts.seller.key();
        purchase_history.history_id = history_id.clone();
        purchase_history.cid = history_cid.clone();

        emit!(ArticlePurchased {
            buyer: ctx.accounts.buyer.key(),
            seller: ctx.accounts.seller.key(),
            cid: history_cid,
            history_id,
        });

        Ok(())
    }
}

#[account]
#[derive(InitSpace)]
pub struct Article {
    pub seller: Pubkey,
    #[max_len(50)]
    pub article_id: String,
    #[max_len(60)] 
    pub cid: String,
}

#[derive(Accounts)]
#[instruction(article_id: String)]
pub struct CreateArticle<'info> {
    #[account(
        init,
        payer = seller,
        space = DISCRIMINATOR + Article::INIT_SPACE, 
        seeds = [article_id.as_bytes(), seller.key().as_ref()],
        bump
    )]
    pub article: Account<'info, Article>,
    
    #[account(mut)]
    pub seller: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct PurchaseHistory {
    pub buyer: Pubkey,
    pub seller: Pubkey,
    #[max_len(50)]
    pub history_id: String,
    #[max_len(60)]
    pub cid: String,
}

#[derive(Accounts)] 
#[instruction(article_id: String)]
pub struct DeleteArticle<'info> {
    #[account(
        mut,
        seeds = [article_id.as_bytes(), seller.key().as_ref()],
        bump,
        close = seller,
    )]
    pub article: Account<'info, Article>,
    
    #[account(mut)]
    pub seller: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(article_id: String)]
pub struct UpdateArticle<'info> {
    #[account(
        mut,
        seeds = [article_id.as_bytes(), seller.key().as_ref()],
        bump,
        realloc = DISCRIMINATOR + Article::INIT_SPACE,
        realloc::payer = seller,
        realloc::zero = true,
    )]
    pub article: Account<'info, Article>,
    
    #[account(mut)]
    pub seller: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(article_id: String, history_id: String)]
pub struct BuyArticle<'info> {
    #[account(
        mut,
        seeds = [article_id.as_bytes(), seller.key().as_ref()],
        bump,
    )]
    pub article: Account<'info, Article>,

    /// CHECK: The seller account only receives lamports and is not read as structured data.
    #[account(mut)]
    pub seller: AccountInfo<'info>,

    #[account(mut)]
    pub buyer: Signer<'info>,

    #[account(
        init,
        payer = buyer,
        space = DISCRIMINATOR + PurchaseHistory::INIT_SPACE,
        seeds = [history_id.as_bytes(), buyer.key().as_ref()],
        bump
    )]
    pub purchase_history: Account<'info, PurchaseHistory>,

    pub system_program: Program<'info, System>,
}

#[event]
pub struct ArticlePurchased {
    pub buyer: Pubkey,
    pub seller: Pubkey,
    pub history_id: String,
    pub cid: String,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid price")]
    InvalidPrice,
}
