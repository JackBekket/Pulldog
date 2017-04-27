//var ConvertLib = artifacts.require("./ConvertLib.sol");
//var MetaCoin = artifacts.require("./MetaCoin.sol");



var Token = artifacts.require("./SDT.sol");
var Crowdsale = artifacts.require("./CDT.sol");

module.exports = function(deployer) {


  // WARNING  - there is fantom bug with testrpc when deployed like it is decribed below
  // if you can't deploy it to testrpc with bug about 'network id'

  deployer.deploy(Token).then(function () {
    return deployer.deploy(Crowdsale, Token.address);
  })



//  deployer.deploy(Crowdsale,Token.address);

};
