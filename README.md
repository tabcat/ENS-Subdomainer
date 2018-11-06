# ENS-Subdomainer
client side ui for buying ENS subdomains from a registrar

built with embark framework: https://github.com/embark-framework/embark

warning: this code is sloppy and hasnt been organized, will probably remain a draft

!WIP!

what works?:

  Contract Reader works pretty well its under 'Advanced Utilities' tab
  
  ENS Auction should work well now
  
  ENS Subdomains tab needs to be configured manually when build and ran locally and not configured yet on Ropsten(waiting for ENS auction to complete :(

  # live ropsten!
  
  (ENS Subdomain seller not configured yet)
  
  https://ipfs.io/ipfs/QmSrRgW8pCY37hj22fwFGyiGtgy4dDvHsiD767ZmrXnZwg/index.html
  
  # build with NPM:
  
  $ npm -g install embark
  
  in root dir of cloned repo:
  
  $ npm install
  
  $ embark run
  
  should have a webpage popup in your defualt brower  
  
  # if your tx approvals hang you will need to change the blockchain provider (steps below)
  
  user accounts (import to your web3 provider):
  
  * deployer account with geth: 52db9f99fec3cbf20e9e0d5d9da7d6ed77c1d32f90480015546322b7e1c5df5b
  * deployer account with ganache is first account in ganache
  
  if you want to test the ENS Auction component you will need to transfer the eth subnode to the HashRegistrar Contract with the Contract Reader under 'Advanced Utilities'

  
  
  # set up ENS Auction for use:
  
  (if you dont know how the ens application contracts work this could be difficult)
  
  in the browser tab go to Advanced Utilities > Contract Reader
  
  (expanding the Toolbox at the bottom with make this a lot easier)
  
  check the owner of the root: (example: Pick a Contract: ENSRegistry, Pick a Method: owner, input: 0x0000000000000000000000000000000000000000000000000000000000000000)
  
  setSubnode of the 'eth' to the address the Hashregistrar contract was deployed to (check chains.json in project root)
  
  
  
  # change the blockchain provider:
  
  install ganache: https://truffleframework.com/ganache
  
  open ganache and go to settings(top right cog-wheel):
  
   under the server tab in settings change:
    
   Port Number: 7545 -> Port Number: 8545
   
   $ embark run
   
   
   
   # update the now variable
   
   with ganaches automine, calls to the blockchain use the time of the last tx as the now variable in solidity
          
   if you want to test any method that should use .call() you should send an empty tx with metamask first to update now
          
   
  

    

contact: baseless *at* gmx.com
