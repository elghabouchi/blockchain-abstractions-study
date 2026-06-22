export const TourismMarketplaceIDL = {
  address: 'ALddDbijDJGatBoQsvNXMGkqyeucEH3aLtLv81Z44hms',
  metadata: {
    name: 'tourism_marketplace',
    version: '0.1.0',
    spec: '0.1.0',
  },
  instructions: [
    {
      name: 'createArticle',
      discriminator: [84, 149, 127, 123, 55, 157, 179, 126],
      accounts: [
        { name: 'article', writable: true, pda: { seeds: [{ kind: 'arg', path: 'articleId' }, { kind: 'account', path: 'seller' }] } },
        { name: 'seller', writable: true, signer: true },
        { name: 'systemProgram', address: '11111111111111111111111111111111' },
      ],
      args: [
        { name: 'articleId', type: 'string' },
        { name: 'cid', type: 'string' },
      ],
    },
    {
      name: 'updateArticle',
      discriminator: [80, 144, 185, 212, 23, 126, 10, 76],
      accounts: [
        { name: 'article', writable: true, pda: { seeds: [{ kind: 'arg', path: 'articleId' }, { kind: 'account', path: 'seller' }] } },
        { name: 'seller', writable: true, signer: true },
        { name: 'systemProgram', address: '11111111111111111111111111111111' },
      ],
      args: [
        { name: 'articleId', type: 'string' },
        { name: 'cid', type: 'string' },
      ],
    },
    {
      name: 'deleteArticle',
      discriminator: [44, 147, 82, 85, 101, 204, 216, 181],
      accounts: [
        { name: 'article', writable: true, pda: { seeds: [{ kind: 'arg', path: 'articleId' }, { kind: 'account', path: 'seller' }] } },
        { name: 'seller', writable: true, signer: true },
        { name: 'systemProgram', address: '11111111111111111111111111111111' },
      ],
      args: [{ name: 'articleId', type: 'string' }],
    },
    {
      name: 'buyArticle',
      discriminator: [175, 51, 155, 152, 48, 209, 21, 202],
      accounts: [
        { name: 'article', writable: true, pda: { seeds: [{ kind: 'arg', path: 'articleId' }, { kind: 'account', path: 'seller' }] } },
        { name: 'seller', writable: true },
        { name: 'buyer', writable: true, signer: true },
        {
          name: 'purchaseHistory',
          writable: true,
          pda: { seeds: [{ kind: 'arg', path: 'historyId' }, { kind: 'account', path: 'buyer' }] },
        },
        { name: 'systemProgram', address: '11111111111111111111111111111111' },
      ],
      args: [
        { name: 'articleId', type: 'string' },
        { name: 'historyId', type: 'string' },
        { name: 'totalPrice', type: 'u64' },
        { name: 'cid', type: 'string' },
        { name: 'historyCid', type: 'string' },
      ],
    },
  ],
  accounts: [
    {
      name: 'Article',
      discriminator: [190, 223, 81, 111, 130, 251, 187, 202],
    },
    {
      name: 'PurchaseHistory',
      discriminator: [146, 182, 21, 190, 99, 157, 221, 104],
    },
  ],
  events: [
    {
      name: 'ArticlePurchased',
      discriminator: [186, 160, 198, 156, 146, 73, 220, 13],
    },
  ],
  types: [
    {
      name: 'Article',
      type: {
        kind: 'struct',
        fields: [
          { name: 'seller', type: 'pubkey' },
          { name: 'articleId', type: 'string' },
          { name: 'cid', type: 'string' },
        ],
      },
    },
    {
      name: 'PurchaseHistory',
      type: {
        kind: 'struct',
        fields: [
          { name: 'buyer', type: 'pubkey' },
          { name: 'seller', type: 'pubkey' },
          { name: 'historyId', type: 'string' },
          { name: 'cid', type: 'string' },
        ],
      },
    },
    {
      name: 'ArticlePurchased',
      type: {
        kind: 'struct',
        fields: [
          { name: 'buyer', type: 'pubkey' },
          { name: 'seller', type: 'pubkey' },
          { name: 'historyId', type: 'string' },
          { name: 'cid', type: 'string' },
        ],
      },
    },
  ],
  errors: [{ code: 6000, name: 'InvalidPrice', msg: 'Invalid price' }],
} as const

export type TourismMarketplace = typeof TourismMarketplaceIDL
