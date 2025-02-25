angular.module('myApp').controller('userBookingsCtrl', function($scope, $state,IDB,calculateBookingPrice ){
    $scope.test = "hello";
    $scope.calculateBookingPrice = calculateBookingPrice.calculate;

    // getting all the bookings from the database
    IDB.getAllBookings().then((bookings) => {
        $scope.bookings = bookings.filter((booking) => {
            return booking.status === "approved";
        }).filter((booking) => {
            return booking.from.username === JSON.parse(sessionStorage.getItem('user')).username;
        });
        console.log($scope.bookings);
    });

});