pragma solidity ^0.4.8;


import "./StandardToken.sol";


/*
 * CrowdsaleToken (CrowdsaleDummyToken)
 *
 * Simple ERC20 Token example, with crowdsale token creation
 * IMPORTANT NOTE: do not use or deploy this contract as-is.
 * It needs some changes to be production ready.
 */
contract CDT is StandardToken {

  string public constant name = "CrowdsaleDummyToken";
  string public constant symbol = "CDT";
  uint public constant decimals = 18;
  uint public TOKEN_SUPPLY_LIMIT = 606 * 100000 * (1 ether / 1 wei);
  // replace with your fund collection multisig address
  address public constant multisig = 0x0;


  // 1 ether = 500 example tokens
  uint public constant PRICE = 606;

//fallback
  function () payable {
    buy(msg.sender);
  }



// Function buy tokens.
  function buy(address recipient) payable {
    if (msg.value == 0) {
      throw;
    }

    uint newTokens = msg.value.mul(getPrice());
    if (totalSupply + newTokens > TOKEN_SUPPLY_LIMIT) throw;
    totalSupply = totalSupply.add(newTokens);

    balances[recipient] = balances[recipient].add(newTokens);

    if (!multisig.send(msg.value)) {
      throw;
    }
  }

  // replace this with any other price function
  function getPrice() constant returns (uint result) {
    return PRICE;
  }


//Function allowing ICO participating for Ethereum ERC20 token holders.
function buyforTokens(address recepient) payable {
  
}




}
