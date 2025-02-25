const app = angular.module("myApp", ["ui.router"]);

app.controller("appCtrl", function($scope, $state, $timeout,$rootScope) {

    $scope.init = function() {
        $scope.adminLogged  = false;
       $scope.logged = false;
       $rootScope.isLogged = false;
        $scope.isSeller = false;
            const loggedInUser = JSON.parse(sessionStorage.getItem("user"));
            $scope.adminLogged = loggedInUser && loggedInUser.role === "admin";
            $scope.isSeller = loggedInUser && loggedInUser.isSeller === true;
            $scope.logged = loggedInUser ? true : false;
            $rootScope.isLogged = loggedInUser;
            console.log('$rootScope.logged', $rootScope.isLogged);
    };
    $scope.logout = () => {
        sessionStorage.removeItem("user");
        $rootScope.isLogged = false;
    };
});
