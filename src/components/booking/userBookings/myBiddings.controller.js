angular.module('myApp').controller('myBiddingsCtrl', function($scope, $state, IDB, calculateBookingPrice) {
    
    $scope.calculateBookingPrice = calculateBookingPrice.calculate;
    const loggedInUser = JSON.parse(sessionStorage.getItem('user'));
    
    // fetch the biddings at a particular owner.username
    IDB.getAllBookings().then((bookings) => {
        $scope.bookings = bookings.filter((booking) => {
            return booking.status === "pending" && booking.from.username === loggedInUser.username;
        })
        console.log($scope.bookings);
    });
   // handling manage booking function
    $scope.handleManageBookings = (bookingID) => {
        $state.go('manageBookings', { id: bookingID });
    }
})