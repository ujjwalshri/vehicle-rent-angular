angular.module('myApp').controller('manageBookingsCtrl', function($scope,$state, $stateParams, IDB, calculateBookingPrice) {
    const bookingID = $stateParams.id;
    $scope.calculateBookingPrice = calculateBookingPrice.calculate;
    IDB.getBookingByID(bookingID).then((booking) => {
        $scope.booking = booking;
        console.log($scope.booking);
    }).catch((err) => {
        console.log(err);
    });
    // $scope.openModal = () => {
        
    // };
});