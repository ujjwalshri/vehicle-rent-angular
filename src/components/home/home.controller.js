// this is the home controller used for the listing of all the cars on tha platform
angular.module("myApp").controller("homeCtrl", function($scope, $state, IDB) {


    $scope.allCars = [];
    $scope.test = "Hello World!";
    $scope.priceFilter = '';
    $scope.search = '';
    $scope.category='';
    $scope.carLocation = '';

    $scope.resetFilters = ()=>{
        $scope.priceFilter = '';
        $scope.search = '';
        $scope.category='';
        $scope.carLocation = '';
    }

    IDB.getApprovedCars().then((cars)=>{
        $scope.allCars = cars;
        console.log($scope.allCars);
    })
    .catch((err)=>{
        console.log(err);
        alert(err);
    });

    $scope.redirectCarPage = (carID)=>{
        $state.go("singleCar", {id: carID});
    }
});