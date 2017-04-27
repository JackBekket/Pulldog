


// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

//import each from 'async/each';


// Import our contract artifacts and turn them into usable abstractions.

import s_token_artifacts from '../../build/contracts/SDT.json'
import c_token_artifacts from '../../build/contracts/CDT.json'


//const async = require('async');

//const request = require('request-promise') ;
//var rp = request;
// MetaCoin is our usable abstraction, which we'll use through the code below.
var Token = contract(s_token_artifacts);
var Crowdsale = contract(c_token_artifacts);





// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;
//var event;

var ico_address;
var address;

var balance;
// var tokend;




window.App = {
  start: function() {
    var self = this;

    // Bootstrap the Token abstraction for Use.
    Token.setProvider(web3.currentProvider);

    Crowdsale.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];


        //Need(!!) to remove it when deploying live
        $("#transfer_to").val(accounts[1]);
        $("#mint_to").val(accounts[0]);
        console.log("accounts1");
        console.log(accounts[1]);






    });



//        There must be a functions that will be work onload
          self.refreshAddress();

        //  self.sendJSON();
  },

  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },

  setStatusPos: function (pos, msg){
  $(pos).html(msg);

  },

refreshAddress: function () {
  var self=this;
  var instance;
  var tok;
  console.log("refresh init");
  Token.deployed().then(function(instance) {
    tok=instance;
    console.log(tok);
    $("#tokdAddress").html(tok.address);
    console.log(tok.address);
//    self.ShowSupply();
    self.hubBalance();
    self.crowdsaleAddress();
    self.IcoBalance();

    return tok.symbol.call();
  }).then(function (sym) {
    $("#t_sym1").html(sym);
    $("#t_sym1-1").html(sym);
    console.log(sym);
  });
},



crowdsaleAddress: function () {
  var self=this;
  var instance;
  var tok;
  var ico;
  Crowdsale.deployed().then(function(instance) {
    ico=instance;
    ico_address=ico.address;
  //  console.log(tok);
  //  $("#tokdAddress").html(tok.address);
    console.log(ico.address);
    return ico.symbol.call();
  }).then(function (sym) {
    $("#t_sym2").html(sym);
    console.log(sym);
  });
},



  ShowSupply: function () {
    var self = this;
    var pos="#totalSup";
    var instance;
    var msg;
    var tok;
    Token.deployed().then(function(instance){
      tok=instance;
      msg="Wait..";
      self.setStatusPos(pos,msg);
       return tok.totalSupply.call()
        }).then(function (ts) {
    //     $("#totalSup").html(ts)
  //        console.log("ts:");
  //        console.log(ts);
        // Should I use msg=ts.valueOf(); ?
          msg=ts.valueOf();
          msg=web3.fromWei(msg);
          self.setStatusPos(pos,msg);
    });
  },


hubBalance: function () {
  var self=this;
  var pos="#balance";
  var instance;
  var msg;
  var tok;
  Token.deployed().then(function(instance){
    tok=instance;
    msg="Wait..";
    self.setStatusPos(pos,msg);
     return tok.balanceOf(account);
   }).then(function (tx) {
  //     $("#totalSup").html(ts)
        console.log("SDT balance");
        console.log("tx:");
        console.log(tx);
      // Should I use msg=ts.valueOf(); ?
        msg=tx.valueOf();
        msg=web3.fromWei(msg);
        self.setStatusPos(pos,msg);
  });

},



//Balance of ICO tokens
IcoBalance: function () {
  var self=this;
  var pos="#balance2";
  var instance;
  var msg;

  var ico;
  Crowdsale.deployed().then(function(instance){
    ico=instance;
    msg="Wait..";
    self.setStatusPos(pos,msg);
     return ico.balanceOf(account);
   }).then(function (tx) {
  //     $("#totalSup").html(ts)
        console.log("ico balance");
        console.log("tx:");
        console.log(tx);
      // Should I use msg=ts.valueOf(); ?
        msg=tx.valueOf();
        msg=web3.fromWei(msg);
        self.setStatusPos(pos,msg);
  });

},



sendToken: function () {
  console.log("button init");
  var self=this;
  var pos="#transfer_result";
  var instance;
  var msg;
  var tok;
  var val = $("#transfer_am").val();
  var to = $("#transfer_to").val();

  val=web3.toWei(val);
//  to=web3.toWei(val);


  Token.deployed().then(function(instance){
    console.log("transfer initiate");
    tok=instance;
    msg="Wait..";
    /**

    **/
     return tok.transfer(to, val, {from: account})
   }).then(function (tx) {
        console.log("transfer");
        console.log("tx:");
        console.log(tx);
        msg="Transaction complete";
        self.setStatusPos(pos,msg);
        self.refreshAddress();
  }).catch(function(e) {
      console.log(e);

     msg="Ошибка при отправке, смотри консоль";
     self.setStatusPos(pos,msg);
    });
},




sendICOToken: function () {
  var self=this;
  var pos="#transfer_result2";
  var instance;
  var msg;
  var ico;
  var val = $("#transfer_am2").val();
  var to = $("#transfer_to2").val();

  val=web3.toWei(val);
//  to=web3.toWei(val);


  Crowdsale.deployed().then(function(instance){
    ico=instance;
    msg="Wait..";



     return ico.transfer(to, val, {from: account})
   }).then(function (tx) {
        console.log("tx:");
        console.log(tx);
        msg="Transaction complete";
        self.setStatusPos(pos,msg);
        self.refreshAddress();
  }).catch(function(e) {
      console.log(e);

     msg="Ошибка при отправке, смотри консоль";
     self.setStatusPos(pos,msg);
    });
},



