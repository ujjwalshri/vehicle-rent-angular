angular.module("myApp").controller("adminCtrl", function($scope, $state, IDB) {
    const loggedInUser = JSON.parse(sessionStorage.getItem("user"));
    if(loggedInUser && loggedInUser.role === "admin"){
        $scope.adminLogged = true;
    }
    $scope.adminLogout = ()=>{
        sessionStorage.removeItem("user");
        $state.go("login");
    }
        if (!loggedInUser || loggedInUser.role !== "admin") {
            $scope.adminLogged=false;
            $state.go("login");
        }
       
});