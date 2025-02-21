angular.module("myApp").config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/home");
    $stateProvider
        .state("home", {
            url: "/home",
            templateUrl: "components/home/home.html",
            controller: "appCtrl"
        })
        .state("login",{
            url: "/login",
            templateUrl: "components/auth/login.html",
            controller: "loginCtrl"
        })
        .state("signup",{
           url: "/signup",
           templateUrl: "components/auth/signup.html",
           controller: "signupCtrl"
        })
        .state('car', {
            url: '/car',
            templateUrl: 'components/car/addCarForm.html',
            controller: 'addCarCtrl'
        })
});
