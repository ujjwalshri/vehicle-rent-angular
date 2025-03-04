angular
  .module("myApp")
  .controller(
    "confirmedBookingsCtrl",
    function ($scope, $state, IDB, Booking) {
      $scope.calculateBookingPrice = Booking.calculate; // function to calculate the booking price


      // initially fetching the confirmed bookings when the page loads
      fetchOwnerConfirmedBookings(); // fetching the confirmed bookings for the owner
      
      function fetchOwnerConfirmedBookings() {
        const loggedInUser = JSON.parse(sessionStorage.getItem("user"));
        IDB.getBookingsByOwnerId(loggedInUser.username) // get all the bookings of a particular owner
          .then((bookings) => {
            $scope.bookings = bookings.filter((booking) => {
              return booking.status === "approved";
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }

      

      // function to get if a booking is started and today date is in between the startDate and endDate
      $scope.todayBooking = (booking) => {
        const bookingStartDate = new Date(booking.startDate); // making sure that startDate is date object
        const bookingEndDate = new Date(booking.endDate); // making sure that endDate is date object
        const today = new Date(); // getting the current date

        // if today date is between the booking start and end date
        today.setHours(0, 0, 0, 0); // set the hours to 0 to compare the dates
        bookingStartDate.setHours(0, 0, 0, 0); // set the hours to 0 to compare the dates
        bookingEndDate.setHours(23, 59, 59, 999); // set the hours to 23 to compare the dates

        if (today >= bookingStartDate && today <= bookingEndDate) {
          return true;
        }
      };

      // function to get if a booking is sheduled to start at today and is not yet started
      $scope.handleManageBookings = (bookingID) => {
        $state.go("manageBookings", { id: bookingID });
      };

      $scope.resetFilter = ()=>{
        $scope.startDate = ''; // reset the start date filter
      }
    }
  );
