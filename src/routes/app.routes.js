angular.module("myApp").config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
    $stateProvider
        .state("home", {
            url: "/home",
            templateUrl: "components/home/home.html",
            controller: "homeCtrl"
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
                    controller: 'carCtrl'
                }
            }
        })
        .state('admin.userManagement',{
            url: '/userManagement',
            views: {
                'adminContent@admin': {
                    templateUrl: 'components/admin/userManagement/userManagement.html',
                    controller: 'userManagementCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('admin.analytics',{
            url: '/analytics',
            views: {
                'adminContent@admin': {
                    templateUrl: 'components/admin/Analytics/analytics.html',
                    controller: 'adminCtrl'
                }
            }
        })
        .state('admin.blockedUsers',{
            url: '/blockedUsers',
            views: {
                'adminContent@admin': {
                    templateUrl: 'components/admin/userManagement/blockedUsers.html',
                    controller: ''
                }
            }
        }
        )
        .state('singleCar',{
            url: '/singleCar/:id',
            templateUrl: 'components/car/singleCar.html',
            controller: 'singleCarCtrl'
        })
        .state('conversations', {
            url: '/conversations:id',
            templateUrl: 'components/conversations/conversations.html',
            controller: 'conversationsCtrl'
        }) 
        .state('myProfile', {
            url: '/myProfile',
            templateUrl: 'components/profile/myProfile.html',
            controller: 'myProfileCtrl'
        })
        .state('userBookings', {
            url: '/userBookings',
            templateUrl: 'components/booking/userBookings/userBookings.html',
            controller: 'userBookingsCtrl'
        })
        .state('ownerBookings', {
            url: '/ownerBookings',
            templateUrl: 'components/booking/ownerBookings/ownerBookings.html',
            controller: 'ownerBookingsCtrl'
        })
        .state('confirmedBookings', {
            url: '/confirmedBookings',
            templateUrl: 'components/booking/ownerBookings/confirmedBookings.html',
            controller: 'confirmedBookingsCtrl'
        })
        .state('manageBookings', {
            url: '/manageBookings:id',
            templateUrl: 'components/booking/ownerBookings/manageBookings.html',
            controller: 'manageBookingsCtrl'
        })
        .state('myBiddings', {
            url: '/myBiddings',
            templateUrl: 'components/booking/userBookings/myBiddings.html',
            controller: 'myBiddingsCtrl'
        })
        
        
});
