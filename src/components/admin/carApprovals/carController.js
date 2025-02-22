angular.module("myApp").controller("carCtrl", function($scope, $state, IDB) {
    $scope.cars = [];
    IDB.getPendingCars().then((cars)=>{
       $scope.cars = cars;
       console.log($scope.cars);
    }).catch((err)=>{
           console.log(err);
           alert(err);
    })
    $scope.approveCar = (carID)=>{
        console.log(carID);
           IDB.approveCar(carID).then(()=>{
               alert("Car Approved");
               $state.reload();
           }).catch((err)=>{
               alert(err);
           });
  }
  $scope.rejectCar = (carID)=>{
      console.log(carID);
         IDB.rejectCar(carID).then(()=>{
             alert("Car Rejected");
             $state.reload();
         }).catch((err)=>{
             alert(err);
         });
        }

});