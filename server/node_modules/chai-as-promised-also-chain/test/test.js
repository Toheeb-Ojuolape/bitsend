'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var alsoChain = require('../index.js');

chai.use(chaiAsPromised);
chai.use(alsoChain);

var expect = chai.expect;
var should = chai.should();

function promiseWithPerson () {
  return Promise.resolve({
    name: {
      first: 'Maung',
      last: 'Hla'
    },
    age: 25,
    height: 6,
    heightUnit: 'ft'
  });
}

describe("Also assertion chain", function () {

  describe("#expect", function() {

    it('should success at `expect` assertion', function () {
      return expect(
        promiseWithPerson()
      )
      .to.eventually
        .have.deep.property('name.last')
          .that.equal('Hla')
      .also
        .have.all.keys([
          'name', 'age', 'height', 'heightUnit'
        ])
      .exec()
    })

    it('should throw expection at `expect` assertion', function () {
      return expect(
        promiseWithPerson()
      )
      .to.eventually
        .have.deep.property('name.last')
          .that.equal('Maung')
      .also
        .have.all.keys([
          'name', 'age', 'height', 'heightUnit'
        ])
      .exec()
      .then(function () {
        throw new Error('This must be success')
      }, function (err) {
        return true;
      })
    })

  })

  describe("#should", function() {

    it('should success at `should` assertion', function () {
      promiseWithPerson().should
        .eventually
          .have.deep.property('name.last')
            .that.equal('Hla')
        .also
          .have.all.keys([
            'name', 'age', 'height', 'heightUnit'
          ])
        .exec()
    })

    it('should throw expection at `expect` assertion', function () {
      promiseWithPerson().should
        .eventually
          .have.deep.property('name.last')
            .that.equal('Maung')
        .also
          .have.all.keys([
            'name', 'age', 'height', 'heightUnit'
          ])
        .exec()
        .then(function () {
          throw new Error('This must be success')
        }, function (err) {
          return true;
        })
    })

  })
})
