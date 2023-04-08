'use strict';

module.exports = function (chai, utils) {
  var Assertion = chai.Assertion;

  function isLegacyJQueryPromise(thenable) {
      // jQuery promises are Promises/A+-compatible since 3.0.0. jQuery 3.0.0 is also the first version
      // to define the catch method.
      return typeof thenable.catch !== "function" &&
             typeof thenable.always === "function" &&
             typeof thenable.done === "function" &&
             typeof thenable.fail === "function" &&
             typeof thenable.pipe === "function" &&
             typeof thenable.progress === "function" &&
             typeof thenable.state === "function";
  }

  function assertIsAboutPromise(assertion) {
    if (typeof assertion._obj.then !== "function") {
      throw new TypeError(utils.inspect(assertion._obj) + " is not a thenable.");
    }
    if (isLegacyJQueryPromise(assertion._obj)) {
      throw new TypeError("Chai as Promised is incompatible with thenables of jQuery<3.0.0, sorry! Please " +
                          "upgrade jQuery or use another Promises/A+ compatible library (see " +
                          "http://promisesaplus.com/).");
    }
  }

  function method(name, asserter) {
    utils.addMethod(Assertion.prototype, name, function () {
      assertIsAboutPromise(this);
      return asserter.apply(this, arguments);
    });
  }

  function property(name, asserter) {
    utils.addProperty(Assertion.prototype, name, function () {
      assertIsAboutPromise(this);
      return asserter.apply(this, arguments);
    });
  }

  method('exec', function () {
    var chain = this._promiseChain || [];

    if (typeof this.then === 'function') {
      chain.push(this.then)
    }

    return Promise.all(
      chain.map(function (thenable) {
        return new Promise(function (resolve, reject) {
          thenable(resolve, reject);
        })
      })
    )
  })

  method('notify', function (done) {
    this.exec().then(done);
  })

  property('also', function () {
    var basePromise = this._obj;
    var chain = this._promiseChain || [];

    if (typeof this.then !== 'function') {
      return this;
    }

    chain.push(this.then);

    var newAssertion = (new Assertion(basePromise));
    newAssertion._promiseChain = chain;

    return newAssertion.to.eventually;
  });

}
