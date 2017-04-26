# Pull Dog


   This app is example of how to accept Ethereum ERC20 compatible tokens on ICO.

   Logic of function is next - user, which want to participate in ICO for
    ERC20 compatible Ethereum token (like ```FirstBlood``` or ```Chronobank```) must
    invoke  ```allow``` function for himself on original paybale token contract and then  
    invoke ```buyforTokens``` function on ICO contract.
    This function is checked for ```allowance``` from paybleToken contract, then it
    invoke ```transferFrom```  function to ICO contract and provide buy ICO tokens.
