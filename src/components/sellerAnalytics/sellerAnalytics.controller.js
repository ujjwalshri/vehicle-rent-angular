angular.module('myApp').controller('sellerAnalyticsCtrl', function($scope, IDB) {
     // retriving the loggedinUser 
    const loggedInUser = JSON.parse(sessionStorage.getItem("user"));
    $scope.init = () => {
        $scope.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']; // array of months
        $scope.monthWiseBookings = []; // map to store the bookings at each month
        $scope.carsAndBidsMap = {}; // map to store all cars names and the amount of bids they have
        $scope.cityAndBookingMap = {}; // map to store all cities of users and the amount of bookings they have
        $scope.carAndBookingsMap = {}; // map to store all cars and the amount of bookings they have
        fetchSellersBiddings(); //  initial fetch of all biddings
        fetchCarsByOwner(); // fetching all cars by owner
    }
    // functions to fetch all biddings for a particular seller
    function fetchSellersBiddings() {
        IDB.getBookingsByOwnerId(loggedInUser.username).then(biddings => {// fetch all biddings for a particular seller username
            console.log(biddings);
            $scope.bookings = biddings.filter(booking => booking.status === "approved"); // filter out the approved biddings
        
            biddings.forEach(bidding => {  // loop through all biddings
                const carName = bidding.vehicle.carName + ' ' + bidding.vehicle.carModel;
                if ($scope.carsAndBidsMap[carName]) {
                    $scope.carsAndBidsMap[carName] += 1;
                } else {
                    $scope.carsAndBidsMap[carName] = 1;
                }
            });
          

            $scope.bookings.forEach(booking => { // loop through all bookings
                const city = booking.from.city;
                if ($scope.cityAndBookingMap[city]) { // if the city is already in the map increment the count
                    $scope.cityAndBookingMap[city] += 1;
                } else {
                    $scope.cityAndBookingMap[city] = 1; // else add the city to the map
                }
            });

            $scope.bookings.forEach(bookings =>{
                const carName = bookings.vehicle.carName + ' ' + bookings.vehicle.carModel;
                if($scope.carAndBookingsMap[carName]){
                    $scope.carAndBookingsMap[carName] += 1;
                }else{
                    $scope.carAndBookingsMap[carName] = 1;
                }
            })

            $scope.months.forEach((month, index)=>{
                $scope.monthWiseBookings[index] = $scope.bookings.filter(booking => new Date(booking.startDate).getMonth() === index).length; // filter the bookings with the start month equal to the index value in the array
            });

            console.log($scope.monthWiseBookings);
            
            console.log($scope.carAndBookingsMap);

            console.log($scope.cityAndBookingMap);
            console.log($scope.carsAndBidsMap);
            $scope.carsAndBidsMap = Object.entries($scope.carsAndBidsMap).sort((a, b) => b[1] - a[1]); // sort the map by the number of bids and return an array of sorted entries
            console.log($scope.carsAndBidsMap);
            createMonthWiseBookingsChart();
            createCarAndBookingsChart();
            createCityWiseBookingChart(); // create the chart
            createTop3CarsChart(); // create the chart
        }).catch(err => console.log(err));
    }

    function fetchCarsByOwner() {
        IDB.getAllCarsByUser(loggedInUser.username).then(cars => {
            $scope.cars = cars;
            $scope.suvCars = cars.filter(car=> car.category=== 'SUV' && car.deleted === undefined);
            $scope.sedanCars = cars.filter(car=> car.category=== 'Sedan' && car.deleted === undefined);
            createCarCategoryChart(); // creating a pie chart for the above data
        }).catch(err => {
            console.log(err);
        });
    }

    


    function createCarCategoryChart(){
        // creating a pie chart for the suv and sedan cars for that particular seller
        var ctx = document.getElementById("suvVsSedanForSeller").getContext("2d");
        const carCategoryChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['SUV', 'Sedan'],
                datasets: [{
                    label: 'Number of cars',
                    data: [$scope.suvCars.length, $scope.sedanCars.length],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                title: {
                    display: true,
                    text: "SUV vs Sedan cars"
                }
            }
        });
    }





   // function to create the chart for top 3 cars with the most bids
    function createTop3CarsChart() {
        const labels = $scope.carsAndBidsMap.slice(0, 3).map(car => car[0]);
        const data = $scope.carsAndBidsMap.slice(0, 3).map(car => car[1]);
    
        var ctx = document.getElementById("myMostPopularCar").getContext("2d");
        const top3CarsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Number of bids',
                    data: data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(54, 162, 235, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(54, 162, 235, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                title: {
                    display: true,
                    text: "Top 3 Most Popular cars of yours"
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }


    function createCityWiseBookingChart(){
        // bookings by users from the different city
        const labels = Object.keys($scope.cityAndBookingMap);
        const data = Object.values($scope.cityAndBookingMap);
        var ctx = document.getElementById("cityWiseBooking").getContext("2d");
        const cityWiseBookingChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Number of bookings',
                    data: data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(54, 162, 235, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(54, 162, 235, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                title: {
                    display: true,
                    text: "City wise bookings"
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }


    function createCarAndBookingsChart(){
        // bookings by users from the different city
        const labels = Object.keys($scope.carAndBookingsMap);
        const data = Object.values($scope.carAndBookingsMap);
        var ctx = document.getElementById("carAndBookingsChart").getContext("2d");
        const carWiseBookingChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Number of bookings',
                    data: data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(54, 162, 235, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(54, 162, 235, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                title: {
                    display: true,
                    text: "Car wise bookings"
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }

    }
        });
    }

    // function to create the chart for month wise bookings
    function createMonthWiseBookingsChart(){
        var ctx = document.getElementById("numberOfBookingsPerMonth").getContext("2d");
        const monthWiseBookingsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: $scope.months,
                datasets: [{
                    label: 'Number of bookings',
                    data: $scope.monthWiseBookings,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(54, 162, 235, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(54, 162, 235, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                title: {
                    display: true,
                    text: "Month wise bookings"
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });


    }
});