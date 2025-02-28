angular.module('myApp').factory('validateBidding', function() {
    return {
        isValidBid: function(bidding, blockedDates) {
         
            if (!bidding.startDate || !bidding.endDate) {
                return { success: false, message: "Please select a valid date range." };
            }
            // check if only the start date date itself is less than the date of today like 23feb < 24 feb
            
            const startDate = new Date(bidding.startDate);
            const endDate = new Date(bidding.endDate);
           
            // Convert blockedDates to Date objects for efficient checking
            const blockedDateSet = new Set(blockedDates.map(date => new Date(date).toISOString().split("T")[0]));

            // Check if any day in the selected range is already booked
            let currentDate = new Date(startDate);
            while (currentDate <= endDate) {
                let formattedDate = currentDate.toISOString().split("T")[0]; 
                if (blockedDateSet.has(formattedDate)) {
                    return { success: false, message: "Selected dates are already booked." };
                }
                currentDate.setDate(currentDate.getDate() + 1)
            }

            return { success: true };
        }
    };
});
