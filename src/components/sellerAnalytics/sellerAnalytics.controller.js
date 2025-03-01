angular.module('myApp').controller('sellerAnalyticsCtrl', function($scope, $state, IDB, $rootScope) {
    $scope.test = 'sellerAnalyticsCtrl';
    const loggedInUser = JSON.parse(sessionStorage.getItem("user"));

    $scope.init = () => {
        $scope.carsAndBidsMap = {}; // map to store all cars names and the amount of bids they have
        $scope.cityAndBookingMap = {}; // map to store all cities of users and the amount of bookings they have

        fetchSellersBiddings(); //  initial fetch of all biddings
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
                if ($scope.cityAndBookingMap[city]) {
                    $scope.cityAndBookingMap[city] += 1;
                } else {
                    $scope.cityAndBookingMap[city] = 1;
                }
            });
            console.log($scope.cityAndBookingMap);

            console.log($scope.carsAndBidsMap);
            $scope.carsAndBidsMap = Object.entries($scope.carsAndBidsMap).sort((a, b) => b[1] - a[1]); // sort the map by the number of bids and return an array of sorted entries
            console.log($scope.carsAndBidsMap);
            createCityWiseBookingChart(); // create the chart
            createTop3CarsChart(); // create the chart
        }).catch(err => console.log(err));
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
});