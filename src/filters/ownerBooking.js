angular.module("myApp").filter("ownerBookingFilter", function() {
    return function(bookings, status) {
        if (!bookings) return [];
        return bookings.filter(function(booking) {
            return booking.status !== status;
        });
    };
});