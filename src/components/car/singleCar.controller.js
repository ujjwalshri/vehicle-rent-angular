angular.module("myApp").controller("singleCarCtrl", function($scope, $state, IDB, $stateParams, ) {
    $scope.isModalOpen = false;
    console.log($stateParams.id);
    $scope.car = {};

    IDB.getCarByID($stateParams.id).then((car)=>{
        $scope.car = car;
        console.log($scope.car);
    }).catch((err)=>{
        console.log(err);
        alert(err);
    });
     // Open modal
     $scope.openModal = function() {
        $scope.isModalOpen = true;
    };

    // Close modal
    $scope.closeModal = function() {
        $scope.isModalOpen = false;
    };


});