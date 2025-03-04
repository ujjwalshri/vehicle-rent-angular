angular.module('myApp').controller('userBookingsCtrl', function($scope,IDB,Booking ){
    
    $scope.calculateBookingPrice = Booking.calculate; // function to calculate the booking price from the booking factory
    // getting all the bookings from the database
    IDB.getAllBookings().then((bookings) => {
        $scope.bookings = bookings.filter((booking) => {
            return booking.status === "approved"; // filtering out the approved bookings 
        }).filter((booking) => {
            return booking.from.username === JSON.parse(sessionStorage.getItem('user')).username; // filtering out the bookings of the logged in user
        });
    });
    // $scope.userReview = "";
    // $scope.userRating = "";
    // // $scope.addReview = (car)=>{
    //   const loggedInUser = JSON.parse(sessionStorage.getItem("user"));
    //         const review = {
    //             id: crypto.randomUUID(),
    //               car: car,
    //               rating: parseInt($scope.userRating),
    //               review: $scope.userReview,
    //               reviewer: {
    //                 username: loggedInUser.username,
    //                 firstName: loggedInUser.firstName,
    //                 lastName: loggedInUser.lastName,
    //                 email: loggedInUser.email,
    //                 isBlocked: loggedInUser.isBlocked,
    //                 isSeller: loggedInUser.isSeller,
    //                 city: loggedInUser.city,
    //               },
    //               createdAt: new Date(),
      
    //           }

    //           if(review.userRating === ""){
    //             alert("please provide rating");
    //             return;
    //           }
    //           if(review.userReview === ''){
    //             alert("please provide a review");
    //             return;
    //           }

    //           console.log(review);



    //     IDB.addReview(review).then((res)=>{
    //         alert("review added successfully");
    //     }).catch((err)=>{
    //         console.log(err);
    //         alert("error adding the review");
    //     })
    // }

});