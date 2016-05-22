var oneHeapNim = function (broswer) {
    var coinCount = function () {
        return element.all(by.css('.coin')).count();
    };
    var removeCoin = function(NumOfCoins){
        element(by.css('.coin:nth-of-type(1)')).click();
        element(by.css('.coin:nth-of-type(2)')).click();
        return element(by.css('.btn-confirm-removing')).click();
    };
    return {
        coinCount: coinCount,
        removeCoin: removeCoin
    };
};
module.exports = oneHeapNim;

