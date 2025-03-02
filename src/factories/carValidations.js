angular.module('myApp').factory('carValidation', function($q) {
    return {
        validateCar: function(car) {
            if (car.carName.trim().length < 3) {
                return false;
            }
            if (car.carPrice < 0) {
                return false;
            }
            if (car.carPrice > 10000 || car.carPrice < 500) {
                return false;
            }
            if (car.carModel < 1900 || car.carModel > new Date().getFullYear()) {
                return false;
            }
            if (car.mileage < 0) {
                return false;
            }
            if (car.vehicleImages.length < 1) {
                return false;
            }
            if (car.vehicleImages.length > 5) {
                return false;
            }
            return true;
        },

        
        validateCarSchema: function(car) {
            // check if car object has all the required properties
            const requiredFields = ["car_no", "carType", "carName", "carModel", "category", "location", "carPrice", "mileage"];
          for (let field of requiredFields) {
             if (!car[field]) {
                 return false;
             }
        }
            return true;
        }
    };
});