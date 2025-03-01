angular.module("myApp").controller("carCtrl", function($scope, $state, IDB) {
    
    
    $scope.init = ()=>{
        fetchPendingCars();
    }
    // calling db to get the pending cars;
   function fetchPendingCars(){
    IDB.getPendingCars().then((cars)=>{
        $scope.cars = cars;
        console.log($scope.cars);
     }).catch((err)=>{
            console.log(err);
            alert(err);
     }) 
    }

     // initial fetch of pending cars
    // function to approve a car
    $scope.approveCar = (carID)=>{
        console.log(carID);
           IDB.approveCar(carID).then(()=>{
               alert("Car Approved");
              fetchPendingCars();
           }).catch((err)=>{
               alert(err);
           });
  }

  // function to reject a car
  $scope.rejectCar = (carID)=>{
      console.log(carID);
         IDB.rejectCar(carID).then(()=>{
             alert("Car Rejected");
            fetchPendingCars();
         }).catch((err)=>{
             alert(err);
         });
        }

});