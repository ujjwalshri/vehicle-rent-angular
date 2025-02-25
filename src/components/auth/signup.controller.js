app.controller("signupCtrl", function ($scope, $state, IDB) {

  $scope.user = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    city: "",
    adhaar: "",
    isSeller: false,
    isBlocked: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  $scope.signup = function () {
    // Add any additional validation if needed

    console.log($scope.user.password);
    console.log($scope.user.confirmPassword);
    if ($scope.user.password !== $scope.user.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log($scope.user);
    // Set isSeller based on userRole
    $scope.user.isSeller = $scope.user.userRole === "seller";
    IDB.registerUser($scope.user)
      .then(function () {
        $state.go("login");
      })
      .catch(function (error) {
        alert(error);
      });
  };
});
