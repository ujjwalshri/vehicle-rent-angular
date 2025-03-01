angular.module("myApp").filter("carFilters", function() {
    return function (cars, search, priceFilter, categoryFilter, carLocation) {
        if (!cars) return [];
        const priceRanges = {
            "0-500": [0, 500],
            "500-1000": [500, 1000],
            "1000-1500": [1000, 1500],
            "1500-2000": [1500, 2000],
            "2000-2500": [2000, 2500],
            "2500-3000": [2500, 3000],
            "3000-3500": [3000, 3500],
            "3500-4000": [3500, 4000],
            "4000-4500": [4000, 4500],
            "4500-5000": [4500, 5000],
            "5000-5500": [5000, 5500],
            "5500-6000": [5500, 6000],
            "6000-6500": [6000, 6500],
            "6500-7000": [6500, 7000],
            "7000-7500": [7000, 7500],
            "7500-8000": [7500, 8000],
            "8000-8500": [8000, 8500],
            "8500-9000": [8500, 9000],
            "9000-9500": [9000, 9500],
            "9500-10000": [9500, 10000],
            "10000": [10000, Infinity]
        };

        return cars.filter(function (car) {
            let matchesSearch = !search || car.carName.toLowerCase().includes(search.toLowerCase());

            let matchesPrice = true;
            if (priceFilter) {
                let price = parseFloat(car.carPrice);
                if (priceRanges[priceFilter]) {
                    let [min, max] = priceRanges[priceFilter];
                    matchesPrice = price >= min && price < max;
                }
            }

            let matchesLocation = !carLocation || carLocation === car.location;
            let matchesCategory = !categoryFilter || car.category === categoryFilter;

            return matchesSearch && matchesPrice && matchesCategory && matchesLocation;
        });
    };
});