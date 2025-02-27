angular.module("myApp").controller("homeCtrl", function($scope, $state, IDB) {
    $scope.init = function (){
        $scope.allCars = [];
        $scope.priceFilter = '';
        $scope.search = '';
        $scope.category = '';
        $scope.carLocation = '';
        $scope.currentPage = 1;
        $scope.itemsPerPage = 10; // Number of cars per page

        // function to get all the cars that have status === approved
        IDB.getApprovedCars().then((cars) => {
            $scope.allCars = cars.filter((car) => {
                return car.deleted === undefined;
            });
            $scope.totalPages = Math.ceil($scope.allCars.length / $scope.itemsPerPage);
            $scope.updatePaginatedCars();
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
        $scope.currentPage = 1;
        $scope.updatePaginatedCars();
    };

    // function to redirect to the single car page
    $scope.redirectCarPage = (carID) => {
        $state.go("singleCar", {id: carID});
    };

    // function to update the paginated cars
    $scope.updatePaginatedCars = () => {
        const start = ($scope.currentPage - 1) * $scope.itemsPerPage;
        const end = start + $scope.itemsPerPage;
        $scope.paginatedCars = $scope.allCars.slice(start, end);
    };

    // function to go to the next page
    $scope.nextPage = () => {
        if ($scope.currentPage < $scope.totalPages) {
            $scope.currentPage++;
            $scope.updatePaginatedCars();
        }
    };

    // function to go to the previous page
    $scope.prevPage = () => {
        if ($scope.currentPage > 1) {
            $scope.currentPage--;
            $scope.updatePaginatedCars();
        }
    };
});