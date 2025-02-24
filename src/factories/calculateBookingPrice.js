app.factory('calculateBookingPrice', function(){
    return {
        calculate: function(startDate, endDate, carPrice){
          

            // Ensure date format is correct
            if (!startDate || !endDate) {
                console.error("❌ Dates cannot be empty");
                return 0;
            }

            // Convert to Date objects
            var start = new Date(startDate);
            var end = new Date(endDate);

        

            // Check if dates are valid
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                console.error("❌ Invalid date input. Check format.");
                return 0;
            }

            // Calculate difference in days
            var diffTime = end.getTime() - start.getTime();
            var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // Ensure positive number of days
            if (diffDays < 0) {
                console.error("❌ End date must be after start date");
                return 0;
            }

            var totalPrice = (diffDays+1) * carPrice;
            

            return totalPrice;
        }
    };
});
