angular.module("myApp").factory("hashPassword", function() {
    return function(password) {
        // Add your hashing logic here
        // adding hashing logic by using the btoa 
/// returns a function that takes the password as an argument and returns the hashed
        return btoa(password);
    }
});