// Send to,val. Be aware of number type in "to".
sendTokVal: function (to,val) {
  var self=this;
//  var pos="#transfer_result";
  var instance;
  var msg;
  var tok;
//  var amnt;
//  val=web3.toWei(val);
//  to=web3.toWei(val);


  Token.deployed().then(function(instance){
    tok=instance;
//    msg="Wait..";

     return tok.transfer(to, val, {from: account})
   }).then(function (tx) {
        console.log("tx:");
        console.log(tx);
    //    msg="Transaction complete";
    //    self.setStatusPos(pos,msg);
    //    self.refreshAddress();
  }).catch(function(e) {
      console.log(e);

  //   msg="Ошибка при отправке, смотри консоль";
  //   setStatusPos(pos,msg);
    });
},



deployContract: function(){
  var self=this;

  var name=$("#t_name").val();
  var sym=$("#t_sym").val();
  var val=$("#t_val").val();
  val=Number(val);
  var dec=18;


  Token.new(val,name,dec,sym,{from:accounts[0],gas:3000000}).then(function(instance) {

    if(!instance.address) {
         console.log("Contract transaction send: TransactionHash: " + instance.transactionHash + " waiting to be mined...");

       } else {
         console.log("Contract mined! Address: " + instance.address);
         console.log(contract);
       }

//Этот адрес можно потом передавать на бекенд или куда-нибудь еще
   console.log(instance.address);

});
//Функция которая должна быть вызвана после размещения нового контракта.
//event.stopWatching();
//App.start();
// App.sellerInvoice();
//App.sellerCurrent();

},

startManager: function () {
  var self=this;

  var instance;
  var msg;
  var tok;

  var val = $("#address").val();
  address = val;

  self.start();
},


sendMoney: function () {

  var self=this;
  var pos="#money_result";
  var instance;
  var msg;
  var tok;
  var ico;

    var val = $("#fundAmount").val();
//  var to = $("#founder_ico").val();

  val=web3.toWei(val);
//  to=web3.toWei(val);


  Crowdsale.deployed().then(function(instance){
    console.log("crowdsale deployed");
    ico=instance;
    msg="Wait..";

     return ico.buy(account,{from: account, value:val, gas:3000000})
   }).then(function (tx) {
        console.log("tx:");
        console.log(tx);
        msg="Transaction complete";
        self.setStatusPos(pos,msg);
        self.refreshAddress();
  }).catch(function(e) {
      console.log(e);

     msg="Ошибка при отправке, смотри консоль";
     self.setStatusPos(pos,msg);
    });


},


Allow: function () {

  var self=this;
  var pos="#allow_result";
  var instance;
  var msg;
  var tok;
  var ico;

    var val = $("#allowAmount").val();
//  var to = $("#founder_ico").val();

  val=web3.toWei(val);
//  to=web3.toWei(val);


  Token.deployed().then(function(instance){
    tok=instance;
    msg="Wait..";

     return tok.approve(ico_address,val,{from: account,gas:3000000})
   }).then(function (tx) {
        console.log("tx:");
        console.log(tx);
        msg="Transaction complete";
        self.setStatusPos(pos,msg);
  //      self.refreshAddress();
  }).catch(function(e) {
      console.log(e);

     msg="Ошибка при отправке, смотри консоль";
     self.setStatusPos(pos,msg);
    });


},





buyForToken: function () {

  var self=this;
  var pos="#Tok_result";
  var instance;
  var msg;
  var tok;
  var ico;
//  var from;

    var val = $("#TokAmount").val();
//  var to = $("#founder_ico").val();

  val=web3.toWei(val);
//  to=web3.toWei(val);


  Crowdsale.deployed().then(function(instance){
    ico=instance;
    msg="Wait..";




     return ico.buyforTokens(account,val,{from:account,gas:4000000})
   }).then(function (tx) {
        console.log("tx:");
        console.log(tx);
        msg="Transaction complete";
        self.setStatusPos(pos,msg);
    //    self.refreshAddress();
  }).catch(function(e) {
      console.log(e);

     msg="Ошибка при отправке, смотри консоль";
     self.setStatusPos(pos,msg);
    });



},

checkAllowance: function () {
  var self=this;
  var pos="#All_result";
  var instance;
  var msg;
  var tok;
  var ico;
//  var from;

  //  var val = $("#TokAmount").val();
//  var to = $("#founder_ico").val();

//  val=web3.toWei(val);
//  to=web3.toWei(val);


  Token.deployed().then(function(instance){
    tok=instance;
    msg="Wait..";




     return tok.allowance(account,ico_address,{from:account,gas:4000000})
   }).then(function (tx) {
        console.log("tx:");
        console.log(tx);
        msg="Transaction complete";
        self.setStatusPos(pos,msg);
    //    self.refreshAddress();
  }).catch(function(e) {
      console.log(e);

     msg="Ошибка при отправке, смотри консоль";
     self.setStatusPos(pos,msg);
    });


},

changeAddress: function () {

  var self=this;
  var pos="#Ch_result";
  var instance;
  var msg;
  var tok;
  var ico;
//  var from;

    var val = $("#newAddr1").val();
//  var to = $("#founder_ico").val();

//  val=web3.toWei(val);
//  to=web3.toWei(val);


  Crowdsale.deployed().then(function(instance){
    ico=instance;
    msg="Wait..";




     return ico.changeTokenAddress(val,{from:account,gas:4000000})
   }).then(function (tx) {
        console.log("tx:");
        console.log(tx);
        msg="Transaction complete";
        self.setStatusPos(pos,msg);
    //    self.refreshAddress();
  }).catch(function(e) {
      console.log(e);

     msg="Ошибка при отправке, смотри консоль";
     self.setStatusPos(pos,msg);
    });



}




// End of window.App
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 Coin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});
