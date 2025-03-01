app.controller("signupCtrl", function ($scope, $state, AuthService) {
  
  $scope.signup = function () {
    const user = {
      firstName: $scope.firstName,
      lastName: $scope.lastName,
      email: $scope.email,
      username: $scope.username,
      password: $scope.password,
      confirmPassword: $scope.confirmPassword,
      isSeller: false,
      isBlocked: false,
      city: $scope.city,
      createdAt: new Date(),
      updatedAt: new Date(),
      adhaar: $scope.adhaar,
    };
    AuthService.validateUser(user)
      .then(function() {
        return AuthService.registerUser(user);
      })
      .then(function() {
        $state.go("login");
      })
      .catch(function(error) {
        alert("error in signup controller " + error);
      });
  };
});