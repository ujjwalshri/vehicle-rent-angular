
// single Car controller
angular.module("myApp").controller("singleCarCtrl", function($scope, $state, IDB, $stateParams, validateBidding , calculateBookingPrice) {
  const loggedInUser = JSON.parse(sessionStorage.getItem("user"));
  $scope.isSeller = loggedInUser && loggedInUser.isSeller === true;
  $scope.isModalOpen = false;
  $scope.calculateBookingPrice = calculateBookingPrice.calculate;
  $scope.user = loggedInUser.username;
  $scope.car = {};
  $scope.carReviews = [];
  $scope.bidding = {
      id: crypto.randomUUID(),
      amount: null,
      vehicle: {}, 
      startDate: null,
      endDate: null,
      status: "pending",
      from: {
        username: loggedInUser.username, 
        email: loggedInUser.email,
        firstName: loggedInUser.firstName,
        lastName: loggedInUser.lastName,
        isBlocked: loggedInUser.isBlocked,
        isSeller : loggedInUser.isSeller
      },
      owner: null,
      createdAt: new Date(),
      location: ""
  };


  // Initialize the review object
  $scope.review = {
    id: crypto.randomUUID(),
    rating: null,
    review: "",
    reviewer: {
        username: loggedInUser.username,
        firstName:loggedInUser.firstName, 
        lastName:loggedInUser.lastName,
        email:loggedInUser.email,
        city: loggedInUser.city,
    },
    car: {},
    reviewedFor: null,
    createdAt: new Date()
};


// function to get the car at particular car ID
function fetchCar() {
  IDB.getCarByID($stateParams.id).then((car) => {
    $scope.car = car;
}).catch((err) => {
    alert(err);
});
}
fetchCar();



// function to place a bid
  $scope.placeBid = async () => {


      $scope.bidding.vehicle = $scope.car;
      $scope.bidding.owner = $scope.car.owner;
      $scope.bidding.location = $scope.car.location;
      $scope.blockedDates = [];
      $scope.isValid = false;

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

      // function to get 
     IDB.getBookingsByCarID($stateParams.id)
    .then((bids) => {
      console.log("Bids:", bids);
      

      $scope.blockedDates = bids
        .filter((bid) => bid.status === "approved")
        .flatMap((bid) => getDatesBetween(new Date(bid.startDate), new Date(bid.endDate)));

      console.log("Blocked Dates:", $scope.blockedDates);


      if (new Date($scope.bidding.startDate) < new Date().setHours(0, 0, 0, 0)) {
        return Promise.reject("Start date should not be past date");
      }

      
      $scope.isValid = validateBidding.isValidBid($scope.bidding, $scope.blockedDates);
      console.log($scope.isValid);
      if($scope.isValid === false){
        return Promise.reject("Invalid bid");
      }
      return $scope.isValid.success ? IDB.addBid($scope.bidding) : Promise.reject("already booked for the date range");
    })
    .then(() => {
      alert("Bid placed successfully");
      $state.go('myBiddings');
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(error);
    });
  };


  
  $scope.openModal = function() {
      $scope.isModalOpen = true;
  };


  $scope.closeModal = function() {
      $scope.isModalOpen = false;
  };


  $scope.placeReview = async function() {

    // updating the review object 
    $scope.review.car = $scope.car;
    $scope.review.rating = parseInt($scope.review.rating);
    
    if ($scope.review.review === "") {
        alert("Please enter a valid review");
        return;
    }
  
    try {
        const res = await IDB.addReview($scope.review); // call the IDB service addReview function to add the review to the database

        alert('Review added successfully');
    } catch (error) {
        alert('There was an error adding your review. Please try again. ' + error);
    }

};
  
  IDB.getReviewsByCarID($stateParams.id).then((reviews) => {
      $scope.carReviews = reviews;
      console.log($scope.carReviews);
  }).catch((err) => {
      console.log(err);
      alert(err);
  });


// function to chat with the owner of the car which creates a new chat if the conversation does not exist on the car and the buyer and seller and redirects to the conversation page 
// if the conversation does not exist then it creates a new conversation and then redirects to the conversation page
$scope.chatWithOwner = (owner) => {
  const loggedInUser = JSON.parse(sessionStorage.getItem("user"));
  IDB.getUserConversations(loggedInUser.username)
  .then((conversations) => {
      const existingConversation = conversations.find(conversation => 
          conversation.receiver.username === owner.username && 
          conversation.car.id === $scope.car.id
      );

      if (existingConversation) {
          console.log("Existing conversation found", existingConversation);
          $state.go("conversations", { id: $scope.car.id });
      } else {
          const conversation = {
              sender: loggedInUser,
              receiver: owner,
              car: $scope.car,
              createdAt: new Date(),
          };

          IDB.addConversation(conversation)
          .then((response) => {
              console.log("Conversation created successfully", response);
              $state.go("conversations", { id: $scope.car.id });
          })
          .catch((error) => {
              console.log("Error creating conversation", error);
              alert("There was an error creating the conversation. Please try again.");
          });
      }
  })
  .catch((error) => {
      console.log("Error fetching conversations", error);
      alert("There was an error fetching conversations. Please try again.");
  });
};
});


// function to return all the dates between a startDate and endDate
function getDatesBetween(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);
  
    while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  }
  