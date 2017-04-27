pragma solidity ^0.4.8;


import "./Zeppelin/token/StandardToken.sol";

import "./Zeppelin/ownership/Ownable.sol";

/*
 * CrowdsaleToken (CrowdsaleDummyToken)
 *
 * Simple ERC20 Token example, with crowdsale token creation
 * IMPORTANT NOTE: do not use or deploy this contract as-is.
 * It needs some changes to be production ready.
 */


 /* The token type is defines ERC20 compatable token which can be exchange to current ICO tokens. */
 contract token {
     mapping (address => uint) public balances;
     function transferFrom(address _from, address _to, uint256 _value) returns (bool success);
     function transfer(address _to, uint _value) returns (bool success);
     function balanceOf(address _owner) constant returns (uint balance);
     function approve(address _spender, uint _value) returns (bool success);
     function allowance(address _owner, address _spender) constant returns (uint remaining);

 }




contract CDT is StandardToken,Ownable {

  string public constant name = "CrowdsaleDummyToken";
  string public constant symbol = "CDT";
  uint public constant decimals = 18;
  uint public TOKEN_SUPPLY_LIMIT = 606 * 100000 * (1 ether / 1 wei);
  token public payableTokenAddress;
  uint public tokensGot;
  // replace with your fund collection multisig address
  address public constant multisig = 0x0;


  // 1 ether = 500 example tokens
  uint public constant PRICE = 606;


  event LogDebug(string message, uint checkvalue);
  event LogDebugAddr(string message, address checkaddress);

//-----CONSTRUCTOR---------
function CDT(token paybleToken){
  payableTokenAddress = token(paybleToken);
  LogDebugAddr("tokaddress",payableTokenAddress);
}
//-----------------------------

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


//



//Function allowing ICO participating for Ethereum ERC20 token holders.
///@param value - how much payable tokens will be paid.
/*
*   Logic of function is next - user, which want to participate in ICO for
*    ERC20 compatible Ethereum token (like FirstBlood or Chronobank) must invoke
*    allow function for himself on original paybale token contract and then invoke
*    buyforTokens function on ICO contract.
*    This function is checked for allowance from paybleToken contract, then it invoke
*    'transferFrom' function to ICO contract and provide buy ICO tokens.
*
*
*/
function buyforTokens(address recipient, uint value) {

//    LogDebug("value",value);
    //check for limit
    uint newTokens = value.mul(getPrice());
    if (totalSupply + newTokens > TOKEN_SUPPLY_LIMIT) throw;
  //  LogDebug("newTokens",newTokens);

    address thisaddress = this;

    LogDebugAddr("icoaddress", thisaddress);
    LogDebugAddr("tokaddress",payableTokenAddress);
    LogDebugAddr("recipientaddr",recipient);


    //check for allowance and transferFrom
    uint allowed = payableTokenAddress.allowance(recipient,thisaddress);
    LogDebug("2.2.1", value);
    LogDebug("2.2.2", allowed);



    if (allowed < value) throw;
  //  LogDebug("2.2.1", value);
  //  LogDebug("2.2.2", allowed);
    LogDebug("allowed > value", allowed);




    payableTokenAddress.transferFrom(recipient,this,value);
    LogDebug("transfered", value);



    tokensGot.add(value);

    totalSupply = totalSupply.add(newTokens);
    balances[recipient] = balances[recipient].add(newTokens);
    


  //  withdrawTokens(value);

    }

function withdrawTokens(uint amount) {

    payableTokenAddress.transfer(owner,amount);
}

// It is hack and shall not be used in production version
function changeTokenAddress(address newAddress) onlyOwner {

  payableTokenAddress = token(newAddress);
}

}
