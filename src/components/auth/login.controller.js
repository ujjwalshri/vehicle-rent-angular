angular.module("myApp").controller("loginCtrl", function($scope, $state,$timeout, IDB, $window, $rootScope) {

    $scope.username = "";
    $scope.password = "";

     
    const logged = JSON.parse(sessionStorage.getItem("user"));
    if(logged && logged.role === "admin"){
        $state.go('admin');
    }else if(logged){
        $state.go("home"); 
    }
  
    $scope.login = function() {
        // Add any additional validation if needed

        if($scope.username === "admino@123" && $scope.password === "admino@123"){
            alert("Admin Loggedin");
            sessionStorage.setItem("user", JSON.stringify({ username: "admino@123", role: "admin" }));
            // i want to open the new tab
            $state.go("admin")
            return;
        }

        // calling db to login user 
        IDB.loginUser($scope.username, $scope.password).then(function() {
            alert("Logged in successfully");
            $rootScope.isLogged = true;
            $state.go("home");
            
        }).catch(function(error) {
            alert(error);
        });

    };
});