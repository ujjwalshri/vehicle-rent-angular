// this is the home controller used for the listing of all the cars on tha platform
angular.module("myApp").controller("homeCtrl", function($scope, $state, IDB) {
    $scope.allCars = [];
    $scope.test = "Hello World!";
    $scope.search = '';
    IDB.getApprovedCars().then((cars)=>{
        $scope.allCars = cars;
        console.log($scope.allCars);
    })
    .catch((err)=>{
        console.log(err);
        alert(err);
    });

});