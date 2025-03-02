angular.module('myApp').controller('ownerBookingsCtrl', function($scope, $state, IDB, Booking) {
     const loggedInUser = JSON.parse(sessionStorage.getItem('user')); // get the logged in user
     $scope.bookings = []; // array to hold the bookings
     $scope.reject = false; // flag to check if a booking has been rejected
     $scope.calculateBookingPrice = Booking.calculate; // function to calculate the booking price from the booking factory

     $scope.checkApproved = (booking) => booking.status === "approved"; // function to check if the booking is approved
     $scope.checkRejected = (booking) => booking.status === "rejected"; // function to check if the booking is rejected
     
      fetchBookings();  // Initial fetch of bookings
     // function to fetch all the biddings for the logged in user
     function fetchBookings() {
         IDB.getBookingsByOwnerId(loggedInUser.username).then((bookings) => {
             $scope.bookings = bookings.filter((booking) => booking.status === "pending");  // filtering out the pending bookings
             console.log($scope.bookings);
         }).catch((err) => {
             console.log(err);
         });
     }
      // function to rejectTheOverlappingBiddings automatically when some other bidding is approved that was overlapping with the current bidding
     function rejectOverlappingBiddings(carID, startDate, endDate) {
         IDB.getBookingsByCarId(carID).then((bookings) => {  // get all the bookings of a particular car
             bookings.forEach((booking) => {
                 if (booking.status === "pending" && (booking.startDate <= endDate && booking.endDate >= startDate)) { // check if the booking is pending and overlaps with the current booking
                     IDB.updateBookingStatus(booking.id, "rejected").then((response) => { // if overlapping reject the bookings that are overlapping 
                         console.log("Booking rejected successfully");
                         fetchBookings();
                     }).catch((err) => {
                         console.log(err);
                     });
                 }
             });
         }).catch((err) => {
             console.log(err);
         });
     }
    // function to approve the bidding 
     $scope.approveBidding = function(bidID, status = "approved") {
         IDB.updateBookingStatus(bidID, status).then((response) => {
             alert("Bidding approved successfully");
             const booking = $scope.bookings.find((booking) => booking.id === bidID);
             if (booking) {
                 rejectOverlappingBiddings(booking.vehicle.id, booking.startDate, booking.endDate);
             }
             fetchBookings();
         }).catch((err) => {
             console.log(err);
         });
     };
    // function to reject the bidding
     $scope.rejectBidding = function(bidID, status = "rejected") {
         IDB.updateBookingStatus(bidID, status).then((response) => {
             alert("Bidding rejected successfully");
             fetchBookings();
         }).catch((err) => {
             console.log(err);
         });
     };
 
    
 });