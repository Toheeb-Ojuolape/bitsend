<a href="http://promisesaplus.com/">
    <img src="https://promises-aplus.github.io/promises-spec/assets/logo-small.png"
         align="right" valign="top" alt="Promises/A+ logo" />
</a>

# Chain-able Chai promised test case method


Instead of manually writing many test cases for a promise

```javascript
return Promise.all([
  doSomethingAsync().should.eventually.have.deep.property('foo'),
  doSomethingAsync().should.eventually.have.deep.property('bar'),
  doSomethingAsync().should.eventually.have.deep.property('foobar')
])
```

you can write code that expresses what you really mean:

```javascript
return doSomethingAsync().should
  .eventually.have.deep.property('foo')
  .also.have.deep.property('bar')
  .also.have.deep.property('foobar')
  .exec()
```

In case `.also` is same as `.eventually` and `.to.eventually`, after all
you must call `.exec()` at the end of chain


## Usage

### Init test case

```javascript
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised')
var alsoChain = require('chai-as-promised-also-chain')

chai.use(chaiAsPromised)
chai.use(alsoChain)

var expect = chai.expect;

// OR

var should = chai.should();
```

### `should`/`expect` Interface

```javascript
expect(Promise.resolve({name: { first: 'maung', last: 'hla' }, age: 20}))
  .to.eventually
    .have.deep.property('name.first')
      .that.equal('maung')
  .also
    .have.all.keys(['name', 'age'])
  .exec()
```

```javascript
Promise.resolve({name: { first: 'maung', last: 'hla' }, age: 20}))
  .should.eventually
    .have.deep.property('name.first')
      .that.equal('maung')
  .also
    .have.all.keys(['name', 'age'])
  .exec()
```

### `notify()` is overwrite and that method make assertions for all chain

```javascript
promise.should
  .eventually.have.deep.property('name')
  .also.contain.all.keys(['name', 'age'])
  .notify(done) // this assertion is call for all promise in chain
```
