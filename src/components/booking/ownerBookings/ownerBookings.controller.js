angular.module('myApp').controller('ownerBookingsCtrl', function($scope, $state, IDB, calculateBookingPrice) {
     const loggedInUser = JSON.parse(sessionStorage.getItem('user'));
     $scope.bookings = [];
     $scope.reject = false;
     $scope.calculateBookingPrice = calculateBookingPrice.calculate;

     $scope.checkApproved = (booking) => booking.status === "approved";
     $scope.checkRejected = (booking) => booking.status === "rejected";
 
     function fetchBookings() {
         IDB.getBookingsByOwnerId(loggedInUser.username).then((bookings) => {
             $scope.bookings = bookings.filter((booking) => booking.status === "pending");  // filtering out the pending bookings
             console.log($scope.bookings);2
         }).catch((err) => {
             console.log(err);
         });
     }
 
     function rejectOverlappingBiddings(carID, startDate, endDate) {
         IDB.getBookingsByCarId(carID).then((bookings) => {
             bookings.forEach((booking) => {
                 if (booking.status === "pending" && (booking.startDate <= endDate && booking.endDate >= startDate)) {
                     IDB.updateBookingStatus(booking.id, "rejected").then((response) => {
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
 
     $scope.rejectBidding = function(bidID, status = "rejected") {
         IDB.updateBookingStatus(bidID, status).then((response) => {
             alert("Bidding rejected successfully");
             fetchBookings();
         }).catch((err) => {
             console.log(err);
         });
     };
 
     // Initial fetch of bookings
     fetchBookings();
 });