angular
  .module("myApp")
  .controller("addCarCtrl", function ($scope, $state, IDB, $timeout) {
    $scope.test = "Hello World!";
    const loggedInUser = JSON.parse(sessionStorage.getItem("user"));

    $scope.images = []; 

    $scope.car = {
      car_no: "",
      carType: "",
      carName: "",
      carModel: "",
      category: "",
      location: "",
      isApproved: "pending",
      owner: {
        username : loggedInUser.username,
        firstName: loggedInUser.firstName,
        lastName: loggedInUser.lastName,
        email: loggedInUser.email,
        adhaar: loggedInUser.adhaar,
        city: loggedInUser.city,
      },
      carPrice: "",
      mileage: "",
      vehicleImages: [], // This will store the base64 images
      features: {
        GPS: false,
        Sunroof: false,
        Bluetooth: false,
        RearCamera: false,
        HeatedSeats: false,
      },
      createdAt: new Date(),
    };

    // Function to handle image preview and Base64 conversion
    $scope.previewImages = function (input) {
      if (input.files) {
        let files = Array.from(input.files); // Convert FileList to an array
        let totalFiles = files.length;
        let processedFiles = 0;
    
        files.forEach((file) => {
          let reader = new FileReader();
          reader.readAsDataURL(file);
          
          reader.onload = function (e) {
         
            $scope.images.push({ file: file, base64: e.target.result });
            processedFiles++;
    
        
            console.log("Image added:", file.name);
    
            
            if (processedFiles === totalFiles) {
              console.log("All images processed:", $scope.images);
            }
    
            // using timeout for no delay to the angualrr digest cycle
            $timeout();
          };
        });
      }
    };
    

    // Submit form function
    $scope.submitCarForm = function () {
      if ($scope.images.length === 0) {
        alert("Please upload at least one image.");
        return;
      }
      if($scope.images.length > 5){
        alert("Please upload a maximum of 5 images.");
        return;
      }

      console.log("Selected Images:", $scope.images);
      console.log("Car Data before submission:", $scope.car);
       // adding the base64 strings from the images to the car object's vehicleImages array
      $scope.car.vehicleImages = $scope.images.map((image) => image.base64);

      if($scope.car.carPrice < 0 || $scope.car.carPrice == null || $scope.car.carPrice > 10000 || $scope.car.carPrice <500){ r 
        alert("Please enter a valid price");
        return;
      }
      IDB.addCar($scope.car)
      .then((response) => {
        console.log("Car added successfully:", response);
        return IDB.makeUserSeller(loggedInUser.username); // Return the next promise
      })
      .then((response) => {
        console.log("User updated to seller:", response);
        $state.go("home"); 
      })
      .catch((error) => {
        alert("error adding car");
      });    
    };
  });
