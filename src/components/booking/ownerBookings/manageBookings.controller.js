angular.module('myApp').controller('manageBookingsCtrl', function($scope, $stateParams, IDB, Booking) {
    const bookingID = $stateParams.id; // get the booking id from the state params
    $scope.calculateBookingPrice = Booking.calculate; // function to calculate the booking price from the booking factory
   // init function to run when the page mounts
    $scope.init = () => {
        $scope.startOdometerValue = ''; // initial start odometer value
        $scope.endOdometerValue = ''; // initial end odometer value
        $scope.ended = false; // initial end status
        IDB.getBookingByID(bookingID).then((booking) => { // get the booking by the booking id
            $scope.booking = booking;
            console.log($scope.booking);
            $scope.started = $scope.booking.started; // set started to the booking started status
            $scope.ended = $scope.booking.ended; // set ended to the booking ended status
        }).catch((err) => {
            console.log(err);
        });
    };
    // function create a pdf of the booking details when the user clicks on the download invoice button
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
                { text: 'Total Amount: ' + ($scope.calculateBookingPrice($scope.booking.startDate, $scope.booking.endDate, $scope.booking.amount) + ($scope.booking.endOdometerValue - $scope.booking.startOdometerValue > 300 ? 500 : 0)) + ' INR' },
                {text: 'fine applied on additional kms' + ($scope.booking.endOdometerValue - $scope.booking.startOdometerValue > 300 ? 500 : 0) + 'INR'}
            ],
            styles: {
                header: {
                    fontSize: 30,
                    bold: true,
                    margin: [0, 10, 0, 10]
                }
            }
        };
        pdfMake.createPdf(docDefinition).print(); // create the pdf and print it using the print function
    };
    // function to start the trip when the user clicks on the start trip button
    $scope.startTrip = () => {
        if (!$scope.started) {

            IDB.updateBookingAndAddStartOdometerValue($scope.booking.id, $scope.startOdometerValue).then(() => { // call to the database function to update the booking  and add the start odometer value
                $scope.booking.startOdometerValue = $scope.startOdometerValue;
                $scope.started = true;
            }).catch((err) => {
                console.log(err);
            });
        }
    };
   // function to end the trip when the user clicks on the end trip button 
    $scope.endTrip = () => {
        if ($scope.started) {

            IDB.updateBookingAndAddEndOdometerValue($scope.booking.id, $scope.endOdometerValue).then(() => { // call to the database function to update the booking  and add the end odometer value
                $scope.booking.endOdometerValue = $scope.endOdometerValue;
                $scope.started = false;
                $scope.ended = true;
            }).catch((err) => {
                console.log(err);
            });
        }
    };
});