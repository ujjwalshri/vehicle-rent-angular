angular.module('myApp').controller('manageBookingsCtrl', function($scope, $state, $stateParams, IDB, calculateBookingPrice) {
    const bookingID = $stateParams.id;
    $scope.calculateBookingPrice = calculateBookingPrice.calculate;

    $scope.init = () => {
        $scope.startOdometerValue = '';
        $scope.endOdometerValue = '';
        $scope.ended = false;
        IDB.getBookingByID(bookingID).then((booking) => {
            $scope.booking = booking;
            console.log($scope.booking);
            $scope.started = $scope.booking.started;
            $scope.ended = $scope.booking.ended;
        }).catch((err) => {
            console.log(err);
        });
    };

    $scope.downloadBillAsPDF = () => {
        var docDefinition = {
            content: [
                { text: 'Booking Details', style: 'header' },
                { text: 'Booking ID: ' + $scope.booking.id },
                { text: 'Car: ' + $scope.booking.vehicle.carName },
                { text: 'Owner: ' + $scope.booking.owner.username },
                { text: 'Name: ' + $scope.booking.owner.firstName + ' ' + $scope.booking.owner.lastName },
                { text: 'Start Date: ' + $scope.booking.startDate },
                { text: 'End Date: ' + $scope.booking.endDate },
                { text: 'Start Odometer Value: ' + $scope.booking.startOdometerValue },
                { text: 'per day price: ' + $scope.booking.amount + 'per day' },
                { text: 'End Odometer Value: ' + $scope.booking.endOdometerValue },
                { text: 'Total Amount: ' + ($scope.calculateBookingPrice($scope.booking.startDate, $scope.booking.endDate, $scope.booking.amount) + ($scope.booking.endOdometerValue - $scope.booking.startOdometerValue > 300 ? 500 : 0)) + ' INR' }
            ],
            styles: {
                header: {
                    fontSize: 30,
                    bold: true,
                    margin: [0, 10, 0, 10]
                }
            }
        };
        pdfMake.createPdf(docDefinition).print();
    };

    $scope.startTrip = () => {
        if (!$scope.started) {
            $scope.booking.status = "started";
            IDB.updateBookingAndAddStartOdometerValue($scope.booking.id, $scope.startOdometerValue).then(() => {
                $scope.booking.startOdometerValue = $scope.startOdometerValue;
                $scope.started = true;
            }).catch((err) => {
                console.log(err);
            });
        }
    };

    $scope.endTrip = () => {
        if ($scope.started) {
            $scope.booking.status = "ended";
            IDB.updateBookingAndAddEndOdometerValue($scope.booking.id, $scope.endOdometerValue).then(() => {
                $scope.booking.endOdometerValue = $scope.endOdometerValue;
                $scope.started = false;
                $scope.ended = true;
            }).catch((err) => {
                console.log(err);
            });
        }
    };
});