var angular = require("angular");
var b = require("./b");
var app = angular.module("app", []);
app.controller("oneHeapNimCtrl", [function () {
    var vm = this;
    vm.coins = [];
    (function init() {
        for (var i = 0; i < 10; i++) {
            vm.coins.push({ isRemoving: false });
        }
    } ());
    vm.removeCoin = function (coin) {
        b();
        coin.isRemoving = true;
    };
    vm.confirmRemoving = function () {
        vm.coins.forEach(function (coin) {
            if (coin.isRemoving) {
                coin.isRemoved = true;
            }
        });
    };
}]);