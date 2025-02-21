

angular
  .module("myApp")
  .controller("addCarCtrl", function ($scope, $state, IDB) {
    $scope.test = "Hello World!";
    const loggedInUser = JSON.parse(sessionStorage.getItem("user"));
    // take the values from the ng model and save them into the database my using IDM.addCar()
    $scope.images= [];

      $scope.car = {
        id : crypto.randomUUID(),
        car_no: "",
        carType: "",
        carName: "",
        carModel: "",
        category: "",
        location: "",
        isApproved: "pending",
        owner: loggedInUser,
        carPrice: "",
        mileage: "",
        vehicleImages: [],
        features: {
          GPS: false,
          Sunroof: false,
          Bluetooth: false,
          RearCamera: false,
          HeatedSeats: false,
        },
      };
     

      $scope.submitCarForm = function () {
        // converting the images to base64 to store into the database
        console.log($scope.images);
        console.log($scope.car);
        $scope.car.vehicleImages = $scope.images.map(function (image) {
          return image.base64;
        });
        // Assuming addCar is a function that stores the car in the database
        IDB.addCar($scope.car)
          .then(function (response) {
            console.log("Car added successfully:", response);
            $state.go("home");
          })
          .catch(function (error) {
            console.error("Error adding car:", error);
          });
      };
    });

