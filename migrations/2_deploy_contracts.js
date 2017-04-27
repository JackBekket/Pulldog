//var ConvertLib = artifacts.require("./ConvertLib.sol");
//var MetaCoin = artifacts.require("./MetaCoin.sol");



var Token = artifacts.require("./SDT.sol");
var Crowdsale = artifacts.require("./CDT.sol");

module.exports = function(deployer) {


  // WARNING  - there is fantom bug with testrpc when deployed like it is decribed below
  // if you can't deploy it to testrpc with bug about 'network id' -
  // just comment line 17, run 'truffle migrate reset', then uncomment it and repete deployment. 

  deployer.deploy(Token);
  deployer.deploy(Crowdsale,Token.address);

};
