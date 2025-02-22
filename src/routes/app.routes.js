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
        .state('admin', {
            url: '/admin',
            templateUrl: 'components/admin/admin.html',
            controller: 'adminCtrl'
        })
        .state('admin.carApprovals', {
            url: '/carApprovals',
            views: {
                'adminContent@admin': {  // Named view inside 'admin'
                    templateUrl: 'components/admin/carApprovals/carApprovals.html',
                    controller: ''
                }
            }
        })
        .state('admin.userManagement', {
            url: '/userManagement',
            views: {
                'adminContent@admin': {  // Named view inside 'admin'
                    templateUrl: 'components/admin/userManagement/userManagement.html',
                    controller: ''
                }
            }
        });
});
