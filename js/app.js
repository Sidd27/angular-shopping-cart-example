var app = angular.module('onlineRetail', []);

app.controller('addToCartCtrl', ['$scope', '$http', 'retailDataSvc', '$localstorage', function($scope, $http, retailDataSvc, $localstorage) {
    var i;
    var quantityList = {};
    var sum = 0;

    $scope.finalList = $localstorage.getObject('finalList') || [];

    for (i = 0; i < $scope.finalList.length; i++) {
        sum = sum + (parseFloat($scope.finalList[i].price) * $scope.finalList[i].quantity);
        quantityList[$scope.finalList[i].id] = $scope.finalList[i].quantity;
    }

    $scope.totalPrice = sum || 0;

    retailDataSvc.fetch().then(function(data) {
        var items = data.data;
        if ($scope.finalList.length > 0) {
            items.forEach(function(item, i) {
                if (typeof quantityList[item.id] !== "undefined") {
                    items[i].quantity = quantityList[item.id];
                }
            });
        }
        $scope.items = items;

        function getIndexInArray(array, obj) {
            for (var i = 0; i < array.length; i++) {
                if (array[i].id === obj.id) {
                    return i;
                }
            }
            return -1;
        }

        function removeFromFinalList(obj) {
            var index = getIndexInArray($scope.finalList, obj);
            $scope.finalList.splice(index, 1);
        }

        $scope.addToCart = function(item) {
            item.quantity = item.quantity || 1;
            var index = getIndexInArray($scope.finalList, item);
            if (index !== -1) {
                item.quantity++;
                $scope.finalList[index].quantity = item.quantity;
            } else {
                $scope.finalList.push(item);
            }
            $scope.totalPrice = $scope.totalPrice + parseFloat(item.price);
            $localstorage.setObject("finalList", $scope.finalList);
        };

        $scope.subtractFromCart = function(item) {
            var index = getIndexInArray($scope.finalList, item);
            if (item.quantity > 1) {
                item.quantity--;
                $scope.finalList[index].quantity = item.quantity;
            } else {
                delete item.quantity;
                removeFromFinalList(item);
            }
            $scope.totalPrice = $scope.totalPrice - parseFloat(item.price);
            $localstorage.setObject("finalList", $scope.finalList);
        }

        $scope.removeFullProduct = function(item) {
            $scope.totalPrice = $scope.totalPrice - (parseFloat(item.price) * Number(item.quantity));
            var index = getIndexInArray($scope.items, item);
            delete $scope.items[index].quantity;
            removeFromFinalList(item);
            $localstorage.setObject("finalList", $scope.finalList);
        }

    });

}]);


app.factory('retailDataSvc', function($http) {
    return {
        fetch: function() {
            return $http({
                method: 'GET',
                url: 'js/data.json',
            }).then(function(result) {
                //returns object with every detail.
                return result.data;
            });
        }
    };

});

app.factory('$localstorage', function($window) {
    return {
        set: function(key, value) {
            $window.localStorage.setItem(key, value);
        },
        get: function(key) {
            return $window.localStorage.getItem(key);
        },
        setObject: function(key, value) {
            $window.localStorage.setItem(key, angular.toJson(value));
        },
        getObject: function(key) {
            if (typeof $window.localStorage[key] !== 'undefined' && $window.localStorage[key] !== 'undefined') {
                return JSON.parse($window.localStorage.getItem(key));
            } else {
                return false;
            }
        },

    }
});
