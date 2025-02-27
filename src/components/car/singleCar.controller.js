angular
  .module("myApp")
  .controller(
    "singleCarCtrl",
    function (
      $scope,
      $state,
      IDB,
      $stateParams,
      validateBidding,
      calculateBookingPrice,
      $timeout
    ) {
      const loggedInUser = JSON.parse(sessionStorage.getItem("user"));
      $scope.isSeller = loggedInUser && loggedInUser.isSeller === true;
      $scope.isModalOpen = false;
      $scope.calculateBookingPrice = calculateBookingPrice.calculate;
      $scope.user = loggedInUser.username;
      $scope.car = {};
      $scope.carReviews = [];
      $scope.blockedDates = [];

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
        location: "",
      };

      $scope.review = {
        id: crypto.randomUUID(),
        car: {},
        rating: 0,
        review: "",
        reviewer: loggedInUser,
        createdAt: new Date(),
      };

      $scope.init = () => {
        fetchCar();
        fetchReviews();
        fetchBlockedDates();
      };

      function fetchCar() {
        IDB.getCarByID($stateParams.id)
          .then((car) => {
            $scope.car = car;
          })
          .catch((err) => alert(err));
      }

      function fetchReviews() {
        IDB.getReviewsByCarID($stateParams.id)
          .then((reviews) => {
            $scope.carReviews = reviews;
          })
          .catch((err) => alert(err));
      }

      function fetchBlockedDates() {
        IDB.getBookingsByCarID($stateParams.id)
          .then((bids) => {
            $scope.blockedDates = bids
              .filter((bid) => bid.status === "approved")
              .flatMap((bid) =>
                getDatesBetween(new Date(bid.startDate), new Date(bid.endDate))
              );

            console.log("Blocked Dates:", $scope.blockedDates);
            initializeFlatpickr();
          })
          .catch((err) => console.error(err));
      }

      function initializeFlatpickr() {
        $timeout(() => {
          flatpickr("#dateRangePicker", {
            mode: "range",
            dateFormat: "Y-m-d",
            minDate: "today",
            disable: $scope.blockedDates.map((date) =>
              new Date(date)
            ),
            onClose: function (selectedDates) {
              if (selectedDates.length === 2) {
                $scope.bidding.startDate = selectedDates[0].toISOString();
                $scope.bidding.endDate = selectedDates[1].toISOString();
                $scope.$apply();
              }
            },
          });
        }, 500); // Small timeout to ensure Angular updates UI
      }

      $scope.placeBid = async () => {
        if ($scope.bidding.amount < $scope.car.carPrice) {
          alert("Bid amount must be at least the car price");
          return;
        }

        if (!$scope.bidding.startDate || !$scope.bidding.endDate) {
          alert("Please select a valid date range");
          return;
        }

        if ($scope.bidding.location !== $scope.car.location) {
          alert("Please enter a valid location");
          return;
        }

        $scope.bidding.vehicle = $scope.car;
        $scope.bidding.owner = $scope.car.owner;
        $scope.bidding.location = $scope.car.location;

        try {
          const isValid = validateBidding.isValidBid(
            $scope.bidding,
            $scope.blockedDates
          );

          if (!isValid.success) {
            throw new Error("Car is already booked for the selected date range");
          }

          await IDB.addBid($scope.bidding);
          alert("Bid placed successfully");
          $state.go("myBiddings");
        } catch (error) {
          console.error(error);
          alert(error.message || error);
        }
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
             IDB.addReview($scope.review).then((res)=>{
              console.log(res);
              $scope.carReviews.push($scope.review);
              $scope.review = {
                id: crypto.randomUUID(),
                car: {},
                rating: 0,
                review: "",
                reviewer: loggedInUser,
                createdAt: new Date(),
              };
             }).catch((err)=> {
              alert(err);
             }) // call the IDB service addReview function to add the review to the database
            
            alert('Review added successfully');
        } catch (error) {
            alert('There was an error adding your review. Please try again. ' + error);
        }
    
    };

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
              participants: [loggedInUser, owner],
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

$scope.openModal = (images) => {
    $scope.car.vehicleImages = images;
    $scope.isModalOpen = true;
};

$scope.closeModal = () => {
    $scope.isModalOpen = false;
};
      function getDatesBetween(startDate, endDate) {
        let dates = [];
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          dates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
      }
    }
  );
