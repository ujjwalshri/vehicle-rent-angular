angular.module("myApp").controller("myProfileCtrl", function($scope, $state, IDB) {
    const loggedInUser = JSON.parse(sessionStorage.getItem("user"));
    $scope.user = loggedInUser;
    $scope.userCars= [];
    $scope.deleted = false;
    
   // get all cars by a particular username
   $scope.init = ()=>{
    IDB.getAllCarsByUser(loggedInUser.username).then((cars)=>{
        $scope.userCars = cars;
    }).catch((err)=>{
        alert(err);
    });
   }

    // delete a car with a particular carID
    $scope.deleteCar = (carID)=>{
        IDB.deleteCar(carID).then((response)=>{
            alert("Car deleted successfully");
            $scope.deleted = true;
        }).catch((err)=>{
            console.log(err);
            alert(err);
        });
    }
});