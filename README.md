# ENS-Subdomainer
client side ui for buying ENS subdomains from a registrar

built with embark framework: https://github.com/embark-framework/embark

warning: this code is sloppy and hasnt been organized

!WIP!

not on a public testnet yet.

what works?:

  Contract Reader works pretty well its under 'Advanced Utilities' tab
  
  ENS Auction should work well now
  
  anything under the 'Accounts' tab is completely useless atm



  # if your tx approvals hang you will need to change the blockchain provider (steps below)
  
  user accounts (import to your web3 provider):
  
  * deployer account with geth: 52db9f99fec3cbf20e9e0d5d9da7d6ed77c1d32f90480015546322b7e1c5df5b
  * deployer account with ganache is first account in ganache
  
  if you want to test the ENS Auction component you will need to transfer the eth subnode to the HashRegistrar Contract with the Contract Reader under 'Advanced Utilities'

  # build with NPM:
  
  $ npm -g install embark
  
  in root dir of cloned repo:
  
  $ npm install
  
  $ embark run
  
  should have a webpage popup in your defualt brower  
  
  
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
