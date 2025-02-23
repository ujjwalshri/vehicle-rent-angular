angular
  .module("myApp")
  .controller("addCarCtrl", function ($scope, $state, IDB) {
    $scope.test = "Hello World!";
    const loggedInUser = JSON.parse(sessionStorage.getItem("user"));

    $scope.images = []; // Array to store image objects { file: File, base64: "data:image/png;base64,..." }

    $scope.car = {
      id: crypto.randomUUID(),
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
          
          reader.onload = function (e) {
            $scope.$apply(() => {
              $scope.images.push({ file: file, base64: e.target.result });
              processedFiles++;

              // Log to confirm images are being added
              console.log("Image added:", file.name);
              
              // Ensure all images are processed before allowing submission
              if (processedFiles === totalFiles) {
                console.log("All images processed:", $scope.images);
              }
            });
          };

          reader.readAsDataURL(file);
        });
      }
    };

    // Submit form function
    $scope.submitCarForm = function () {
      if ($scope.images.length === 0) {
        alert("Please upload at least one image.");
        return;
      }

      console.log("Selected Images:", $scope.images);
      console.log("Car Data before submission:", $scope.car);

      // Convert image objects to just base64 strings for storage
      $scope.car.vehicleImages = $scope.images.map((image) => image.base64);

      // Save to IndexedDB
      IDB.addCar($scope.car)
        .then(function (response) {
          console.log("Car added successfully:", response);

          IDB.makeUserSeller(loggedInUser.username).then((response) => {
            console.log("User updated to seller:", response);
          }).catch((error) => {
            console.error("Error making user seller:", error);
          });
          $state.go("home");

        })
        .catch(function (error) {
          console.error("Error adding car:", error);
        });
    };
  });
