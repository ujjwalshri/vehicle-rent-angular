angular.module("myApp").controller("loginCtrl", function($scope, $state,$timeout, IDB, $window, $rootScope, AuthService) {

    $scope.username = "";
    $scope.password = "";

    // const logged = JSON.parse(sessionStorage.getItem("user"));
    // if(logged && logged.role === "admin"){
    //     $state.go('admin');
    // }else if(logged){
    //     $state.go("home"); 
    // }
  
    $scope.login = function() {
        // Add any additional validation if needed

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
                    
                    $rootScope.isLogged = true;
                    $rootScope.isSeller = JSON.parse(sessionStorage.getItem('user')).isSeller;
                
            })
            .catch(function(error) {
                alert("Error in login controller " + error);
            });
    };
});