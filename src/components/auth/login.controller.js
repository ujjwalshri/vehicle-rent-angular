angular.module("myApp").controller("loginCtrl", function($scope, $state, $rootScope, AuthService) {
    $scope.username = "";
    $scope.password = "";
    $scope.login = function() {
        // Add any additional validation if needed
        if (!$scope.username || !$scope.password) {
            alert("Please enter username and password");
            return;
        }  
        if($scope.username === "admino@123" && $scope.password === "admino@123"){
            alert("Admin Loggedin");
            sessionStorage.setItem("user", JSON.stringify({ username: "admino@123", role: "admin" }));
            $rootScope.isLogged = true;
            $rootScope.adminLogged = true;
            $state.go('admin');
            return;
        }
       // calling auth service to loginUser user
        AuthService.loginUser($scope.username, $scope.password)
            .then(function(res) {
                    $state.go("home");
 
                    alert("Logged in successfully");
                    
                    $rootScope.isLogged = true; // setting the rootScope of isLogged to true to handle the logged in user logic
                    $rootScope.isSeller = JSON.parse(sessionStorage.getItem('user')).isSeller; // setting the rootScope of isSeller to true if the user is a seller
                
            })
            .catch(function(error) {
                alert("Error in login controller " + error);
            });
    };
});