
angular.module("myApp").controller("userManagementCtrl", function($scope, $state, IDB, $q) {
    $scope.allUsers = [];
    $scope.buyers = [];
    $scope.sellers = [];
   // call database function to get all the users 
   $scope.users = [];
   $scope.init = ()=>{
      fetchUsers();  // initial fetch of users
   }
   

   function fetchUsers(){
      IDB.getAllUsers().then((users)=>{
         $scope.allUsers = users.filter(user => user.isBlocked === false);
        $scope.buyers =  $scope.allUsers.filter((user)=>{
           return user.isSeller === false;
        });
        $scope.sellers =  $scope.allUsers.filter((user)=>{
           return user.isSeller === true;
        });
        console.log('Buyers');
        console.log($scope.buyers);
        console.log('Sellers');
        console.log($scope.sellers);
   }).catch((err)=>{
           console.log(err);
           alert(err);
       });
   }
   
   // function to block a user and then getting all the cars of that user and then deleting all the cars of that user
    $scope.block = (username) => {
      IDB.blockUserByUsername(username).then((response)=>{
          console.log(response);
          alert("User blocked successfully");
          fetchUsers();
          return IDB.getAllCarsByUser(username);
      })
      .then((cars)=>{
           const allDeleteCalls =  cars.forEach((car)=>{
              return IDB.deleteCar(car.id).then((response)=>{
                     console.log(response);
               }).catch((err)=>{
                     console.log("error deleting car after blocking user");
               });
            });
            return $q.all(allDeleteCalls);
      })
      .catch((err)=>{
            console.log(err);
            alert("error bloc1king user");
      });
    }
});