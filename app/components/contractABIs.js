import EmbarkJS from 'Embark/EmbarkJS';

import ENSRegistry from 'Embark/contracts/ENSRegistry';
import FIFSRegistrar from 'Embark/contracts/FIFSRegistrar';
import HashRegistrar from 'Embark/contracts/HashRegistrar';
import PublicResolver from 'Embark/contracts/PublicResolver';
import SubdomainRegistrar from 'Embark/contracts/SubdomainRegistrar';
import SubdomainResolver from 'Embark/contracts/SubdomainResolver';

let Contracts = {   ////////////////////////////////////////////////////////////////////////marker///////////
  ENSRegistry: {
    name: "ENSRegistry",
    contractObj: ENSRegistry,
    abi: [
    	{
    		"constant": true,
    		"inputs": [
    			{
    				"name": "node",
    				"type": "bytes32"
    			}
    		],
    		"name": "resolver",
    		"outputs": [
    			{
    				"name": "",
    				"type": "address"
    			}
    		],
    		"payable": false,
    		"stateMutability": "view",
    		"type": "function"
    	},
    	{
    		"constant": true,
    		"inputs": [
    			{
    				"name": "node",
    				"type": "bytes32"
    			}
    		],
    		"name": "owner",
    		"outputs": [
    			{
    				"name": "",
    				"type": "address"
    			}
    		],
    		"payable": false,
    		"stateMutability": "view",
    		"type": "function"
    	},
    	{
    		"constant": false,
    		"inputs": [
    			{
    				"name": "node",
    				"type": "bytes32"
    			},
    			{
    				"name": "label",
    				"type": "bytes32"
    			},
    			{
    				"name": "owner",
    				"type": "address"
    			}
    		],
    		"name": "setSubnodeOwner",
    		"outputs": [],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "function"
    	},
    	{
    		"constant": false,
    		"inputs": [
    			{
    				"name": "node",
    				"type": "bytes32"
    			},
    			{
    				"name": "ttl",
    				"type": "uint64"
    			}
    		],
    		"name": "setTTL",
    		"outputs": [],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "function"
    	},
    	{
    		"constant": true,
    		"inputs": [
    			{
    				"name": "node",
    				"type": "bytes32"
    			}
    		],
    		"name": "ttl",
    		"outputs": [
    			{
    				"name": "",
    				"type": "uint64"
    			}
    		],
    		"payable": false,
    		"stateMutability": "view",
    		"type": "function"
    	},
    	{
    		"constant": false,
    		"inputs": [
    			{
    				"name": "node",
    				"type": "bytes32"
    			},
    			{
    				"name": "resolver",
    				"type": "address"
    			}
    		],
    		"name": "setResolver",
    		"outputs": [],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "function"
    	},
    	{
    		"constant": false,
    		"inputs": [
    			{
    				"name": "node",
    				"type": "bytes32"
    			},
    			{
    				"name": "owner",
    				"type": "address"
    			}
    		],
    		"name": "setOwner",
    		"outputs": [],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "function"
    	},
    	{
    		"inputs": [],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "constructor"
    	},
    	{
    		"anonymous": false,
    		"inputs": [
    			{
    				"indexed": true,
    				"name": "node",
    				"type": "bytes32"
    			},
    			{
    				"indexed": true,
    				"name": "label",
    				"type": "bytes32"
    			},
    			{
    				"indexed": false,
    				"name": "owner",
    				"type": "address"
    			}
    		],
    		"name": "NewOwner",
    		"type": "event"
    	},
    	{
    		"anonymous": false,
    		"inputs": [
    			{
    				"indexed": true,
    				"name": "node",
    				"type": "bytes32"
    			},
    			{
    				"indexed": false,
    				"name": "owner",
    				"type": "address"
    			}
    		],
    		"name": "Transfer",
    		"type": "event"
    	},
    	{
    		"anonymous": false,
    		"inputs": [
    			{
    				"indexed": true,
    				"name": "node",
    				"type": "bytes32"
    			},
    			{
    				"indexed": false,
    				"name": "resolver",
    				"type": "address"
    			}
    		],
    		"name": "NewResolver",
    		"type": "event"
    	},
    	{
    		"anonymous": false,
    		"inputs": [
    			{
    				"indexed": true,
    				"name": "node",
    				"type": "bytes32"
    			},
    			{
    				"indexed": false,
    				"name": "ttl",
    				"type": "uint64"
    			}
    		],
    		"name": "NewTTL",
    		"type": "event"
    	}
    ]
  },
  FIFSRegistrar: {    ////////////////////////////////////////////////////////////////////////marker///////////
    name: "FIFSRegistrar",
    contractObj: FIFSRegistrar,
    abi: [
    	{
    		"constant": false,
    		"inputs": [
    			{
    				"name": "subnode",
    				"type": "bytes32"
    			},
    			{
    				"name": "owner",
    				"type": "address"
    			}
    		],
    		"name": "register",
    		"outputs": [],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "function"
    	},
    	{
    		"inputs": [
    			{
    				"name": "ensAddr",
    				"type": "address"
    			},
    			{
    				"name": "node",
    				"type": "bytes32"
    			}
    		],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "constructor"
    	}
    ]
  },
  HashRegistrar: {    ////////////////////////////////////////////////////////////////////////marker///////////
    name: "HashRegistrar",
    contractObj: HashRegistrar,
    abi: [
    	{
    		"constant": false,
    		"inputs": [
    			{
    				"name": "_hash",
    				"type": "bytes32"
    			}
    		],
    		"name": "releaseDeed",
    		"outputs": [],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "function"
    	},
    	{
    		"constant": true,
    		"inputs": [
    			{
    				"name": "_hash",
    				"type": "bytes32"
    			}
    		],
    		"name": "getAllowedTime",
    		"outputs": [
    			{
    				"name": "",
    				"type": "uint256"
    			}
    		],
    		"payable": false,
    		"stateMutability": "view",
    		"type": "function"
    	},
    	{
    		"constant": false,
    		"inputs": [
    			{
    				"name": "unhashedName",
    				"type": "string"
    			}
    		],
    		"name": "invalidateName",
    		"outputs": [],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "function"
    	},
    	{
    		"constant": true,
    		"inputs": [
    			{
    				"name": "hash",
    				"type": "bytes32"
    			},
    			{
    				"name": "owner",
    				"type": "address"
    			},
    			{
    				"name": "value",
    				"type": "uint256"
    			},
    			{
    				"name": "salt",
    				"type": "bytes32"
    			}
    		],
    		"name": "shaBid",
    		"outputs": [
    			{
    				"name": "",
    				"type": "bytes32"
    			}
    		],
    		"payable": false,
    		"stateMutability": "pure",
    		"type": "function"
    	},
    	{
    		"constant": false,
    		"inputs": [
    			{
    				"name": "bidder",
    				"type": "address"
    			},
    			{
    				"name": "seal",
    				"type": "bytes32"
    			}
    		],
    		"name": "cancelBid",
    		"outputs": [],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "function"
    	},
    	{
    		"constant": true,
    		"inputs": [
    			{
    				"name": "_hash",
    				"type": "bytes32"
    			}
    		],
    		"name": "entries",
    		"outputs": [
    			{
    				"name": "",
    				"type": "uint8"
    			},
    			{
    				"name": "",
    				"type": "address"
    			},
    			{
    				"name": "",
    				"type": "uint256"
    			},
    			{
    				"name": "",
    				"type": "uint256"
    			},
    			{
    				"name": "",
    				"type": "uint256"
    			}
    		],
    		"payable": false,
    		"stateMutability": "view",
    		"type": "function"
    	},
    	{
    		"constant": true,
    		"inputs": [],
    		"name": "ens",
    		"outputs": [
    			{
    				"name": "",
    				"type": "address"
    			}
    		],
    		"payable": false,
    		"stateMutability": "view",
    		"type": "function"
    	},
    	{
    		"constant": false,
    		"inputs": [
    			{
    				"name": "_hash",
    				"type": "bytes32"
    			},
    			{
    				"name": "_value",
    				"type": "uint256"
    			},
    			{
    				"name": "_salt",
    				"type": "bytes32"
    			}
    		],
    		"name": "unsealBid",
    		"outputs": [],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "function"
    	},
    	{
    		"constant": false,
    		"inputs": [
    			{
    				"name": "_hash",
    				"type": "bytes32"
    			}
    		],
    		"name": "transferRegistrars",
    		"outputs": [],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "function"
    	},
    	{
    		"constant": true,
    		"inputs": [
    			{
    				"name": "",
    				"type": "address"
    			},
    			{
    				"name": "",
    				"type": "bytes32"
    			}
    		],
    		"name": "sealedBids",
    		"outputs": [
    			{
    				"name": "",
    				"type": "address"
    			}
    		],
    		"payable": false,
    		"stateMutability": "view",
    		"type": "function"
    	},
    	{
    		"constant": true,
    		"inputs": [
    			{
    				"name": "_hash",
    				"type": "bytes32"
    			}
    		],
    		"name": "state",
    		"outputs": [
    			{
    				"name": "",
    				"type": "uint8"
    			}
    		],
    		"payable": false,
    		"stateMutability": "view",
    		"type": "function"
    	},
    	{
    		"constant": false,
    		"inputs": [
    			{
    				"name": "_hash",
    				"type": "bytes32"
    			},
    			{
    				"name": "newOwner",
    				"type": "address"
    			}
    		],
    		"name": "transfer",
    		"outputs": [],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "function"
    	},
    	{
    		"constant": true,
    		"inputs": [
    			{
    				"name": "_hash",
    				"type": "bytes32"
    			},
    			{
    				"name": "_timestamp",
    				"type": "uint256"
    			}
    		],
    		"name": "isAllowed",
    		"outputs": [
    			{
    				"name": "allowed",
    				"type": "bool"
    			}
    		],
    		"payable": false,
    		"stateMutability": "view",
    		"type": "function"
    	},
    	{
    		"constant": false,
    		"inputs": [
    			{
    				"name": "_hash",
    				"type": "bytes32"
    			}
    		],
    		"name": "finalizeAuction",
    		"outputs": [],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "function"
    	},
    	{
    		"constant": true,
    		"inputs": [],
    		"name": "registryStarted",
    		"outputs": [
    			{
    				"name": "",
    				"type": "uint256"
    			}
    		],
    		"payable": false,
    		"stateMutability": "view",
    		"type": "function"
    	},
    	{
    		"constant": true,
    		"inputs": [],
    		"name": "launchLength",
    		"outputs": [
    			{
    				"name": "",
    				"type": "uint32"
    			}
    		],
    		"payable": false,
    		"stateMutability": "view",
    		"type": "function"
    	},
    	{
    		"constant": false,
    		"inputs": [
    			{
    				"name": "sealedBid",
    				"type": "bytes32"
    			}
    		],
    		"name": "newBid",
    		"outputs": [],
    		"payable": true,
    		"stateMutability": "payable",
    		"type": "function"
    	},
    	{
    		"constant": false,
    		"inputs": [
    			{
    				"name": "labels",
    				"type": "bytes32[]"
    			}
    		],
    		"name": "eraseNode",
    		"outputs": [],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "function"
    	},
    	{
    		"constant": false,
    		"inputs": [
    			{
    				"name": "_hashes",
    				"type": "bytes32[]"
    			}
    		],
    		"name": "startAuctions",
    		"outputs": [],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "function"
    	},
    	{
    		"constant": false,
    		"inputs": [
    			{
    				"name": "hash",
    				"type": "bytes32"
    			},
    			{
    				"name": "deed",
    				"type": "address"
    			},
    			{
    				"name": "registrationDate",
    				"type": "uint256"
    			}
    		],
    		"name": "acceptRegistrarTransfer",
    		"outputs": [],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "function"
    	},
    	{
    		"constant": false,
    		"inputs": [
    			{
    				"name": "_hash",
    				"type": "bytes32"
    			}
    		],
    		"name": "startAuction",
    		"outputs": [],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "function"
    	},
    	{
    		"constant": true,
    		"inputs": [],
    		"name": "rootNode",
    		"outputs": [
    			{
    				"name": "",
    				"type": "bytes32"
    			}
    		],
    		"payable": false,
    		"stateMutability": "view",
    		"type": "function"
    	},
    	{
    		"constant": false,
    		"inputs": [
    			{
    				"name": "hashes",
    				"type": "bytes32[]"
    			},
    			{
    				"name": "sealedBid",
    				"type": "bytes32"
    			}
    		],
    		"name": "startAuctionsAndBid",
    		"outputs": [],
    		"payable": true,
    		"stateMutability": "payable",
    		"type": "function"
    	},
    	{
    		"inputs": [
    			{
    				"name": "_ens",
    				"type": "address"
    			},
    			{
    				"name": "_rootNode",
    				"type": "bytes32"
    			},
    			{
    				"name": "_startDate",
    				"type": "uint256"
    			}
    		],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "constructor"
    	},
    	{
    		"anonymous": false,
    		"inputs": [
    			{
    				"indexed": true,
    				"name": "hash",
    				"type": "bytes32"
    			},
    			{
    				"indexed": false,
    				"name": "registrationDate",
    				"type": "uint256"
    			}
    		],
    		"name": "AuctionStarted",
    		"type": "event"
    	},
    	{
    		"anonymous": false,
    		"inputs": [
    			{
    				"indexed": true,
    				"name": "hash",
    				"type": "bytes32"
    			},
    			{
    				"indexed": true,
    				"name": "bidder",
    				"type": "address"
    			},
    			{
    				"indexed": false,
    				"name": "deposit",
    				"type": "uint256"
    			}
    		],
    		"name": "NewBid",
    		"type": "event"
    	},
    	{
    		"anonymous": false,
    		"inputs": [
    			{
    				"indexed": true,
    				"name": "hash",
    				"type": "bytes32"
    			},
    			{
    				"indexed": true,
    				"name": "owner",
    				"type": "address"
    			},
    			{
    				"indexed": false,
    				"name": "value",
    				"type": "uint256"
    			},
    			{
    				"indexed": false,
    				"name": "status",
    				"type": "uint8"
    			}
    		],
    		"name": "BidRevealed",
    		"type": "event"
    	},
    	{
    		"anonymous": false,
    		"inputs": [
    			{
    				"indexed": true,
    				"name": "hash",
    				"type": "bytes32"
    			},
    			{
    				"indexed": true,
    				"name": "owner",
    				"type": "address"
    			},
    			{
    				"indexed": false,
    				"name": "value",
    				"type": "uint256"
    			},
    			{
    				"indexed": false,
    				"name": "registrationDate",
    				"type": "uint256"
    			}
    		],
    		"name": "HashRegistered",
    		"type": "event"
    	},
    	{
    		"anonymous": false,
    		"inputs": [
    			{
    				"indexed": true,
    				"name": "hash",
    				"type": "bytes32"
    			},
    			{
    				"indexed": false,
    				"name": "value",
    				"type": "uint256"
    			}
    		],
    		"name": "HashReleased",
    		"type": "event"
    	},
    	{
    		"anonymous": false,
    		"inputs": [
    			{
    				"indexed": true,
    				"name": "hash",
    				"type": "bytes32"
    			},
    			{
    				"indexed": true,
    				"name": "name",
    				"type": "string"
    			},
    			{
    				"indexed": false,
    				"name": "value",
    				"type": "uint256"
    			},
    			{
    				"indexed": false,
    				"name": "registrationDate",
    				"type": "uint256"
    			}
    		],
    		"name": "HashInvalidated",
    		"type": "event"
    	}
    ]
  },
  PublicResolver: {   ////////////////////////////////////////////////////////////////////////marker///////////
    name: "PublicResolver",
    contractObj: PublicResolver,
    abi: [
    	{
    		"constant": true,
    		"inputs": [
    			{
    				"name": "interfaceID",
    				"type": "bytes4"
    			}
    		],
    		"name": "supportsInterface",
    		"outputs": [
    			{
    				"name": "",
    				"type": "bool"
    			}
    		],
    		"payable": false,
    		"stateMutability": "pure",
    		"type": "function"
    	},
    	{
    		"constant": false,
    		"inputs": [
    			{
    				"name": "node",
    				"type": "bytes32"
    			},
    			{
    				"name": "key",
    				"type": "string"
    			},
    			{
    				"name": "value",
    				"type": "string"
    			}
    		],
    		"name": "setText",
    		"outputs": [],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "function"
    	},
    	{
    		"constant": true,
    		"inputs": [
    			{
    				"name": "node",
    				"type": "bytes32"
    			},
    			{
    				"name": "contentTypes",
    				"type": "uint256"
    			}
    		],
    		"name": "ABI",
    		"outputs": [
    			{
    				"name": "contentType",
    				"type": "uint256"
    			},
    			{
    				"name": "data",
    				"type": "bytes"
    			}
    		],
    		"payable": false,
    		"stateMutability": "view",
    		"type": "function"
    	},
    	{
    		"constant": false,
    		"inputs": [
    			{
    				"name": "node",
    				"type": "bytes32"
    			},
    			{
    				"name": "x",
    				"type": "bytes32"
    			},
    			{
    				"name": "y",
    				"type": "bytes32"
    			}
    		],
    		"name": "setPubkey",
    		"outputs": [],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "function"
    	},
    	{
    		"constant": true,
    		"inputs": [
    			{
    				"name": "node",
    				"type": "bytes32"
    			}
    		],
    		"name": "content",
    		"outputs": [
    			{
    				"name": "",
    				"type": "bytes32"
    			}
    		],
    		"payable": false,
    		"stateMutability": "view",
    		"type": "function"
    	},
    	{
    		"constant": true,
    		"inputs": [
    			{
    				"name": "node",
    				"type": "bytes32"
    			}
    		],
    		"name": "addr",
    		"outputs": [
    			{
    				"name": "",
    				"type": "address"
    			}
    		],
    		"payable": false,
    		"stateMutability": "view",
    		"type": "function"
    	},
    	{
    		"constant": true,
    		"inputs": [
    			{
    				"name": "node",
    				"type": "bytes32"
    			},
    			{
    				"name": "key",
    				"type": "string"
    			}
    		],
    		"name": "text",
    		"outputs": [
    			{
    				"name": "",
    				"type": "string"
    			}
    		],
    		"payable": false,
    		"stateMutability": "view",
    		"type": "function"
    	},
    	{
    		"constant": false,
    		"inputs": [
    			{
    				"name": "node",
    				"type": "bytes32"
    			},
    			{
    				"name": "contentType",
    				"type": "uint256"
    			},
    			{
    				"name": "data",
    				"type": "bytes"
    			}
    		],
    		"name": "setABI",
    		"outputs": [],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "function"
    	},
    	{
    		"constant": true,
    		"inputs": [
    			{
    				"name": "node",
    				"type": "bytes32"
    			}
    		],
    		"name": "name",
    		"outputs": [
    			{
    				"name": "",
    				"type": "string"
    			}
    		],
    		"payable": false,
    		"stateMutability": "view",
    		"type": "function"
    	},
    	{
    		"constant": false,
    		"inputs": [
    			{
    				"name": "node",
    				"type": "bytes32"
    			},
    			{
    				"name": "name",
    				"type": "string"
    			}
    		],
    		"name": "setName",
    		"outputs": [],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "function"
    	},
    	{
    		"constant": false,
    		"inputs": [
    			{
    				"name": "node",
    				"type": "bytes32"
    			},
    			{
    				"name": "hash",
    				"type": "bytes"
    			}
    		],
    		"name": "setMultihash",
    		"outputs": [],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "function"
    	},
    	{
    		"constant": false,
    		"inputs": [
    			{
    				"name": "node",
    				"type": "bytes32"
    			},
    			{
    				"name": "hash",
    				"type": "bytes32"
    			}
    		],
    		"name": "setContent",
    		"outputs": [],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "function"
    	},
    	{
    		"constant": true,
    		"inputs": [
    			{
    				"name": "node",
    				"type": "bytes32"
    			}
    		],
    		"name": "pubkey",
    		"outputs": [
    			{
    				"name": "x",
    				"type": "bytes32"
    			},
    			{
    				"name": "y",
    				"type": "bytes32"
    			}
    		],
    		"payable": false,
    		"stateMutability": "view",
    		"type": "function"
    	},
    	{
    		"constant": false,
    		"inputs": [
    			{
    				"name": "node",
    				"type": "bytes32"
    			},
    			{
    				"name": "addr",
    				"type": "address"
    			}
    		],
    		"name": "setAddr",
    		"outputs": [],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "function"
    	},
    	{
    		"constant": true,
    		"inputs": [
    			{
    				"name": "node",
    				"type": "bytes32"
    			}
    		],
    		"name": "multihash",
    		"outputs": [
    			{
    				"name": "",
    				"type": "bytes"
    			}
    		],
    		"payable": false,
    		"stateMutability": "view",
    		"type": "function"
    	},
    	{
    		"inputs": [
    			{
    				"name": "ensAddr",
    				"type": "address"
    			}
    		],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "constructor"
    	},
    	{
    		"anonymous": false,
    		"inputs": [
    			{
    				"indexed": true,
    				"name": "node",
    				"type": "bytes32"
    			},
    			{
    				"indexed": false,
    				"name": "a",
    				"type": "address"
    			}
    		],
    		"name": "AddrChanged",
    		"type": "event"
    	},
    	{
    		"anonymous": false,
    		"inputs": [
    			{
    				"indexed": true,
    				"name": "node",
    				"type": "bytes32"
    			},
    			{
    				"indexed": false,
    				"name": "hash",
    				"type": "bytes32"
    			}
    		],
    		"name": "ContentChanged",
    		"type": "event"
    	},
    	{
    		"anonymous": false,
    		"inputs": [
    			{
    				"indexed": true,
    				"name": "node",
    				"type": "bytes32"
    			},
    			{
    				"indexed": false,
    				"name": "name",
    				"type": "string"
    			}
    		],
    		"name": "NameChanged",
    		"type": "event"
    	},
    	{
    		"anonymous": false,
    		"inputs": [
    			{
    				"indexed": true,
    				"name": "node",
    				"type": "bytes32"
    			},
    			{
    				"indexed": true,
    				"name": "contentType",
    				"type": "uint256"
    			}
    		],
    		"name": "ABIChanged",
    		"type": "event"
    	},
    	{
    		"anonymous": false,
    		"inputs": [
    			{
    				"indexed": true,
    				"name": "node",
    				"type": "bytes32"
    			},
    			{
    				"indexed": false,
    				"name": "x",
    				"type": "bytes32"
    			},
    			{
    				"indexed": false,
    				"name": "y",
    				"type": "bytes32"
    			}
    		],
    		"name": "PubkeyChanged",
    		"type": "event"
    	},
    	{
    		"anonymous": false,
    		"inputs": [
    			{
    				"indexed": true,
    				"name": "node",
    				"type": "bytes32"
    			},
    			{
    				"indexed": false,
    				"name": "indexedKey",
    				"type": "string"
    			},
    			{
    				"indexed": false,
    				"name": "key",
    				"type": "string"
    			}
    		],
    		"name": "TextChanged",
    		"type": "event"
    	},
    	{
    		"anonymous": false,
    		"inputs": [
    			{
    				"indexed": true,
    				"name": "node",
    				"type": "bytes32"
    			},
    			{
    				"indexed": false,
    				"name": "hash",
    				"type": "bytes"
    			}
    		],
    		"name": "MultihashChanged",
    		"type": "event"
    	}
    ]
  },
  SubdomainRegistrar: {   ////////////////////////////////////////////////////////////////////////marker///////////
    name: "SubdomainRegistrar",
    contractObj: SubdomainRegistrar,
    abi: [
    	{
    		"constant": true,
    		"inputs": [
    			{
    				"name": "label",
    				"type": "bytes32"
    			}
    		],
    		"name": "owner",
    		"outputs": [
    			{
    				"name": "",
    				"type": "address"
    			}
    		],
    		"payable": false,
    		"stateMutability": "view",
    		"type": "function"
    	},
    	{
    		"constant": false,
    		"inputs": [],
    		"name": "stop",
    		"outputs": [],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "function"
    	},
    	{
    		"constant": false,
    		"inputs": [
    			{
    				"name": "name",
    				"type": "string"
    			}
    		],
    		"name": "upgrade",
    		"outputs": [],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "function"
    	},
    	{
    		"constant": true,
    		"inputs": [],
    		"name": "migration",
    		"outputs": [
    			{
    				"name": "",
    				"type": "address"
    			}
    		],
    		"payable": false,
    		"stateMutability": "view",
    		"type": "function"
    	},
    	{
    		"constant": false,
    		"inputs": [
    			{
    				"name": "label",
    				"type": "bytes32"
    			},
    			{
    				"name": "resolver",
    				"type": "address"
    			}
    		],
    		"name": "setResolver",
    		"outputs": [],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "function"
    	},
    	{
    		"constant": true,
    		"inputs": [],
    		"name": "registrarOwner",
    		"outputs": [
    			{
    				"name": "",
    				"type": "address"
    			}
    		],
    		"payable": false,
    		"stateMutability": "view",
    		"type": "function"
    	},
    	{
    		"constant": true,
    		"inputs": [
    			{
    				"name": "label",
    				"type": "bytes32"
    			},
    			{
    				"name": "subdomain",
    				"type": "string"
    			}
    		],
    		"name": "query",
    		"outputs": [
    			{
    				"name": "domain",
    				"type": "string"
    			},
    			{
    				"name": "price",
    				"type": "uint256"
    			},
    			{
    				"name": "referralFeePPM",
    				"type": "uint256"
    			}
    		],
    		"payable": false,
    		"stateMutability": "view",
    		"type": "function"
    	},
    	{
    		"constant": true,
    		"inputs": [],
    		"name": "hashRegistrar",
    		"outputs": [
    			{
    				"name": "",
    				"type": "address"
    			}
    		],
    		"payable": false,
    		"stateMutability": "view",
    		"type": "function"
    	},
    	{
    		"constant": true,
    		"inputs": [],
    		"name": "ens",
    		"outputs": [
    			{
    				"name": "",
    				"type": "address"
    			}
    		],
    		"payable": false,
    		"stateMutability": "view",
    		"type": "function"
    	},
    	{
    		"constant": false,
    		"inputs": [
    			{
    				"name": "label",
    				"type": "bytes32"
    			},
    			{
    				"name": "subdomain",
    				"type": "string"
    			},
    			{
    				"name": "subdomainOwner",
    				"type": "address"
    			},
    			{
    				"name": "referrer",
    				"type": "address"
    			},
    			{
    				"name": "resolver",
    				"type": "address"
    			}
    		],
    		"name": "register",
    		"outputs": [],
    		"payable": true,
    		"stateMutability": "payable",
    		"type": "function"
    	},
    	{
    		"constant": false,
    		"inputs": [
    			{
    				"name": "_migration",
    				"type": "address"
    			}
    		],
    		"name": "setMigrationAddress",
    		"outputs": [],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "function"
    	},
    	{
    		"constant": false,
    		"inputs": [
    			{
    				"name": "label",
    				"type": "bytes32"
    			},
    			{
    				"name": "transferee",
    				"type": "address"
    			}
    		],
    		"name": "setTransferAddress",
    		"outputs": [],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "function"
    	},
    	{
    		"constant": false,
    		"inputs": [
    			{
    				"name": "label",
    				"type": "bytes32"
    			}
    		],
    		"name": "unlistDomain",
    		"outputs": [],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "function"
    	},
    	{
    		"constant": true,
    		"inputs": [],
    		"name": "stopped",
    		"outputs": [
    			{
    				"name": "",
    				"type": "bool"
    			}
    		],
    		"payable": false,
    		"stateMutability": "view",
    		"type": "function"
    	},
    	{
    		"constant": false,
    		"inputs": [
    			{
    				"name": "label",
    				"type": "bytes32"
    			},
    			{
    				"name": "newOwner",
    				"type": "address"
    			}
    		],
    		"name": "transfer",
    		"outputs": [],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "function"
    	},
    	{
    		"constant": true,
    		"inputs": [],
    		"name": "TLD_NODE",
    		"outputs": [
    			{
    				"name": "",
    				"type": "bytes32"
    			}
    		],
    		"payable": false,
    		"stateMutability": "view",
    		"type": "function"
    	},
    	{
    		"constant": false,
    		"inputs": [
    			{
    				"name": "name",
    				"type": "string"
    			}
    		],
    		"name": "migrate",
    		"outputs": [],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "function"
    	},
    	{
    		"constant": false,
    		"inputs": [
    			{
    				"name": "name",
    				"type": "string"
    			},
    			{
    				"name": "price",
    				"type": "uint256"
    			},
    			{
    				"name": "referralFeePPM",
    				"type": "uint256"
    			},
    			{
    				"name": "_owner",
    				"type": "address"
    			},
    			{
    				"name": "_transfer",
    				"type": "address"
    			}
    		],
    		"name": "configureDomainFor",
    		"outputs": [],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "function"
    	},
    	{
    		"constant": false,
    		"inputs": [
    			{
    				"name": "name",
    				"type": "string"
    			},
    			{
    				"name": "price",
    				"type": "uint256"
    			},
    			{
    				"name": "referralFeePPM",
    				"type": "uint256"
    			}
    		],
    		"name": "configureDomain",
    		"outputs": [],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "function"
    	},
    	{
    		"constant": false,
    		"inputs": [
    			{
    				"name": "newOwner",
    				"type": "address"
    			}
    		],
    		"name": "transferOwnership",
    		"outputs": [],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "function"
    	},
    	{
    		"inputs": [
    			{
    				"name": "_ens",
    				"type": "address"
    			}
    		],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "constructor"
    	},
    	{
    		"anonymous": false,
    		"inputs": [
    			{
    				"indexed": true,
    				"name": "label",
    				"type": "bytes32"
    			},
    			{
    				"indexed": false,
    				"name": "addr",
    				"type": "address"
    			}
    		],
    		"name": "TransferAddressSet",
    		"type": "event"
    	},
    	{
    		"anonymous": false,
    		"inputs": [
    			{
    				"indexed": true,
    				"name": "label",
    				"type": "bytes32"
    			},
    			{
    				"indexed": false,
    				"name": "name",
    				"type": "string"
    			}
    		],
    		"name": "DomainTransferred",
    		"type": "event"
    	},
    	{
    		"anonymous": false,
    		"inputs": [
    			{
    				"indexed": true,
    				"name": "label",
    				"type": "bytes32"
    			},
    			{
    				"indexed": true,
    				"name": "oldOwner",
    				"type": "address"
    			},
    			{
    				"indexed": true,
    				"name": "newOwner",
    				"type": "address"
    			}
    		],
    		"name": "OwnerChanged",
    		"type": "event"
    	},
    	{
    		"anonymous": false,
    		"inputs": [
    			{
    				"indexed": true,
    				"name": "label",
    				"type": "bytes32"
    			}
    		],
    		"name": "DomainConfigured",
    		"type": "event"
    	},
    	{
    		"anonymous": false,
    		"inputs": [
    			{
    				"indexed": true,
    				"name": "label",
    				"type": "bytes32"
    			}
    		],
    		"name": "DomainUnlisted",
    		"type": "event"
    	},
    	{
    		"anonymous": false,
    		"inputs": [
    			{
    				"indexed": true,
    				"name": "label",
    				"type": "bytes32"
    			},
    			{
    				"indexed": false,
    				"name": "subdomain",
    				"type": "string"
    			},
    			{
    				"indexed": true,
    				"name": "owner",
    				"type": "address"
    			},
    			{
    				"indexed": true,
    				"name": "referrer",
    				"type": "address"
    			},
    			{
    				"indexed": false,
    				"name": "price",
    				"type": "uint256"
    			}
    		],
    		"name": "NewRegistration",
    		"type": "event"
    	}
    ]
  },
  SubdomainResolver: {    ////////////////////////////////////////////////////////////////////////marker///////////
    name: "SubdomainResolver",
    contractObj: SubdomainResolver,
    abi: [
    	{
    		"constant": true,
    		"inputs": [
    			{
    				"name": "interfaceID",
    				"type": "bytes4"
    			}
    		],
    		"name": "supportsInterface",
    		"outputs": [
    			{
    				"name": "",
    				"type": "bool"
    			}
    		],
    		"payable": false,
    		"stateMutability": "pure",
    		"type": "function"
    	},
    	{
    		"constant": false,
    		"inputs": [
    			{
    				"name": "node",
    				"type": "bytes32"
    			},
    			{
    				"name": "key",
    				"type": "string"
    			},
    			{
    				"name": "value",
    				"type": "string"
    			}
    		],
    		"name": "setText",
    		"outputs": [],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "function"
    	},
    	{
    		"constant": true,
    		"inputs": [
    			{
    				"name": "node",
    				"type": "bytes32"
    			},
    			{
    				"name": "contentTypes",
    				"type": "uint256"
    			}
    		],
    		"name": "ABI",
    		"outputs": [
    			{
    				"name": "contentType",
    				"type": "uint256"
    			},
    			{
    				"name": "data",
    				"type": "bytes"
    			}
    		],
    		"payable": false,
    		"stateMutability": "view",
    		"type": "function"
    	},
    	{
    		"constant": false,
    		"inputs": [
    			{
    				"name": "node",
    				"type": "bytes32"
    			},
    			{
    				"name": "x",
    				"type": "bytes32"
    			},
    			{
    				"name": "y",
    				"type": "bytes32"
    			}
    		],
    		"name": "setPubkey",
    		"outputs": [],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "function"
    	},
    	{
    		"constant": true,
    		"inputs": [
    			{
    				"name": "node",
    				"type": "bytes32"
    			}
    		],
    		"name": "content",
    		"outputs": [
    			{
    				"name": "",
    				"type": "bytes32"
    			}
    		],
    		"payable": false,
    		"stateMutability": "view",
    		"type": "function"
    	},
    	{
    		"constant": true,
    		"inputs": [
    			{
    				"name": "node",
    				"type": "bytes32"
    			}
    		],
    		"name": "addr",
    		"outputs": [
    			{
    				"name": "",
    				"type": "address"
    			}
    		],
    		"payable": false,
    		"stateMutability": "view",
    		"type": "function"
    	},
    	{
    		"constant": true,
    		"inputs": [
    			{
    				"name": "node",
    				"type": "bytes32"
    			},
    			{
    				"name": "key",
    				"type": "string"
    			}
    		],
    		"name": "text",
    		"outputs": [
    			{
    				"name": "",
    				"type": "string"
    			}
    		],
    		"payable": false,
    		"stateMutability": "view",
    		"type": "function"
    	},
    	{
    		"constant": false,
    		"inputs": [
    			{
    				"name": "node",
    				"type": "bytes32"
    			},
    			{
    				"name": "contentType",
    				"type": "uint256"
    			},
    			{
    				"name": "data",
    				"type": "bytes"
    			}
    		],
    		"name": "setABI",
    		"outputs": [],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "function"
    	},
    	{
    		"constant": true,
    		"inputs": [
    			{
    				"name": "node",
    				"type": "bytes32"
    			}
    		],
    		"name": "name",
    		"outputs": [
    			{
    				"name": "",
    				"type": "string"
    			}
    		],
    		"payable": false,
    		"stateMutability": "view",
    		"type": "function"
    	},
    	{
    		"constant": false,
    		"inputs": [
    			{
    				"name": "node",
    				"type": "bytes32"
    			},
    			{
    				"name": "name",
    				"type": "string"
    			}
    		],
    		"name": "setName",
    		"outputs": [],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "function"
    	},
    	{
    		"constant": false,
    		"inputs": [
    			{
    				"name": "node",
    				"type": "bytes32"
    			},
    			{
    				"name": "hash",
    				"type": "bytes"
    			}
    		],
    		"name": "setMultihash",
    		"outputs": [],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "function"
    	},
    	{
    		"constant": false,
    		"inputs": [
    			{
    				"name": "node",
    				"type": "bytes32"
    			},
    			{
    				"name": "hash",
    				"type": "bytes32"
    			}
    		],
    		"name": "setContent",
    		"outputs": [],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "function"
    	},
    	{
    		"constant": true,
    		"inputs": [
    			{
    				"name": "node",
    				"type": "bytes32"
    			}
    		],
    		"name": "pubkey",
    		"outputs": [
    			{
    				"name": "x",
    				"type": "bytes32"
    			},
    			{
    				"name": "y",
    				"type": "bytes32"
    			}
    		],
    		"payable": false,
    		"stateMutability": "view",
    		"type": "function"
    	},
    	{
    		"constant": false,
    		"inputs": [
    			{
    				"name": "node",
    				"type": "bytes32"
    			},
    			{
    				"name": "addr",
    				"type": "address"
    			}
    		],
    		"name": "setAddr",
    		"outputs": [],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "function"
    	},
    	{
    		"constant": true,
    		"inputs": [
    			{
    				"name": "node",
    				"type": "bytes32"
    			}
    		],
    		"name": "multihash",
    		"outputs": [
    			{
    				"name": "",
    				"type": "bytes"
    			}
    		],
    		"payable": false,
    		"stateMutability": "view",
    		"type": "function"
    	},
    	{
    		"inputs": [
    			{
    				"name": "ensAddr",
    				"type": "address"
    			}
    		],
    		"payable": false,
    		"stateMutability": "nonpayable",
    		"type": "constructor"
    	},
    	{
    		"anonymous": false,
    		"inputs": [
    			{
    				"indexed": true,
    				"name": "node",
    				"type": "bytes32"
    			},
    			{
    				"indexed": false,
    				"name": "a",
    				"type": "address"
    			}
    		],
    		"name": "AddrChanged",
    		"type": "event"
    	},
    	{
    		"anonymous": false,
    		"inputs": [
    			{
    				"indexed": true,
    				"name": "node",
    				"type": "bytes32"
    			},
    			{
    				"indexed": false,
    				"name": "hash",
    				"type": "bytes32"
    			}
    		],
    		"name": "ContentChanged",
    		"type": "event"
    	},
    	{
    		"anonymous": false,
    		"inputs": [
    			{
    				"indexed": true,
    				"name": "node",
    				"type": "bytes32"
    			},
    			{
    				"indexed": false,
    				"name": "name",
    				"type": "string"
    			}
    		],
    		"name": "NameChanged",
    		"type": "event"
    	},
    	{
    		"anonymous": false,
    		"inputs": [
    			{
    				"indexed": true,
    				"name": "node",
    				"type": "bytes32"
    			},
    			{
    				"indexed": true,
    				"name": "contentType",
    				"type": "uint256"
    			}
    		],
    		"name": "ABIChanged",
    		"type": "event"
    	},
    	{
    		"anonymous": false,
    		"inputs": [
    			{
    				"indexed": true,
    				"name": "node",
    				"type": "bytes32"
    			},
    			{
    				"indexed": false,
    				"name": "x",
    				"type": "bytes32"
    			},
    			{
    				"indexed": false,
    				"name": "y",
    				"type": "bytes32"
    			}
    		],
    		"name": "PubkeyChanged",
    		"type": "event"
    	},
    	{
    		"anonymous": false,
    		"inputs": [
    			{
    				"indexed": true,
    				"name": "node",
    				"type": "bytes32"
    			},
    			{
    				"indexed": false,
    				"name": "indexedKey",
    				"type": "string"
    			},
    			{
    				"indexed": false,
    				"name": "key",
    				"type": "string"
    			}
    		],
    		"name": "TextChanged",
    		"type": "event"
    	},
    	{
    		"anonymous": false,
    		"inputs": [
    			{
    				"indexed": true,
    				"name": "node",
    				"type": "bytes32"
    			},
    			{
    				"indexed": false,
    				"name": "hash",
    				"type": "bytes"
    			}
    		],
    		"name": "MultihashChanged",
    		"type": "event"
    	}
    ]
  }
}

export default Contracts;
