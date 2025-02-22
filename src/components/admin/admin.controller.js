angular.module("myApp").controller("adminCtrl", function($scope, $state, IDB) {
    $scope.adminLogout = ()=>{
        sessionStorage.removeItem("user");
        $state.go("login");
    }
     const loggedInUser = JSON.parse(sessionStorage.getItem("user"));
        if (!loggedInUser || loggedInUser.role !== "admin") {
            $state.go("login");
        }
  
       
});