var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var OneHeapNim = require('./helper/1-heap-nim');

describe('1-heap Nim game', function () {
  this.timeout(5000);
  var oneHeapNim = null;
  beforeEach(function () {
    browser.get('/');
    oneHeapNim = new OneHeapNim(browser);

  });
  it('should have 10 "coins" on the page', function () {
    expect(oneHeapNim.coinCount()).to.eventually.equal(10);
  });

  it('should be able to remove coins by clicking on them', function (done) {
    oneHeapNim.coinCount().then(function(originalCoinCount){
      oneHeapNim.removeCoin(2).then(function(){
        oneHeapNim.coinCount().then(function(currentCoinCount){
          expect(originalCoinCount - currentCoinCount).to.equal(2);
          done();
        })
      });
    });    
  });
});