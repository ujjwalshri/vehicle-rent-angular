function getDatesBetween(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

angular.module("myApp").controller("singleCarCtrl", function($scope, $state, IDB, $stateParams, validateBidding , calculateBookingPrice) {
  const loggedInUser = JSON.parse(sessionStorage.getItem("user"));
  $scope.isSeller = loggedInUser && loggedInUser.isSeller === true;
  $scope.isModalOpen = false;
  console.log($stateParams.id);
  $scope.car = {};
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

  $scope.calculateBookingPrice = calculateBookingPrice.calculate;

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

          if (new Date($scope.bidding.startDate) < new Date().setHours(0, 0, 0, 0)) {
            alert("Please enter a valid start date");
            return;
        }
        

          $scope.isValid = validateBidding.isValidBid($scope.bidding, $scope.blockedDates);

          console.log($scope.isValid);
          if ($scope.isValid.success) {
              IDB.addBid($scope.bidding).then(() => {
                  alert("Bid placed successfully");
                  
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

  // Initialize the review object
  $scope.review = {
      id: crypto.randomUUID(),
      rating: null,
      review: "",
      reviewer: loggedInUser,
      car: {},
      reviewedFor: null,
      createdAt: new Date()
  };
  console.log($scope.review);

  $scope.placeReview = function() {
      $scope.review.car = $scope.car;
      $scope.review.rating = parseInt($scope.review.rating);
      console.log($scope.review);
      if ($scope.review.review === "") {
          alert("Please enter a valid review");
          return;
      }

      console.log($scope.review);
      IDB.addReview($scope.review).then(() => {
          alert("Review placed successfully");
          $state.reload();
      }).catch((e) => {
          alert(e);
      });
  };
   $scope.carReviews = [];
  IDB.getReviewsByCarID($stateParams.id).then((reviews) => {
      $scope.carReviews = reviews;
      console.log($scope.carReviews);
  }).catch((err) => {
      console.log(err);
      alert(err);
  });


  // handling the user clicking on chat with owner button 
  $scope.chatWithOwner = () => {
      // create a new conversation object and then we will fetch the conversations on the basis of latest at the conversations page
      $state.go("conversations");
  };
});