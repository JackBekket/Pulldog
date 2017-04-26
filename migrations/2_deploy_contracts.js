//var ConvertLib = artifacts.require("./ConvertLib.sol");
//var MetaCoin = artifacts.require("./MetaCoin.sol");



var Token = artifacts.require("./SDT.sol");
var Crowdsale = artifacts.require("./CDT.sol");

module.exports = function(deployer) {


  deployer.deploy(Token);
  deployer.deploy(Crowdsale,Token.address);

};
