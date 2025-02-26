const app = angular.module("myApp", ["ui.router"]);

app.controller("appCtrl", function($scope, $state, $timeout,$rootScope) {

    $scope.init = function() {
        $rootScope.adminLogged  = false;
       $rootScope.isLogged = false;
        $scope.isSeller = false;
            const loggedInUser = JSON.parse(sessionStorage.getItem("user"));
            $rootScope.adminLogged = loggedInUser && loggedInUser.role === "admin";
            $scope.isSeller = loggedInUser && loggedInUser.isSeller === true;
            $rootScope.isLogged = loggedInUser;
            console.log('$rootScope.logged', $rootScope.isLogged);
    };
    $scope.logout = () => {
        sessionStorage.removeItem("user");
        $rootScope.isLogged = false;
    };
});
