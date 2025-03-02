angular
  .module("myApp")
  .controller("userManagementCtrl", function ($scope, $state, IDB, $q, ) {
    $scope.allUsers = [];
    $scope.buyers = [];
    $scope.sellers = [];
    // call database function to get all the users
    $scope.users = [];
    $scope.init = () => {
      fetchUsers(); // initial fetch of users
    };

    //for fetching all the users and then filtering them into buyers and sellers
    function fetchUsers() {
      IDB.getAllUsers() 
        .then((users) => {
          $scope.allUsers = users.filter((user) => user.isBlocked === false);
          $scope.buyers = $scope.allUsers.filter((user) => {
            return user.isSeller === false;
          });
          $scope.sellers = $scope.allUsers.filter((user) => {
            return user.isSeller === true;
          });
          console.log("Buyers");
          console.log($scope.buyers);
          console.log("Sellers");
          console.log($scope.sellers);
        })
        .catch((err) => {
          console.log(err);
          alert(err);
        });
    }

    // function to block a user and then getting all the cars of that user and then deleting all the cars of that user
    // function to block a user and then getting all the cars of that user and then deleting all the cars of that user
    // using the async libary to do the task in a waterfall manner
    $scope.block = (username) => { // blocking function 
      async.waterfall(    // using async.waterfall() to run the functions in a waterfall manner
        [
          function (callback) {
            IDB.blockUserByUsername(username)
              .then((response) => {
                console.log(response);
                alert("User blocked successfully");
                fetchUsers();
                callback(null, username);
              })
              .catch((err) => {
                console.log(err);
                alert("Error blocking user");
                callback(err);
              });
          },
          function (username, callback) {
            IDB.getAllCarsByUser(username)
              .then((cars) => {
                callback(null, cars);
              })
              .catch((err) => {
                console.log(err);
                callback(err);
              });
          },
          function (cars, callback) {
            async.each(  // using async.each() to iterate over the cars and delete them parallely
              cars,
              (car, cb) => {
                IDB.deleteCar(car.id)
                  .then((response) => {
                    console.log(response);
                    cb();
                  })
                  .catch((err) => {
                    console.log("Error deleting car after blocking user");
                    cb(err);
                  });
              },
              (err) => {
                if (err) {
                  callback(err);
                } else {
                  callback(null);
                }
              }
            );
          },
        ],
        function (err) {
          if (err) {
            console.log(err);
            alert("Error in the process");
          } else {
            console.log("All cars deleted successfully");
          }
        }
      );
    };
  });
