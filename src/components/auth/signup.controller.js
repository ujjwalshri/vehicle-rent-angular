app.controller("signupCtrl", function ($scope, $state, IDB, hashPassword) {
    $scope.test = "Hello World!";
    $scope.username = "";
    $scope.firstName = "";
    $scope.lastName = "";
    $scope.confirmPassword = "";
    $scope.city = "";
    $scope.password = "";
    $scope.email = "";
    $scope.user = {
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        city: "",
        adhaar: "",
        isSeller: false,
        isBlocked: false,
    };

    $scope.signup = function () {
        // Add any additional validation if needed
        if ($scope.user.password !== $scope.user.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        $scope.user.confirmPassword = "";
        $scope.user.password = hashPassword($scope.user.password);
        console.log($scope.user);
    
        // Set isSeller based on userRole
        $scope.user.isSeller = $scope.user.userRole === "seller";
        IDB.registerUser($scope.user).then(function () {
            $state.go("login");
        }).catch(function (error) {
            alert(error);
        });
    };
});