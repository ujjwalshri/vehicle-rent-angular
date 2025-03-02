angular.module("myApp").controller("homeCtrl", function($scope, $state, IDB) {
    
    // init function to run when the page mounts
    $scope.init = function (){
        $scope.allCars = [];
        $scope.priceFilter = '';
        $scope.search = '';
        $scope.category = '';
        $scope.carLocation = '';

        // function to get all the cars that have status === approved
     IDB.getApprovedCars().then((cars) => {
            $scope.allCars = cars.filter((car) => {
                return car.deleted === undefined;
            });
           
            console.log($scope.allCars);
        })
        .catch((err) => {
            console.log(err);
            alert(err);
        });
    };

    // function to reset all the filters on the page
    $scope.resetFilters = () => {
        $scope.priceFilter = '';
        $scope.search = '';
        $scope.category = '';
        $scope.carLocation = '';
    };

    // function to redirect to the single car page
    $scope.redirectCarPage = (carID) => {
        $state.go("singleCar", {id: carID});
    };

});