angular.module("myApp").controller("userManagementCtrl", function($scope, $state, IDB) {
    $scope.allUsers = [];
    $scope.buyers = [];
    $scope.sellers = [];

    IDB.getAllUsers().then((users)=>{
         $scope.allUsers = users;
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
});