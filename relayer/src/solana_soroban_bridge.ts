export type SolanaSorobanBridge = {
  "version": "0.1.0",
  "name": "solana_soroban_bridge",
  "instructions": [
    {
      "name": "hello",
      "accounts": [],
      "args": []
    },
    {
      "name": "deposite",
      "accounts": [
        {
          "name": "from",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "to",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "claim",
      "accounts": [
        {
          "name": "sender",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "pubkey",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "msg",
          "type": "bytes"
        },
        {
          "name": "sig",
          "type": {
            "array": [
              "u8",
              64
            ]
          }
        }
      ]
    }
  ],
  "events": [
    {
      "name": "DepositEvent",
      "fields": [
        {
          "name": "amount",
          "type": "u16",
          "index": false
        },
        {
          "name": "tokenAddress",
          "type": "string",
          "index": true
        },
        {
          "name": "tokenChain",
          "type": "u16",
          "index": false
        },
        {
          "name": "to",
          "type": "string",
          "index": false
        },
        {
          "name": "toChain",
          "type": "u16",
          "index": false
        },
        {
          "name": "fee",
          "type": "u16",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "SigVerificationFailed",
      "msg": "Signature verification failed."
    }
  ]
};

export const IDL: SolanaSorobanBridge = {
  "version": "0.1.0",
  "name": "solana_soroban_bridge",
  "instructions": [
    {
      "name": "hello",
      "accounts": [],
      "args": []
    },
    {
      "name": "deposite",
      "accounts": [
        {
          "name": "from",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "to",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "claim",
      "accounts": [
        {
          "name": "sender",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "pubkey",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "msg",
          "type": "bytes"
        },
        {
          "name": "sig",
          "type": {
            "array": [
              "u8",
              64
            ]
          }
        }
      ]
    }
  ],
  "events": [
    {
      "name": "DepositEvent",
      "fields": [
        {
          "name": "amount",
          "type": "u16",
          "index": false
        },
        {
          "name": "tokenAddress",
          "type": "string",
          "index": true
        },
        {
          "name": "tokenChain",
          "type": "u16",
          "index": false
        },
        {
          "name": "to",
          "type": "string",
          "index": false
        },
        {
          "name": "toChain",
          "type": "u16",
          "index": false
        },
        {
          "name": "fee",
          "type": "u16",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "SigVerificationFailed",
      "msg": "Signature verification failed."
    }
  ]
};