
angular.module('myApp').service('AuthService', function($q, IDB) {
    this.validateUser = function(user) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (user.password.trim() !== user.confirmPassword.trim()) {
            return $q.reject("Passwords do not match!");
        }
        if(user.password.trim().length < 8){
            return $q.reject("Password should be atleast 8 characters long");
        }
        if(String(user.adhaar).length !== 12){
            return $q.reject("Adhaar number should be 12 digits long");
        }
        if(user.username.trim().length < 6){
            return $q.reject("Username should be atleast 6 characters long");
        }
        if(emailRegex.test(user.email.trim())===false){
            return $q.reject("Invalid email address");
        }
        return $q.resolve();
    };

    this.loginUser = function(username, password) {
        const deferred = $q.defer();
        IDB.loginUser(username, password)
            .then(res => {
                deferred.resolve(res);
            })
            .catch(err => {
                deferred.reject(err);
            });
        return deferred.promise;
    };

    this.registerUser = function(user) {
        return IDB.registerUser(user);
    };
});