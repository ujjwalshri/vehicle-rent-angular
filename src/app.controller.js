const app = angular.module("myApp", ["ui.router"]);
app.controller("appCtrl", function($scope,$rootScope) {
    //init function to run when the app first loads
    $scope.init = function() {
       $rootScope.adminLogged  = false;
       $rootScope.isLogged = false;
        $rootScope.isSeller = false;
            const loggedInUser = JSON.parse(sessionStorage.getItem("user"));
            $rootScope.adminLogged = loggedInUser && loggedInUser.role === "admin";
            $rootScope.isSeller = loggedInUser && loggedInUser.isSeller === true;
            $rootScope.isLogged = loggedInUser;
            console.log('$rootScope.logged', $rootScope.isLogged);
    };

    //logout function to remove the user from the session storage
    $scope.logout = () => {
        sessionStorage.removeItem("user");
        $rootScope.isLogged = false;
    };
});
