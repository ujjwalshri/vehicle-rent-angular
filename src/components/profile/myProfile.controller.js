angular.module("myApp").controller("myProfileCtrl", function($scope, $state, IDB) {
    const loggedInUser = JSON.parse(sessionStorage.getItem("user"));// get the logged in user
    $scope.user = loggedInUser;// set the user to the logged in user
    $scope.userCars= []; // array to hold the cars of the user
    $scope.deleted = false;// flag to check if a car has been deleted
     
    
   $scope.init = ()=>{
    fetchUserCars(); // calling fetchUserCars function
   }
    // function to fetch cars of a particular user
   function fetchUserCars(){
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
            $scope.deleted = true; // mark the car as deleted
            fetchUserCars(); // fetch the cars again
        }).catch((err)=>{
            console.log(err);
            alert(err);
        });
    }
});