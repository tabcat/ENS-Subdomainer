# ENS-Subdomainer
client side ui for buying ENS subdomains from a registrar

built with embark framework: https://github.com/embark-framework/embark

warning: this code is sloppy and hasnt been organized

!WIP!

not on a public testnet yet.

what works?:

  Contract Reader works pretty well its under 'Advanced Utilities' tab
  
  ENS Auction ui kind of works but needs to be able to see unfinalized auctions
  
  anything under the 'Accounts' tab is completely useless atm



  # if your tx approvals hang you will need to change the blockchain provider (steps below)
  
  user accounts (import to your web3 provider):
  
  * deployer account with geth: 52db9f99fec3cbf20e9e0d5d9da7d6ed77c1d32f90480015546322b7e1c5df5b
  * deployer account with ganache is first account in ganache

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
      
   Automine On -> Automine Off
      
   set Mining Block Time (seconds) to 5 or up 
        
   (dont let this run for long if you arent using it, it will keep making blocks;
          
   have to do this for the now variable in solidity/ganache's EVM to be utd in calls so you could
          
   probably just send an empty tx to update now but i havent tried it)
  
   $ embark run
    

contact: baseless *at* gmx.com
