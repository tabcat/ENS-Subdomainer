module.exports = {
  // default applies to all environments
  default: {
    // Blockchain node to deploy the contracts
    deployment: {
      host: "localhost", // Host of the blockchain node
      port: 8545, // Port of the blockchain node
      type: "rpc", // Type of connection (ws or rpc),
      // Accounts to use instead of the default account to populate your wallet
			accounts: [
        {
          privateKey: "C87509A1C067BBDE78BEB793E6FA76530B6382A4C0241E5E4A9EC0A0F44DC0D3",
          balance: "100 ether"
        }
      ]
    },
    // order of connections the dapp should connect to
    dappConnection: [
      "$WEB3",  // uses pre existing web3 object if available (e.g in Mist)
      "ws://localhost:8546",
      "http://localhost:8545"
    ],
    gas: "auto",
    contracts: {
      ENS: {
        "deploy": false
      },
      ENSRegistry: {
        "fromIndex": 0
      },
      FIFSRegistrar: {
        "fromIndex": 0,
        "args": [
          "$ENSRegistry", "0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae"
        ]
      },
      HashRegistrar: {
        "fromIndex": 0,
        "args": [
          "$ENSRegistry", "0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae", "0"
        ]
      },
      SubdomainInterface: {
        "deploy": false
      },
      SubdomainRegistrar: {
        "fromIndex": 0,
        "args": [
          "$ENSRegistry"
        ]
      }
    }
	},

  // default environment, merges with the settings in default
  // assumed to be the intended environment by `embark run`
  development: {
    dappConnection: [
      "$WEB3",  // uses pre existing web3 object if available (e.g in Mist)
      "ws://localhost:8546",
      "http://localhost:8545"
    ]
  },

  // merges with the settings in default
  // used with "embark run privatenet"
  privatenet: {
  },

  // merges with the settings in default
  // used with "embark run testnet"
  testnet: {
  },

  // merges with the settings in default
  // used with "embark run livenet"
  livenet: {
  },

  // you can name an environment with specific settings and then specify with
  // "embark run custom_name" or "embark blockchain custom_name"
  //custom_name: {
  //}
};
