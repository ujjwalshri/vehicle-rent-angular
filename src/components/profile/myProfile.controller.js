angular.module("myApp").controller("myProfileCtrl", function($scope, $state, IDB) {
    const loggedInUser = JSON.parse(sessionStorage.getItem("user"));
    $scope.user = loggedInUser;
    $scope.userCars= [];
    IDB.getAllCarsByUser(loggedInUser.username).then((cars)=>{
        $scope.userCars = cars;
        console.log($scope.userCars);
    }).catch((err)=>{
        console.log(err);
        alert(err);
    });

});