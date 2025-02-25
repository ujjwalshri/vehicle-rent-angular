angular.module('myApp').controller('confirmedBookingsCtrl', function($scope, $state,IDB,calculateBookingPrice ){

    $scope.calculateBookingPrice = calculateBookingPrice.calculate;
    const loggedInUser = JSON.parse(sessionStorage.getItem('user'));
  
    // fetch the biddings at a particular owner.username
    IDB.getBookingsByOwnerId(loggedInUser.username).then((bookings) => {
        $scope.bookings = bookings.filter((booking)=>{
            return booking.status === "approved";
        });
        console.log($scope.bookings);
  }).catch((err)=>{
            console.log(err);
  })
// function to get if a booking is sheduled to start at today
  $scope.todayBooking = (booking) => {
    const bookingDate = new Date(booking.startDate);
    const today = new Date();
    
    if (bookingDate.getDate() === today.getDate() &&
        bookingDate.getMonth() === today.getMonth() &&
        bookingDate.getFullYear() === today.getFullYear()) {
        return true;
    } else {
        return false;
    }
}
   
   $scope.handleManageBookings = (bookingID)=>{
      $state.go('manageBookings', {id:bookingID});
   }


//   $scope.checkApproved = (booking)=>{
//        if(booking.status === "approved"){
//             return true;
//        }
//        return false;
//   }
});