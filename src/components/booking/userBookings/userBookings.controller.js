angular.module('myApp').controller('userBookingsCtrl', function($scope, $state,IDB,Booking ){
    
    $scope.calculateBookingPrice = Booking.calculate; // function to calculate the booking price from the booking factory
    // getting all the bookings from the database
    IDB.getAllBookings().then((bookings) => {
        $scope.bookings = bookings.filter((booking) => {
            return booking.status === "approved"; // filtering out the approved bookings 
        }).filter((booking) => {
            return booking.from.username === JSON.parse(sessionStorage.getItem('user')).username; // filtering out the bookings of the logged in user
        });
    });
});