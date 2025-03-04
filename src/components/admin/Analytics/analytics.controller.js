angular
  .module("myApp")
  .controller("analyticsCtrl", function ($scope, $q, IDB, Booking) {
    $scope.init = () => {
      // Fetch all users
      $scope.calculateBookingPrice = Booking.calculate; // function to calculate the booking price from the booking factory
      $scope.months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ]; // array of months
      $scope.monthlyBookings = []; // monthly bookings as empty in the start
      $scope.carAndBiddingsMap = {}; // map to store the cars and the bidding on those
      $scope.ownerAndAddedCarsMap = {}; // map to store the owner and their added cars on the platform
      $scope.carAndReviewsMap = {}; //
      $scope.numberOfUsersPerCity = {};
      $scope.numberOfBookingsPerCar = {};
      $scope.carAndAverageRatingMap = {};
      fetchChartsData();
    };

    function fetchChartsData() {
      $q.all([
        IDB.getAllUsers(),
        IDB.getApprovedCars(),
        IDB.getAllBookings(),
        IDB.getAllReviews(),
      ])
        .then((results) => {
          console.log(results);
          calculateChartData(results);
          loadAllCharts();
        })
        .catch((err) => {
          console.error("Error loading charts data " + err);
          
        });
    }

    function calculateChartData(results) {
      $scope.allUsers = results[0]; // all users
      console.log($scope.allUsers);
      $scope.sellers = $scope.allUsers.filter(
        (user) => user.isSeller === true && user.isBlocked === false
      ); // all sellers
      $scope.buyers = $scope.allUsers.filter(
        (user) => user.isSeller === false && user.isBlocked === false
      ); // all buyers
      console.log($scope.sellers);
      console.log($scope.buyers);
      $scope.blocked = $scope.allUsers.filter(
        (user) => user.isBlocked === true
      ); // all blocked users
      $scope.numberOfUsersPerCity = $scope.allUsers.reduce((acc, user) => {
        // number of users per city
        if (acc[user.city]) {
          acc[user.city] += 1;
        } else {
          acc[user.city] = 1;
        }
        return acc;
      }, {});
      $scope.allCars = results[1]; // all cars
      console.log($scope.allCars);
      $scope.approvedCars = $scope.allCars.filter(
        (car) => car.status === "approved"
      ); // all approved cars
      $scope.deletedCars = $scope.allCars.filter((car) => car.deleted === true); // all deleted cars
      $scope.suvCars = $scope.allCars.filter(
        (car) => car.category === "SUV" && car.deleted === undefined
      ); // all suv cars and not deleted
      $scope.sedanCars = $scope.allCars.filter(
        (car) => car.category === "Sedan" && car.deleted === undefined
      ); // all sedan cars and not deleted
      $scope.ownerAndAddedCarsMap = $scope.allCars.reduce((acc, car) => {
        // number of cars added by owners on the platform
        if (acc[car.owner.username]) {
          acc[car.owner.username] += 1;
        } else {
          acc[car.owner.username] = 1;
        }
        return acc;
      }, {});

      $scope.AllBookings = results[2]; // all bookings
      $scope.confirmedBookings = $scope.AllBookings.filter(
        (booking) => booking.status === "approved"
      ); // all confirmed bookings
      $scope.endedBookings = $scope.AllBookings.filter(
        (booking) => booking.ended === true
      ); // all ended bookings
      $scope.calculatedBiddingConversionRate = Math.ceil(
        ($scope.confirmedBookings.length / $scope.AllBookings.length) * 100
      ); // bidding conversion rate calculation
      console.log($scope.calculatedBiddingConversionRate);

      // not i will fetch the boookings with the start month equal to the array of months at that particular month value in the array

      $scope.months.forEach((month, index) => {
        $scope.monthlyBookings[index] = $scope.AllBookings.filter(
          (booking) => new Date(booking.startDate).getMonth() === index
        ); // filter the bookings with the start month equal to the month value in the array
      });
      // populating the numberOfBookingsPerCar map with the number of bookings per car
      $scope.confirmedBookings.forEach((booking) => {
        if (
          $scope.numberOfBookingsPerCar[
            booking.vehicle.carName + " " + booking.vehicle.carModel
          ]
        ) {
          $scope.numberOfBookingsPerCar[
            booking.vehicle.carName + " " + booking.vehicle.carModel
          ] += 1;
        } else {
          $scope.numberOfBookingsPerCar[
            booking.vehicle.carName + " " + booking.vehicle.carModel
          ] = 1;
        }
      });

      // calculating the average booking duration of the cars
      const bookedDays = $scope.confirmedBookings.reduce((acc, booking) => {
        const startDate = new Date(booking.startDate);
        const endDate = new Date(booking.endDate);
        const duration = Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24); // duration in days
        acc += duration; // sum of all the durations
        return acc; // returing sum of all durations
      }, 0);

      $scope.averageBookingDuration =
        $scope.confirmedBookings.length > 0
          ? Math.ceil(bookedDays / $scope.confirmedBookings.length)
          : 0; // average booking duration calculation

      // sort the bookings of the car in sorted order
      $scope.numberOfBookingsPerCar = Object.entries(
        $scope.numberOfBookingsPerCar
      ).sort((a, b) => a[1] - b[1]);
      $scope.ownerAndAddedCarsMap = Object.entries(
        $scope.ownerAndAddedCarsMap
      ).sort((a, b) => b[1] - a[1]); // sort the ownerAndAddedCarsMap on the basis of the number of cars

      $scope.reviews = results[3]; // geting all the reviews
      $scope.reviews.forEach((review) => {
        // looping through the reviews
        if (
          review.car.carName === undefined ||
          review.car.carModel === undefined
        ) {
          return;
        }
        if (
          $scope.carAndReviewsMap[
            review.car.carName + " " + review.car.carModel
          ]
        ) {
          // if the car is already in the map
          $scope.carAndReviewsMap[
            review.car.carName + " " + review.car.carModel
          ] += 1;
        } else {
          // if the car is not in the map
          $scope.carAndReviewsMap[
            review.car.carName + " " + review.car.carModel
          ] = 1;
        }
      });

      $scope.carAndReviewsMap = Object.entries($scope.carAndReviewsMap).sort(
        (a, b) => b[1] - a[1]
      ); // sort the carAndReviewsMap with the highest number of reviews and return an array of arrays

      // populating the carAndAverageRatingMap with the average rating of the cars
      $scope.reviews.forEach((review) => {
        if (
          $scope.carAndAverageRatingMap[
            review.car.carName + " " + review.car.carModel
          ]
        ) {
          $scope.carAndAverageRatingMap[
            review.car.carName + " " + review.car.carModel
          ].push(review.rating);
        } else {
          $scope.carAndAverageRatingMap[
            review.car.carName + " " + review.car.carModel
          ] = [review.rating];
        }
      });

      // loop through the each car in carAndAverageRatingMap and calculate the average rating of the cars
      for (const car in $scope.carAndAverageRatingMap) {
        $scope.carAndAverageRatingMap[car] =
          $scope.carAndAverageRatingMap[car].reduce(
            (acc, rating) => acc + rating,
            0
          ) / $scope.carAndAverageRatingMap[car].length;
      }
      console.log($scope.carAndAverageRatingMap);
      $scope.carAndAverageRatingMap = Object.entries(
        $scope.carAndAverageRatingMap
      ).sort((a, b) => b[1] - a[1]); // sort the carAndAverageRatingMap with the decreasingly rating
      console.log($scope.carAndAverageRatingMap);
      console.log($scope.carAndReviewsMap);

      $scope.AllBookings.forEach((booking) => {
        if (
          $scope.carAndBiddingsMap[
            booking.vehicle.carName + " " + booking.vehicle.carModel
          ]
        ) {
          $scope.carAndBiddingsMap[
            booking.vehicle.carName + " " + booking.vehicle.carModel
          ] += 1;
        } else {
          $scope.carAndBiddingsMap[
            booking.vehicle.carName + " " + booking.vehicle.carModel
          ] = 1;
        }
      });
      // sort the map wi th the highest number of biddings
      console.log($scope.carAndBiddingsMap);
      $scope.carAndBiddingsMap = Object.entries($scope.carAndBiddingsMap).sort(
        (a, b) => b[1] - a[1]
      ); // sorting the map with the secodn element of the array
    }

    function loadAllCharts() {
      createCarAndBiddingsChart(); // create the car and biddings chart
      createTop3HighestRatedChart(); // create a chart for the top 3 highest rated cars
      createTop5MostReviewedCarsChart(); // create a chart for the top 5 most reviewed cars
      createMostRentedCarsChart(); // create the most rented cars chart
      createNumberOfBookingsPerCarChart(); // create the number of bookings per car chart
      createMonthlyTripsChart(); // create the monthly trips chart
      createSuvVsSedanPieChart(); // create the suv vs sedan pie chart
      createTop3SellersChart(); // create the top 3 sellers chart
      createNumberOfUsersPerCityChart(); // create the number of users per city chart
      createUserDescriptionChart(); // create the user description chart
    }

    function createCarAndBiddingsChart() {
      // Initialize the chart configuration after fetching bookings
      // will apply this chart to show only top 10 bidded cars on the platform
      var chartConfig = {
        type: "bar",
        data: {
          labels: $scope.carAndBiddingsMap.map((car) => car[0]).slice(0, 5),
          datasets: [
            {
              label: "Number of Biddings",
              backgroundColor: "#FF6384",
              data: $scope.carAndBiddingsMap.map((car) => car[1]).slice(0, 5),
            },
          ],
        },
        options: {
          title: {
            display: true,
            text: "Top 5 most popular cars on the platform",
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      };

      // Create the chart instance
      var ctx = document.getElementById("top10Cars").getContext("2d");
      new Chart(ctx, chartConfig);
    }

    function createMonthlyTripsChart() {
      // Initialize the chart configuration after fetching bookings
      var chartConfig = {
        type: "bar",
        data: {
          labels: $scope.months,
          datasets: [
            {
              label: "Monthly Trips",
              backgroundColor: "#36A2EB",
              data: $scope.monthlyBookings.map((month) => month.length),
            },
          ],
        },
        options: {
          title: {
            display: true,
            text: "Trip Months",
          },
        },
      };

      // Create the chart instance
      var ctx = document.getElementById("monthwiseCarTrips").getContext("2d");
      new Chart(ctx, chartConfig);
    }

    // function to create pie chart
    function createUserDescriptionChart() {
      // Initialize the chart configuration after fetching users
      var chartConfig = {
        type: "pie",
        data: {
          labels: ["Buyer", "Seller"],
          datasets: [
            {
              backgroundColor: ["#FF6384", "#36A2EB"],
              data: [$scope.buyers.length, $scope.sellers.length],
            },
          ],
        },
        options: {
          title: {
            display: true,
            text: "User Description (Buyer/Seller)",
          },
        },
      };

      // Create the chart instance
      var ctx = document
        .getElementById("userDescriptionChart")
        .getContext("2d");
      new Chart(ctx, chartConfig);
    }

    function createTop3SellersChart() {
      // Initialize the chart configuration after fetching users
      var chartConfig = {
        type: "bar",
        data: {
          labels: $scope.ownerAndAddedCarsMap
            .map((owner) => owner[0])
            .slice(0, 3),
          datasets: [
            {
              label: "Number of Cars Added",
              backgroundColor: "#F64104",
              data: $scope.ownerAndAddedCarsMap
                .map((owner) => owner[1])
                .slice(0, 3),
            },
          ],
        },
        options: {
          title: {
            display: true,
            text: "Top 3 Sellers with most cars added",
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      };
      // Create the chart instance
      var ctx = document.getElementById("top3Sellers").getContext("2d");
      new Chart(ctx, chartConfig);
    }

    function createTop5MostReviewedCarsChart() {
      // Initialize the chart configuration after fetching reviews
      var chartConfig = {
        type: "bar",
        data: {
          labels: $scope.carAndReviewsMap.map((car) => car[0]).slice(0, 3),
          datasets: [
            {
              label: "Number of Reviews",
              backgroundColor: "#FFCE56",
              data: $scope.carAndReviewsMap.map((car) => car[1]).slice(0, 3),
            },
          ],
        },
        options: {
          title: {
            display: true,
            text: "Top 3 most reviewed cars",
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      };

      // Create the chart instance
      var ctx = document
        .getElementById("top5MostReviewedCars")
        .getContext("2d");
      new Chart(ctx, chartConfig);
    }
    function createSuvVsSedanPieChart() {
      // Initialize the chart configuration after fetching cars
      var chartConfig = {
        type: "pie",
        data: {
          labels: ["SUV", "Sedan"],
          datasets: [
            {
              backgroundColor: ["#FF6384", "#36A2EB"],
              data: [$scope.suvCars.length, $scope.sedanCars.length],
            },
          ],
        },
        options: {
          title: {
            display: true,
            text: "SUV vs Sedan on the platform",
          },
        },
      };
      // Create the chart instance
      var ctx = document.getElementById("suvVsSedan").getContext("2d");
      new Chart(ctx, chartConfig);
    }

    function createNumberOfUsersPerCityChart() {
      // Initialize the chart configuration after fetching users
      var chartConfig = {
        type: "bar",
        data: {
          labels: Object.keys($scope.numberOfUsersPerCity),
          datasets: [
            {
              label: "Number of Users",
              backgroundColor: "#FF6384",
              data: Object.values($scope.numberOfUsersPerCity),
            },
          ],
        },
        options: {
          title: {
            display: true,
            text: "Number of users per city",
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      };
      // Create the chart instance
      var ctx = document
        .getElementById("numberOfUsersPerCity")
        .getContext("2d");
      new Chart(ctx, chartConfig);
    }

    function createNumberOfBookingsPerCarChart() {
      // top 3 least rented cars
      // Initialize the chart configuration after fetching bookings
      var chartConfig = {
        type: "bar",
        data: {
          labels: $scope.numberOfBookingsPerCar
            .map((car) => car[0])
            .slice(0, 3),
          datasets: [
            {
              label: "Number of Bookings",
              backgroundColor: "#FF6384",
              data: $scope.numberOfBookingsPerCar
                .map((car) => car[1])
                .slice(0, 3),
            },
          ],
        },
        options: {
          title: {
            display: true,
            text: "Top 3 least rented cars",
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      };
      // Create the chart instance
      var ctx = document.getElementById("leastRentedCars").getContext("2d");
      new Chart(ctx, chartConfig);
    }

    function createMostRentedCarsChart() {
      // top 3
      // Initialize the chart configuration after fetching bookings
      var chartConfig = {
        type: "bar",
        data: {
          labels: $scope.numberOfBookingsPerCar
            .map((car) => car[0])
            .slice(
              $scope.numberOfBookingsPerCar.length - 3,
              $scope.numberOfBookingsPerCar.length
            ),
          datasets: [
            {
              label: "Number of Bookings",
              backgroundColor: "#FF6384",
              data: $scope.numberOfBookingsPerCar
                .map((car) => car[1])
                .slice(
                  $scope.numberOfBookingsPerCar.length - 3,
                  $scope.numberOfBookingsPerCar.length
                ),
            },
          ],
        },
        options: {
          title: {
            display: true,
            text: "Top 3 most rented cars",
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      };
      // Create the chart instance
      var ctx = document.getElementById("mostRentedCars").getContext("2d");
      new Chart(ctx, chartConfig);
    }

    // function to create the top 3 highest rated car chart
    function createTop3HighestRatedChart() {
      var top3Cars = $scope.carAndAverageRatingMap.slice(0, 3);
      var chartConfig = {
        type: "bar",
        data: {
          labels: top3Cars.map((car) => car[0]),
          datasets: [
            {
              label: "Average Rating",
              backgroundColor: "#FF6384",
              data: top3Cars.map((car) => car[1]),
            },
          ],
        },
        options: {
          title: {
            display: true,
            text: "Top 3 Highest Rated Cars",
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      };

      var ctx = document.getElementById("highestRatedCars").getContext("2d");
      new Chart(ctx, chartConfig);
    }
    console.log($scope.calculatedBiddingConversionRate);
  });
