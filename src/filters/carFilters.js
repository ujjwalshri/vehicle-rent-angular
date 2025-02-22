angular.module("myApp").filter("carFilters", function() {
    return function (cars, search, priceFilter, categoryFilter, carLocation) {
        if (!cars) return [];
        return cars.filter(function (car) {
            let matchesSearch = !search || car.carName.toLowerCase().includes(search.toLowerCase());

            let matchesPrice = true;
            if (priceFilter) {
                let price = parseFloat(car.carPrice);
                if (priceFilter === "0-500") matchesPrice = price < 500;
                else if (priceFilter === "500-1000") matchesPrice = price >= 500 && price <= 1000;
                else if (priceFilter === "1000-2000") matchesPrice = price >= 1000 && price <= 2000;
                else if (priceFilter === "2000") matchesPrice = price > 2000;
            }

            let matchesLocation = !carLocation || carLocation === car.location;

            let matchesCategory = !categoryFilter || car.category === categoryFilter;

            return matchesSearch && matchesPrice && matchesCategory && matchesLocation;
        });
    };
});