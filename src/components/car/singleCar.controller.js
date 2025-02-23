angular.module("myApp").controller("singleCarCtrl", function($scope, $state, IDB, $stateParams ,validateBidding) {
  const loggedInUser = JSON.parse(sessionStorage.getItem("user"));
  $scope.isSeller = loggedInUser && loggedInUser.isSeller === true;
  $scope.isModalOpen = false;
  console.log($stateParams.id);

  $scope.bidding = {
      id: crypto.randomUUID(),
      amount: null,
      vehicle: {}, 
      startDate: null,
      endDate: null,
      status: "pending",
      from: loggedInUser,
      owner: null,
      createdAt: new Date(),
      location: ""
  };

  function getDatesBetween(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
}
  $scope.placeBid = () => {
      $scope.bidding.vehicle = $scope.car;
      $scope.bidding.owner = $scope.car.owner;
      $scope.bidding.location = $scope.car.location;
      if ($scope.bidding.amount < 0 || $scope.bidding.amount == null || $scope.bidding.amount < $scope.car.carPrice) {
          alert("Please enter a valid amount");
          return;
      }
      if (new Date($scope.bidding.startDate) > new Date($scope.bidding.endDate)) {
          alert("Please enter a valid date range");
          return;
      }
      if ($scope.bidding.location == "" || $scope.bidding.location !== $scope.car.location) {
          alert("Please enter a valid location");
          return;
      }
      console.log($scope.bidding);
      $scope.blockedDates = [];
      $scope.isValid = false;
      IDB.getBookingsByCarID($stateParams.id).then((bids) => {
        console.log("Bids:", bids);
          $scope.blockedDates = bids
              .filter((bid) => bid.status === "approved") // Get only approved bookings
              .flatMap((bid) => getDatesBetween(new Date(bid.startDate), new Date(bid.endDate)));

          console.log("Blocked Dates:", $scope.blockedDates);
          $scope.isValid = validateBidding.isValidBid($scope.bidding, $scope.blockedDates);
           console.log($scope.isValid);
          if ($scope.isValid.success) {
              IDB.addBid($scope.bidding).then(() => {
                  alert("Bid placed successfully");
                  $state.go("conversations");
              }).catch((e) => {
                  alert(e);
              });
          } else {
              alert("already booked for the date range");
          }
      }).catch((err) => {
          console.log(err);
      });
  };

  IDB.getCarByID($stateParams.id).then((car) => {
      $scope.car = car;
      console.log($scope.car);
  }).catch((err) => {
      console.log(err);
      alert(err);
  });

  // Open modal
  $scope.openModal = function() {
      $scope.isModalOpen = true;
  };

  // Close modal
  $scope.closeModal = function() {
      $scope.isModalOpen = false;
  };
});