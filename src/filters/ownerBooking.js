angular.module('myApp').filter('ownerBookingFilter', function () {
    return function (bookings, searchCarName) {
        if (!bookings) return [];
        return bookings.filter(function (booking) {
            let matchesCarName = !searchCarName || booking.vehicle.carName.toLowerCase().includes(searchCarName.toLowerCase());
            return matchesCarName;
        });
    };
});
