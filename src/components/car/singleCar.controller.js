angular
  .module("myApp")
  .controller(
    "singleCarCtrl",
    function (
      $scope,
      $state,
      IDB,
      $stateParams,
      Bidding,
      Booking,
      $timeout
    ) {

      // init function to fetch the car, reviews and blocked dates
      $scope.init = () => {
        fetchCar();
        fetchReviews();
        fetchBlockedDates();
      };

      const loggedInUser = JSON.parse(sessionStorage.getItem("user")); // get the logged in user from the session storage
      $scope.calculateBookingPrice = Booking.calculate; // function to calculate the booking price
      $scope.user = loggedInUser.username; // get the username of the logged in user
      $scope.car = {};  // initial car object
      $scope.carReviews = []; // intital car reviews array
      $scope.blockedDates = []; //initial blocked dates array
      // initial bidding object
      $scope.bidding = {
        id: crypto.randomUUID(),
        amount: null,
        vehicle: {},
        startDate: null,
        endDate: null,
        status: "pending",
        from: {
          username: loggedInUser.username,
          firstName: loggedInUser.firstName,
          lastName: loggedInUser.lastName,
          email: loggedInUser.email,
          isBlocked: loggedInUser.isBlocked,
          isSeller: loggedInUser.isSeller,
          city: loggedInUser.city,
        },
        owner: null,
        createdAt: new Date(),
        location: "",
      };


      // function to fetch the car by the carID
      function fetchCar() { 
        IDB.getCarByID($stateParams.id)
          .then((car) => {
            $scope.car = car;
          })
          .catch((err) => alert(err));
      }
      // function to fetch the reviews by the carID
      function fetchReviews() {
        IDB.getReviewsByCarID($stateParams.id)
          .then((reviews) => {
            $scope.carReviews = reviews;
            const totalOfRatings = reviews.reduce((acc, review) => acc + review.rating, 0);
            $scope.averageRating = parseFloat((totalOfRatings / reviews.length).toFixed(1));
           if(reviews.length === 0){
            $scope.averageRating = 0;
           }
          })
          .catch((err) => alert(err));
      }
     // function to fetch the bookings of the car and then calculation the blocked dates by the carID
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
       // initialize the flatpickr date range picker
      function initializeFlatpickr() { // using timeout to make sure the angular updates the views after we have the blocked dates
        $timeout(() => {
            flatpickr("#dateRangePicker", {
                mode: "range",
                dateFormat: "Y-m-d",
                minDate: "today",
                disable: $scope.blockedDates.map(date => new Date(date)),
                onClose: function (selectedDates) {
                    if (selectedDates.length === 2) {
                        $scope.bidding.startDate = selectedDates[0].toISOString(); 
                        $scope.bidding.endDate = selectedDates[1].toISOString();
                        $timeout(); // using timeout to trigger the changes in the above score variables
                    }
                },
            });
        });
    }
    
      // function to place a bid on the car
      $scope.placeBid = async () => {
       

        $scope.bidding.vehicle = $scope.car;
        $scope.bidding.owner = $scope.car.owner;
        $scope.bidding.location = $scope.car.location;

        try {
          const isValid = Bidding.isValidBid(
            $scope.bidding
          );
          if (!isValid.success) {
            alert(isValid.message);
            return;
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
        const review = {
          id: crypto.randomUUID(),
            car: $scope.car,
            rating: parseInt($scope.rating),
            review: $scope.review,
            reviewer: {
              username: loggedInUser.username,
              firstName: loggedInUser.firstName,
              lastName: loggedInUser.lastName,
              email: loggedInUser.email,
              isBlocked: loggedInUser.isBlocked,
              isSeller: loggedInUser.isSeller,
              city: loggedInUser.city,
            },
            createdAt: new Date(),

        }
        
        if(review.review === "" ){
          alert("Please enter a review");
          return;
        }
      
        try {
             IDB.addReview(review).then((res)=>{
              console.log(res);
              fetchReviews();
              $scope.review = "";
              $scope.rating = '';
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

  async.waterfall(
    [
      function (callback) {
        IDB.getUserConversations(loggedInUser.username)
          .then((conversations) => callback(null, conversations))
          .catch((error) => callback(error));
      },
      function (conversations, callback) {
        const existingConversation = conversations.find(
          (conversation) =>
            conversation.receiver.username === owner.username &&
            conversation.car.id === $scope.car.id
        );

        if (existingConversation) {
          console.log("Existing conversation found", existingConversation);
          $state.go("conversations", { id: $scope.car.id });
          return;
        }

        const conversation = {
          sender: loggedInUser,
          receiver: owner,
          participants: [{
            username: loggedInUser.username,
            firstName: loggedInUser.firstName,
            lastName: loggedInUser.lastName,
            email: loggedInUser.email,
            isBlocked: loggedInUser.isBlocked,
            isSeller: loggedInUser.isSeller,
          }, owner],
          car: $scope.car,
          createdAt: new Date(),
        };

        IDB.addConversation(conversation)
          .then(() => callback(null))
          .catch((error) => callback(error));
      },
    ],
    function (error) {
      if (error) {
        console.error("Error:", error);
        alert("There was an error. Please try again.");
      } else {
        $state.go("conversations", { id: $scope.car.id });
      }
    }
  );
};


$scope.openModal = (images) => {
    $scope.car.vehicleImages = images;
    $scope.isModalOpen = true;
};

$scope.closeModal = () => {
    $scope.isModalOpen = false;
};


// function to get dates between a start and end date
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
