const app = angular.module("myApp", ["ui.router"]);

app.controller("appCtrl", function($scope, $state) {
    $scope.hi = "Hello World!";

    const loggedInUser = JSON.parse(sessionStorage.getItem("user"));
    if(loggedInUser && loggedInUser.role === "admin"){
        $scope.adminLogged = true;
    }
    $scope.logged = !!loggedInUser; // Attach logged to $scope
    $scope.logout = () => {
        sessionStorage.removeItem("user");
        $scope.logged = false;
        $state.reload();
    };

    // Uncomment this if you want to redirect to login if not logged in
    // if (!loggedInUser && $state.current.name !== 'login') {
    //     $state.go("login");
    // }
});