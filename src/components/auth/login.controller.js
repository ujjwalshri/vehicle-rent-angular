angular.module("myApp").controller("loginCtrl", function($scope, $state,$timeout, IDB) {
    $scope.test = "Hello World!";
    $scope.username = "";
    $scope.password = "";

    const logged = JSON.parse(sessionStorage.getItem("user"));
    if (logged) {
        $state.go("home");
    }
    $scope.login = function() {
        // Add any additional validation if needed
        console.log($scope.username, $scope.password);
        IDB.loginUser($scope.username, $scope.password).then(function() {
            $state.go("home");
        }).catch(function(error) {
            alert(error);
        });
    };
});