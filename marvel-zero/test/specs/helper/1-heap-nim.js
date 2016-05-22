(function () {
    var oneHeapNim = function (broswer) {
        var coinCount = function () {
            return browser.elements('.coin').value.length;
        };
        var removeCoin = function(NumOfCoins){
            browser.click('.coin:nth-of-type(1)');
            browser.click('.coin:nth-of-type(2)');
            return browser.click('.btn-confirm-removing');
        };
        return {
            coinCount: coinCount,
            removeCoin: removeCoin
        };
    };
    module.exports = oneHeapNim;
} ());
