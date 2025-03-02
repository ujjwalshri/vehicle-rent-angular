angular.module('myApp').controller('myBiddingsCtrl', function($scope, $state, IDB, Booking) {
    
    $scope.calculateBookingPrice = Booking.calculate; //  function to calculate the booking price from the booking factory
    const loggedInUser = JSON.parse(sessionStorage.getItem('user')); // retriving the logged in user from the session storage
    
    // fetch the biddings at a particular owner.username
    IDB.getAllBookings().then((bookings) => {
        $scope.bookings = bookings.filter((booking) => {
            return booking.status === "pending" && booking.from.username === loggedInUser.username; // filtering out the pending bookings and the bookings of the logged in user
        })
    });
   // handling manage booking function redirects the using to the manage booking page with that bookings id
    $scope.handleManageBookings = (bookingID) => {
        $state.go('manageBookings', { id: bookingID });
    }
})