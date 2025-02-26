angular.module("myApp").controller("adminCtrl", function($scope, $state, IDB, $rootScope) {

  
    const loggedInUser = JSON.parse(sessionStorage.getItem("user"));
    if(loggedInUser && loggedInUser.role === "admin"){
        $scope.adminLogged = true;
    }
    if (!loggedInUser || loggedInUser.role !== "admin") {
        $scope.adminLogged=false;
        $state.go("login");
    }
    $scope.adminLogout = ()=>{
        sessionStorage.removeItem("user");
        $state.go("login");
        $rootScope.isLogged = false;
        $rootScope.adminLogged = false;
    }
});