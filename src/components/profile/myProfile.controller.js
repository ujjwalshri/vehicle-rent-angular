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

    $scope.deleted = false;
    $scope.deleteCar = (carID)=>{
        IDB.deleteCar(carID).then((response)=>{
            alert("Car deleted successfully");
            $scope.deleted = true;
            $state.reload();
        }).catch((err)=>{
            console.log(err);
            alert(err);
        });
        
    }

});