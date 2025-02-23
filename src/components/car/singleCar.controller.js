angular.module("myApp").controller("singleCarCtrl", function($scope, $state, IDB, $stateParams, ) {
    const loggedInUser = JSON.parse(sessionStorage.getItem("user"));
    $scope.isSeller = loggedInUser && loggedInUser.isSeller === true;
    $scope.isModalOpen = false;
    console.log($stateParams.id);
    $scope.car = {};

    $scope.bidding = {
        id: crypto.randomUUID(),
        amount : null,
        car: {}, 
        startDate: null,
        endDate: null,
        status: "pending",
        from: loggedInUser,
        owner: null,
        createdAt: new Date(),
        location: ""
     };
 

    $scope.placeBid = ()=>{
        $scope.bidding.car = $scope.car;
        $scope.bidding.owner = $scope.car.owner;
       if($scope.bidding.amount<0 || $scope.bidding.amount == null || $scope.bidding.amount < $scope.car.carPrice){
              alert("Please enter a valid amount");
              return;
       }
       if(new Date($scope.bidding.startDate) > new Date($scope.bidding.endDate)){
         alert("Please enter a valid date range");
            return;
      }     
      if($scope.bidding.location == "" || $scope.bidding.location !== $scope.car.location){
        alert("Please enter a valid location");
           return;
      }
      console.log($scope.bidding);  
      IDB.addBid($scope.bidding).then(()=>{
        alert("Bid placed successfully");
        $state.go("conversations");
      }).catch((e)=>{
        alert(e);
      })

    }

    IDB.getCarByID($stateParams.id).then((car)=>{
        $scope.car = car;
        console.log($scope.car);
    }).catch((err)=>{
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