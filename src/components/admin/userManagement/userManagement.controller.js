angular.module("myApp").controller("userManagementCtrl", function($scope, $state, IDB) {
    $scope.users = [];
    IDB.getAllUsers().then((users)=>{
         $scope.users = users;
         console.log($scope.users);
    }).catch((err)=>{
            console.log(err);
            alert(err);
        });
});