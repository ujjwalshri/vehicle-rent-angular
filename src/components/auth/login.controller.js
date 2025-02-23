angular.module("myApp").controller("loginCtrl", function($scope, $state,$timeout, IDB, $window) {
    $scope.test = "Hello World!";
    $scope.username = "";
    $scope.password = "";


    const logged = JSON.parse(sessionStorage.getItem("user"));
    if(logged && logged.role === "admin"){
        $window.open($state.href("admin"), "_blank");
    }else if(logged){
        $state.go("home"); 
    }
  
    $scope.login = function() {
        // Add any additional validation if needed
        console.log($scope.username, $scope.password);
        if($scope.username === "admino@123" && $scope.password === "admino@123"){
            alert("Admin Loggedin");
            sessionStorage.setItem("user", JSON.stringify({ username: "admino@123", role: "admin" }));
            // i want to open the new tab
            $state.go("admin");
            return;
        }
        IDB.loginUser($scope.username, $scope.password).then(function() {
            
            $state.go("home");
            alert("Logged in successfully");
        }).catch(function(error) {
            alert(error);
        });

    };
});