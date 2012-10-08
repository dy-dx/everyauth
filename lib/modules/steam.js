var openidModule = require('./openid')
  , oid = require('openid')
  , extractHostname = require('../utils').extractHostname;

var steam = module.exports =
openidModule.submodule('steam')
  .configurable({
       // scope: 'array of desired google api scopes'
     // , consumerKey: 'Consumer Key'
     // , consumerSecret: 'Consumer Secret'
  })
  .definit( function () {
    this.relyingParty =
      new oid.RelyingParty(this._myHostname + this._callbackPath, this._myHostname, true, false, []);
  })
  .verifyAttributes(function (req,res) {
    var p = this.Promise();
    this.relyingParty.verifyAssertion(req, function (err, userAttributes) {
      if(err) return p.fail(err);
      p.fulfill(userAttributes);
    });
    return p;
  })
  .sendToAuthenticationUri(function (req, res) {

    // Automatic hostname detection + assignment
    if (!this._myHostname || this._alwaysDetectHostname) {
      this.myHostname(extractHostname(req));
    }
    
    var self = this;
    
    this.relyingParty.authenticate('http://steamcommunity.com/openid', false, function (err,authenticationUrl){
      if(err) return p.fail(err);
      self.redirect(res, authenticationUrl);
    });
  }) 
  .entryPath('/auth/steam')
  .callbackPath('/auth/steam/callback');
