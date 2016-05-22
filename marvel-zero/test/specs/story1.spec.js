var should = require('chai').should();
var expect = require('chai').expect;
var assert = require('chai').assert;
var OneHeapNim = require('./helper/1-heap-nim');

describe('1-heap Nim game', function () {
  var oneHeapNim = null;
  beforeEach(function () {
    browser.url('/');
    oneHeapNim = new OneHeapNim(browser);

  });
  it('should have 10 "coins" on the page', function () {
    expect(oneHeapNim.coinCount()).to.equal(10);
  });

  it('should be able to remove coins by clicking on them', function () {
    var originalCoinCount = oneHeapNim.coinCount();
    oneHeapNim.removeCoin(2);
    var countCoinRemoved = originalCoinCount - oneHeapNim.coinCount();
    expect(countCoinRemoved).to.equal(2);
    
    
  });
});