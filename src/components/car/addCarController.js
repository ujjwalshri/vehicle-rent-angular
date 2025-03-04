angular
  .module("myApp")
  .controller("addCarCtrl", function ($scope, $state, IDB, $timeout,carValidation, ToastService ) {
    
    const loggedInUser = JSON.parse(sessionStorage.getItem("user")); // getting the loggedInUser
    $scope.images = []; // This will store the selected images
    // Function to handle image preview and Base64 conversion
    $scope.previewImages = function (input) {
      if (input.files) {
        let files = Array.from(input.files); // Convert FileList to an array
        let totalFiles = files.length;
        let processedFiles = 0;
    
        files.forEach((file) => {
          let reader = new FileReader();
          reader.readAsDataURL(file); // converts file into the base64 string
          
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

      // Car object to be added to the database
      const car = {
        car_no: $scope.car_no,
        carType: $scope.carType,
        carName: $scope.carName,
        carModel: $scope.carModel,
        category: $scope.category,
        location: $scope.location,
        isApproved: "pending",
        owner: {
          username: loggedInUser.username,
          firstName: loggedInUser.firstName,
          lastName: loggedInUser.lastName,
          email: loggedInUser.email,
          adhaar: loggedInUser.adhaar,
          city: loggedInUser.city,
          isBlocked: loggedInUser.isBlocked
        },
        carPrice: $scope.carPrice,
        mileage: $scope.mileage,
        vehicleImages: [], // This will store the base64 images
        features: {
          GPS: $scope.GPS,
          Sunroof: $scope.Sunroof,
          Bluetooth: $scope.Bluetooth,
          RearCamera: $scope.RearCamera,
          HeatedSeats: $scope.HeatedSeats,
        },
        createdAt: new Date(),
      };
    
      
    
      console.log("Selected Images:", $scope.images);
      console.log(car);
    
      // adding the base64 strings from the images to the car object's vehicleImages array
      car.vehicleImages = $scope.images.map((image) => image.base64);

      // validation for the car object properties
      if (!carValidation.validateCarSchema(car)) {
        ToastService.error("please fill all the required fields");
        return;
      }
      if(!carValidation.validateCar(car)){
        ToastService.error("invalid car details");
        return;
      }
      // Add the car to the database
      IDB.addCar(car)
        .then((response) => {
          ToastService.success(`car added successfully`);
          return IDB.makeUserSeller(loggedInUser.username); // Returns the next promise
        })
        .then((response) => {
          $state.go("home");
        })
        .catch((error) => {
          ToastService.error(`error adding car ${error}`);
        });
    };
  });
