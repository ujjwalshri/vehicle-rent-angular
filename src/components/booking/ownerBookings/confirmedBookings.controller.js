angular.module('myApp').controller('confirmedBookingsCtrl', function($scope, $state,IDB,calculateBookingPrice ){

    $scope.calculateBookingPrice = calculateBookingPrice.calculate; // function to calculate the booking price
   

    function fetchOwnerConfirmedBookings(){
        const loggedInUser = JSON.parse(sessionStorage.getItem('user'));
      
        // fetch the biddings at a particular owner.username
        IDB.getBookingsByOwnerId(loggedInUser.username).then((bookings) => {
            $scope.bookings = bookings.filter((booking)=>{
                return booking.status === "approved" ;
            });
            console.log($scope.bookings);
      }).catch((err)=>{
                console.log(err);
      })
       }

       fetchOwnerConfirmedBookings();  // fetching the confirmed bookings for the owner

  // function to get if a booking is sheduled to start at today
  $scope.todayBooking = (booking) => {
    const bookingStartDate = new Date(booking.startDate);
    const bookingEndDate = new Date(booking.endDate);
    const today = new Date();

    // if today date is between the booking start and end date
    // Assuming today, bookingStartDate, and bookingEndDate are Date objects

today.setHours(0, 0, 0, 0);


bookingStartDate.setHours(0, 0, 0, 0);

bookingEndDate.setHours(23, 59, 59, 999);

if (today >= bookingStartDate && today <= bookingEndDate) {
    return true;
}
}

   // function to get if a booking is sheduled to start at today and is not yet started
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