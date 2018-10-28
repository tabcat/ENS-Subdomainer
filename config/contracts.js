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
      ENSRegistry: {
        "deploy": true
      },
      FIFSRegistrar: {
        "args": [
          "$ENSRegistry", "0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae"
        ]
      },
      HashRegistrar: {
        "args": [
          "$ENSRegistry", "0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae", "0"
        ],
        "onDeploy": [
          `ENSRegistry.methods.setSubnodeOwner(
          "0x0000000000000000000000000000000000000000000000000000000000000000",
          "0x4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0",
          HashRegistrar.options.address).send()`
        ]
      },
      PublicResolver: {
        "args": [
          "$ENSRegistry"
        ]
      },
      SubdomainRegistrar: {
        "args": [
          "$ENSRegistry"
        ],
        "onDeploy": [
          "$HashRegistrar"
        ]
      },
      SubdomainResolver: {
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
	
  infura: {
    deployment:{
      host: "ropsten.infura.io/v3/REDACTED",
      port: false,
      protocol: 'https',
      type: "rpc",
      accounts: [
        {
          "mnemonic": "REDACTED",
          "numAddresses": "2"
        }
      ]
    },

    contracts: {
      ENSRegistry: {
        fromIndex: 0,
        "address": "0x112234455C3a32FD11230C42E7Bccd4A84e02010"
      },
      FIFSRegistrar: {
        fromIndex: 0,
        "address": "0x21397c1A1F4aCD9132fE36Df011610564b87E24b"
      },
      HashRegistrar: {
        fromIndex: 0,
        "address": "0xc19fD9004B5c9789391679de6d766b981DB94610"
      },
      PublicResolver: {
        fromIndex: 0,
        "address": "0x4c641fb9bad9b60ef180c31f56051ce826d21a9a"
      },
      SubdomainRegistrar: {
        fromIndex: 0,
        "args": [
          "$ENSRegistry"
        ]
      },
      SubdomainResolver: {
        fromIndex: 0,
        "args": [
          "$ENSRegistry"
        ]
      }
    }
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
