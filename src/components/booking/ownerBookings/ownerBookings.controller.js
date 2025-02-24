angular.module('myApp').controller('ownerBookingsCtrl', function($scope, $state,IDB,calculateBookingPrice ){
     const loggedInUser = JSON.parse(sessionStorage.getItem('user'));
     $scope.bookings = [];
     $scope.calculateBookingPrice = calculateBookingPrice.calculate;
     IDB.getBookingsByOwnerId(loggedInUser.username).then((bookings) => {
           $scope.bookings = bookings.filter((booking)=>{
               return booking.status === "pending";
           });
           console.log($scope.bookings);
     }).catch((err)=>{
               console.log(err);
     })
     $scope.checkApproved = (booking)=>{
          if(booking.status === "approved"){
               return true;
          }
          return false;
     }

     $scope.approveBidding = function(bidID, status= "approved") {
          // Logic to approve the bidding
          console.log("Bidding ID:", bidID);
          console.log("Status:", status);
          IDB.updateBookingStatus(bidID, status).then((response) => {
               alert("Bidding approved successfully");
               
               $scope.approved = true;
               $state.reload();
          }).catch((err) => {console.log(err)});
      };
          $scope.rejectBidding = function(bidID, status= "rejected") {
               // Logic to reject the bidding
               console.log("Bidding ID:", bidID);
               console.log("Status:", status);
               IDB.updateBookingStatus(bidID, status).then((response) => {
                    alert("Bidding rejected successfully");
                    $scope.rejected = true;
               }).catch((err) => {console.log(err)});
          };
     
})