
// this file contains the service that will be used to interact with the IndexedDB database.
angular.module('myApp').service("IDB", function ($q, hashPassword) {
  let db = null;
  let DB_NAME = "vehicalRental";
  let DB_VERSION = 6;
  function openDB() {
    let deferred = $q.defer();
    // If database is already open, return it immediately
    // to update the schema after the change
    // const txn = event.target.transaction;
    // const store = txn.objectStore('biddings')
    if (db) {
      deferred.resolve(db);
      return deferred.promise;
    }
    let request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = function (event) {
      console.log("db updated");
      db = event.target.result;
    
      if(!db.objectStoreNames.contains('messages')){
        const messagesObjectStore = db.createObjectStore("messages", {
          keyPath: "id", 
        })
        messagesObjectStore.createIndex('conversationIDIndex', 'conversation.id', {
          unique: false
        })
       
        messagesObjectStore.createIndex('senderIndex', 'sender.id', {
          unique :false
        })
        messagesObjectStore.createIndex('receiverIndex', 'receiver.id', {
          unique: false
        })
      }
      //Create or upgrade object stores
      if (!db.objectStoreNames.contains("users")) {
        const userObjectStore = db.createObjectStore("users", {
          keyPath: "username",
        });
        
        userObjectStore.createIndex("usernameIndex", "username", {
          unique: true,
        });
      
        userObjectStore.createIndex("cityIndex", "city", { unique: false });
      }
      if (!db.objectStoreNames.contains("vehicles")) {
        const vehiclesObjectStore = db.createObjectStore("vehicles", {
          keyPath: "id",
        });
        vehiclesObjectStore.createIndex("vehicleIDIndex", "id", {
          unique:true,
        })
        vehiclesObjectStore.createIndex("ownerIndex", "owner.username", {
          unique: false,
        });
        vehiclesObjectStore.createIndex("isApprovedIndex", "isApproved", {
          unique: false,
        });
      }
      if (!db.objectStoreNames.contains("vehicleReviews")) {
        const vehicleReviewsObjectStore = db.createObjectStore("carReviews", {
          keyPath: "id",
        });
        vehicleReviewsObjectStore.createIndex("idIndex", "id", { unique: true });
        vehicleReviewsObjectStore.createIndex("vehicleIndex", "car.id", {
          unique: false,
        });
        vehicleReviewsObjectStore.createIndex(
          "reviewerIndex",
          "reviewer.username",
          { unique: false }
        );
      }
       if(!db.objectStoreNames.contains("biddings")){
        const biddingsObjectStore = db.createObjectStore("biddings", {
          keyPath: "id",
        });
        biddingsObjectStore.createIndex("idIndex", "id", { unique: true });
        biddingsObjectStore.createIndex("vehicleIndex", "vehicle.id", {
          unique: false,
        });
        biddingsObjectStore.createIndex("bidderIndex", "bidder.username", {
          unique: false,
        });
        biddingsObjectStore.createIndex("ownerIndex", "owner.username", {
          unique: false,
        });
      
      } 
      if(!db.objectStoreNames.contains("conversations")){
        const conversationsObjectStore = db.createObjectStore("conversations", {
          keyPath: "id",
        });
        conversationsObjectStore.createIndex("idIndex", "id", { unique: true });
        conversationsObjectStore.createIndex("senderIndex", "sender.username", {
          unique: false,
        });
        conversationsObjectStore.createIndex("receiverIndex", "receiver.username", {
          unique: false,
        });
        conversationsObjectStore.createIndex('carIndex', 'car.id', {
          unique: false,
        });
      }
    };
    request.onsuccess = function (event) {
      db = event.target.result;
      if (db) {
        deferred.resolve(db);
      } else {
        deferred.reject("Database initialization failed");
      }
    };
    request.onerror = function (event) {
      deferred.reject("Error opening IndexedDB: " + event.target.errorCode);
    };
    return deferred.promise;
  }

  // function to register a user into the databse

  this.registerUser = function (user) {
    let deferred = $q.defer();
    openDB().then(function (db) {
      let transaction = db.transaction(["users"], "readonly");
      let objectStore = transaction.objectStore("users");
      console.log(user);
      let index = objectStore.index("usernameIndex");
      
      let request = index.get(user.username);
      request.onsuccess = function (event) {
        if (event.target.result) {
          deferred.reject("Username already exists");
        } else {
          let transaction = db.transaction(["users"], "readwrite");
          let objectStore = transaction.objectStore("users");
          user.confirmPassword = null;
          user.password = hashPassword(user.password);
          let addRequest = objectStore.add(user);
          addRequest.onsuccess = function (event) {
            deferred.resolve();
          };
          addRequest.onerror = function (event) {
            deferred.reject(
              "Error registering user: " + event.target.errorCode
            );
          };
        }
      };

      request.onerror = function (event) {
        deferred.reject("Error checking username: " + event.target.errorCode);
      };
    });
    return deferred.promise;
  };
  
  // function to check if a user exists in the database with the given username
  this.loginUser = function (username, password){
    let deferred = $q.defer();
    openDB().then(function (db) {
      let transaction = db.transaction(["users"], "readonly");
      let objectStore = transaction.objectStore("users");
      let index = objectStore.index("usernameIndex");
      let request = index.get(username);
      request.onsuccess = function (event) {
        if (event.target.result && event.target.result.isBlocked === false) {
          if (event.target.result.password === hashPassword(password)) {
            sessionStorage.setItem("user", JSON.stringify(event.target.result));
            deferred.resolve();
          } else {
            deferred.reject("Invalid password");
          }
        } else {
          deferred.reject("User not found");
        }
      };
      request.onerror = function (event) {
        deferred.reject("Error checking username: " + event.target.errorCode);
      };
    })
    return deferred.promise;
  }
  
  // function to get a user with a particular username
  this.getUser = function (username) {
    let deferred = $q.defer();
    
    // Check if username is valid
    if (!username) {
      deferred.reject("Invalid username provided");
      return deferred.promise;
    }
  
    openDB().then(function (db) {
        let transaction = db.transaction(["users"], "readonly");
        let objectStore = transaction.objectStore("users");
        
        // Use the existing index
        let index = objectStore.index("usernameIndex");
        let request = index.get(username);
      
        request.onsuccess = function (event) {
          deferred.resolve(request.result);
        };
        request.onerror = function (event) {
          deferred.reject("Error checking if user exists: " + event.target.errorCode);
        };
    });
    return deferred.promise;
  };
  // function to get all users 
  this.getAllUsers = function(){
    let deferred = $q.defer();
    openDB().then(function (db) {
      let transaction = db.transaction(["users"], "readonly");
      let objectStore = transaction.objectStore("users");
      let request = objectStore.getAll();
      request.onsuccess = function (event) {
        deferred.resolve(event.target.result);
      };
      request.onerror = function (event) {
        deferred.reject("Error getting users: " + event.target.errorCode);
      };
    });
    return deferred.promise;
  }
  // function to add car into the database
  this.addCar = function (car){
    let deferred = $q.defer();
    openDB().then(function (db) {
      let transaction = db.transaction(["vehicles"], "readwrite");
      let objectStore = transaction.objectStore("vehicles");
      car.id = crypto.randomUUID();
      let addRequest = objectStore.add(car);
      addRequest.onsuccess = function (event) {
        deferred.resolve();
      };
      addRequest.onerror = function (event) {
        deferred.reject("Error adding car: " + event.target.errorCode);
      };
    });
    return deferred.promise;
  }
  // function to get all the cars from the database that have status === pending
  this.getPendingCars = function(){
    let deferred = $q.defer();
    openDB().then(function (db) {
      let transaction = db.transaction(["vehicles"], "readonly");
      let objectStore = transaction.objectStore("vehicles");
      let index = objectStore.index("isApprovedIndex");
      let request = index.getAll("pending");
      request.onsuccess = function (event) {
        deferred.resolve(event.target.result);
      };
      request.onerror = function (event) {
        deferred.reject("Error getting pending cars: " + event.target.errorCode);
      };
    });
    return deferred.promise;
  }
  // function to get all the cars  from the database that are approved from the admin 
  this.getApprovedCars = function(){
    let deferred = $q.defer();
    openDB().then(function (db) {
      let transaction = db.transaction(["vehicles"], "readonly");
      let objectStore = transaction.objectStore("vehicles");
      let index = objectStore.index("isApprovedIndex");
      let request = index.getAll("approved");
      request.onsuccess = function (event) {
        deferred.resolve(event.target.result);
      };
      request.onerror = function (event) {
        deferred.reject("Error getting approved cars: " + event.target.errorCode);
      };
    });
    return deferred.promise;
  }
   // function to approve a car with a particular carID
  this.approveCar = (carID) => {
    let deferred = $q.defer();
    openDB().then(function (db) {
      let transaction = db.transaction(["vehicles"], "readwrite");
      let objectStore = transaction.objectStore("vehicles");
      let index = objectStore.index("vehicleIDIndex");
      let request = index.get(carID);
      request.onsuccess = function(event) {
        let car = event.target.result;
        if (car) {
          car.isApproved = "approved";
          let updateRequest = objectStore.put(car);
          updateRequest.onsuccess = function(event) {
            deferred.resolve();
          };
          updateRequest.onerror = function(event) {
            deferred.reject("Error approving car: " + event.target.errorCode);
          };
        } else {
          deferred.reject("Car not found");
        }
      };
      request.onerror = function(event) {
        deferred.reject("Error retrieving car: " + event.target.errorCode);
      };
    }).catch(function(error) {
      deferred.reject("Error opening database: " + error);
    });
    return deferred.promise;
  };
  // function of admin to reject a car with a particular carID
  this.rejectCar = (carID)=>{
    let deferred = $q.defer();
    openDB().then(function (db) {
      let transaction = db.transaction(["vehicles"], "readwrite");
      let objectStore = transaction.objectStore("vehicles");
      let index = objectStore.index("vehicleIDIndex");
      let request = index.get(carID);
      request.onsuccess = function(event) {
        let car = event.target.result;
        if (car) {
          car.isApproved = "rejected";
          let updateRequest = objectStore.put(car);
          updateRequest.onsuccess = function(event) {
            deferred.resolve();
          };
          updateRequest.onerror = function(event) {
            deferred.reject("Error approving car: " + event.target.errorCode);
          };
        } else {
          deferred.reject("Car not found");
        }
      };
      request.onerror = function(event) {
        deferred.reject("Error retrieving car: " + event.target.errorCode);
      };
    }).catch(function(error) {
      deferred.reject("Error opening database: " + error);
    });
    return deferred.promise;
  }
  // function to get call with a particular carID
  this.getCarByID = (ID) => {
    let deferred = $q.defer();
    openDB().then(function (db) {
      let transaction = db.transaction(["vehicles"], "readonly");
      let objectStore = transaction.objectStore("vehicles");
      let index = objectStore.index("vehicleIDIndex");
      let request = index.get(ID);
      request.onsuccess = function(event) {
        deferred.resolve(event.target.result);
      };
      request.onerror = function(event) {
        deferred.reject("Error retrieving car: " + event.target.errorCode);
      };
    }).catch(function(error) {
      deferred.reject("Error opening database: " + error);
    });
    return deferred.promise;
  }
  // to all cars by a particular user 
  this.getAllCarsByUser = (username)=>{
    let deferred = $q.defer();
    openDB().then(function (db) {
      let transaction = db.transaction(["vehicles"], "readonly");
      let objectStore = transaction.objectStore("vehicles");
      let index = objectStore.index("ownerIndex");
      let request = index.getAll(username);
      request.onsuccess = function(event) {
        deferred.resolve(event.target.result);
      };
      request.onerror = function(event) {
        deferred.reject("Error retrieving cars: " + event.target.errorCode);
      };
    }).catch(function(error) {
      deferred.reject("Error opening database: " + error);
    });
    return deferred.promise;
  }


  // function for deleting a particular car from the platform
  this.deleteCar = (carID) => {
    let deferred = $q.defer();
    openDB().then(function (db) {
      let transaction = db.transaction(["vehicles"], "readwrite");
      let objectStore = transaction.objectStore("vehicles");
      let index = objectStore.index("vehicleIDIndex");
      let request = index.get(carID);
      request.onsuccess = function(event) {
        let car = event.target.result;
        if (car) {
          car.deleted = true;
          let updateRequest = objectStore.put(car);
          updateRequest.onsuccess = function(event) {
            deferred.resolve();
          };
          updateRequest.onerror = function(event) {
            deferred.reject("Error deleting car: " + event.target.errorCode);
          };
        } else {
          deferred.reject("Car not found");
        }
      };
      request.onerror = function(event) {
        deferred.reject("Error retrieving car: " + event.target.errorCode);
      };
    }).catch(function(error) {
      deferred.reject("Error opening database: " + error);
    });
    return deferred.promise;
 
  };
  // making a user with a username seller 
  this.makeUserSeller = (username) => {
    let deferred = $q.defer();
    openDB().then(function (db) {
      let transaction = db.transaction(["users"], "readwrite");
      let objectStore = transaction.objectStore("users");
      let index = objectStore.index("usernameIndex");
      let request = index.get(username);
      request.onsuccess = function(event) {
        let user = event.target.result;
        if (user) {
          user.isSeller = true;
          let updateRequest = objectStore.put(user);
          updateRequest.onsuccess = function(event) {
             sessionStorage.setItem("user", JSON.stringify(user));
            deferred.resolve();
          };
          updateRequest.onerror = function(event) {
            deferred.reject("Error updating user: " + event.target.errorCode);
          };
        } else {
          deferred.reject("User not found");
        }
      };
      request.onerror = function(event) {
        deferred.reject("Error retrieving user: " + event.target.errorCode);
      };
    }).catch(function(error) {
      deferred.reject("Error opening database: " + error);
    });
    return deferred.promise;
  };


  // bidding and booking controllers 
  this.addBid = (bid) => {
    let deferred = $q.defer();

    // Ensure the bid object is defined and has an id property
    if (!bid) {
        deferred.reject("Bid object is undefined");
        return deferred.promise;
    }

    if (!bid.id) {
        bid.id = crypto.randomUUID(); // Generate a unique id if not present
    }

    openDB().then(function (db) {
        let transaction = db.transaction(["biddings"], "readwrite");
        let objectStore = transaction.objectStore("biddings");
        bid.id = crypto.randomUUID();
        let addRequest = objectStore.add(bid);
        addRequest.onsuccess = function(event) {
            deferred.resolve();
        };
        addRequest.onerror = function(event) {
            deferred.reject("Error adding bid: " + event.target.error.message);
        };
    }).catch(function(error) {
        deferred.reject("Error opening database: " + error.message);
    });

    return deferred.promise;
};

// getting the bookings requests for the particular owner by getting the biddings which have bidding.to.username === username passed as parameter
this.getBookingsByOwnerId = (username) => {
  let deferred = $q.defer();
  openDB().then(function (db) {
    let transaction = db.transaction(["biddings"], "readonly");
    let objectStore = transaction.objectStore("biddings");
    let index = objectStore.index("ownerIndex");
    let request = index.getAll(username);
    
    request.onsuccess = function (event) {
      deferred.resolve(event.target.result);
    };
    
    request.onerror = function (event) {
      deferred.reject("Error getting owner bids: " + event.target.errorCode);
    };
  });
  return deferred.promise;
};

// function to get the booking and updating its status
this.updateBookingStatus = (bookingID, status) => {
  let deferred = $q.defer();
  openDB().then(function (db) {
    let transaction = db.transaction(["biddings"], "readwrite");
    let objectStore = transaction.objectStore("biddings");
    let index = objectStore.index("idIndex");
    let request = index.get(bookingID);
    request.onsuccess = function(event) {
      let booking = event.target.result;
      if (booking) {
        booking.status = status;
        let updateRequest = objectStore.put(booking);
        updateRequest.onsuccess = function(event) {
          deferred.resolve();
        };
        updateRequest.onerror = function(event) {
          deferred.reject("Error updating booking: " + event.target.errorCode);
        };
      } else {
        deferred.reject("Booking not found");
      }
    };
    request.onerror = function(event) {
      deferred.reject("Error retrieving booking: " + event.target.errorCode);
    };
  }).catch(function(error) {
    deferred.reject("Error opening database: " + error);
  });
  return deferred.promise;
};
// function to get all the bookings by a particular carID
this.getBookingsByCarID = (carID)=>{
  let deferred = $q.defer();
  openDB().then(function (db) {
    let transaction = db.transaction(["biddings"], "readonly");
    let objectStore = transaction.objectStore("biddings");
    let index = objectStore.index("vehicleIndex");
    console.log(carID);
    let request = index.getAll(carID);
    request.onsuccess = function(event) {
      deferred.resolve(event.target.result);
    };
    request.onerror = function(event) {
      deferred.reject("Error retrieving bookings: " + event.target.errorCode);
    };
  }).catch(function(error) {
    deferred.reject("Error opening database: " + error);
  });
  return deferred.promise;
}
// function to get all the bookings from the database
this.getAllBookings = ()=>{
  let deferred = $q.defer();
  openDB().then(function (db) {
    let transaction = db.transaction(["biddings"], "readonly");
    let objectStore = transaction.objectStore("biddings");
    let request = objectStore.getAll();
    request.onsuccess = function(event) {
      deferred.resolve(event.target.result);
    };
    request.onerror = function(event) {
      deferred.reject("Error getting bookings: " + event.target.errorCode);
    };
  });
  return deferred.promise;
}


// function to getBookings at particular booking id
this.getBookingByID = (bookingID)=>{
  let deferred = $q.defer();
  openDB().then(function (db) {
    let transaction = db.transaction(["biddings"], "readonly");
    let objectStore = transaction.objectStore("biddings");
    let index = objectStore.index("idIndex");
    let request = index.get(bookingID);
    request.onsuccess = function(event) {
      deferred.resolve(event.target.result);
    };
    request.onerror = function(event) {
      deferred.reject("Error getting booking: " + event.target.errorCode);
    };
  });
  return deferred.promise;
}
// function to get bookings by bookingID 
this.getBookingsByCarId = (carID)=>{
  let deferred = $q.defer();
  openDB().then(function (db) {
    let transaction = db.transaction(["biddings"], "readonly");
    let objectStore = transaction.objectStore("biddings");
    let index = objectStore.index("vehicleIndex");
    let request = index.getAll(carID);
    request.onsuccess = function(event) {
      deferred.resolve(event.target.result);
    };
    request.onerror = function(event) {
      deferred.reject("Error getting bookings: " + event.target.errorCode);
    };
  });
  return deferred.promise;
  
}
// function to update booking at a bookingID and add started == true and add startOdometerValue
this.updateBookingAndAddStartOdometerValue = (bookingID, startOdometerValue)=>{
  let deferred = $q.defer();
  openDB().then(function (db) {
    let transaction = db.transaction(["biddings"], "readwrite");
    let objectStore = transaction.objectStore("biddings");
    let index = objectStore.index("idIndex");
    let request = index.get(bookingID);
    request.onsuccess = function(event) {
      let booking = event.target.result;
      if (booking) {
        booking.started = true;
        booking.startOdometerValue = startOdometerValue;
        let updateRequest = objectStore.put(booking);
        updateRequest.onsuccess = function(event) {
          deferred.resolve();
        };
        updateRequest.onerror = function(event) {
          deferred.reject("Error updating booking: " + event.target.errorCode);
        };
      } else {
        deferred.reject("Booking not found");
      }
    };
    request.onerror = function(event) {
      deferred.reject("Error retrieving booking: " + event.target.errorCode);
    };
  }).catch(function(error) {
    deferred.reject("Error opening database: " + error);
  });
  return deferred.promise;

}

// function to update booking at a bookingID and add ended == true and add endOdometerValue
this.updateBookingAndAddEndOdometerValue = (bookingID, endOdometerValue) =>{
  let deferred = $q.defer();
  openDB().then(function (db) {
    let transaction = db.transaction(["biddings"], "readwrite");
    let objectStore = transaction.objectStore("biddings");
    let index = objectStore.index("idIndex");
    let request = index.get(bookingID);
    request.onsuccess = function(event) {
      let booking = event.target.result;
      if (booking) {
        booking.ended = true;
        booking.endOdometerValue = endOdometerValue;
        let updateRequest = objectStore.put(booking);
        updateRequest.onsuccess = function(event) {
          deferred.resolve();
        };
        updateRequest.onerror = function(event) {
          deferred.reject("Error updating booking: " + event.target.errorCode);
        };
      } else {
        deferred.reject("Booking not found");
      }
    };
    request.onerror = function(event) {
      deferred.reject("Error retrieving booking: " + event.target.errorCode);
    };
  }).catch(function(error) {
    deferred.reject("Error opening database: " + error);
  });
  return deferred.promise;
}

// function to add a review to the database
this.addReview = (review)=>{
  let deferred = $q.defer();
  openDB().then(function (db) {
    let transaction = db.transaction(["carReviews"], "readwrite");
    let objectStore = transaction.objectStore("carReviews");
    let addRequest = objectStore.add(review);
    addRequest.onsuccess = function(event) {
      deferred.resolve();
    };
    addRequest.onerror = function(event) {
      deferred.reject("Error adding review: " + event.target.errorCode);
    };
  }).catch(function(error) {
    deferred.reject("Error opening database: " + error);
  });
  return deferred.promise;
}



// getting all reviews of a particular car by car id
 this.getReviewsByCarID = (carID) => {
  let deferred = $q.defer();
  openDB().then(function (db) {
    let transaction = db.transaction(["carReviews"], "readonly");
    let objectStore = transaction.objectStore("carReviews");
    let index = objectStore.index("vehicleIndex");
    let request = index.getAll(carID);
    request.onsuccess = function(event) {
      deferred.resolve(event.target.result);
    };
    request.onerror = function(event) {
      deferred.reject("Error getting reviews: " + event.target.errorCode);
    };
  });
  return deferred.promise;
 }

  this.getAllReviews = ()=>{
    let deferred = $q.defer();
    openDB().then(function (db) {
      let transaction = db.transaction(["carReviews"], "readonly");
      let objectStore = transaction.objectStore("carReviews");
      let request = objectStore.getAll();
      request.onsuccess = function(event) {
        deferred.resolve(event.target.result);
      };
      request.onerror = function(event) {
        deferred.reject("Error getting reviews: " + event.target.errorCode);
      };
    });
    return deferred.promise;
  }

 // block the user at a particular userID
 this.blockUserByUsername = (username)=>{
  let deferred = $q.defer();
  openDB().then(function (db) {
    let transaction = db.transaction(["users"], "readwrite");
    let objectStore = transaction.objectStore("users");
    let index = objectStore.index("usernameIndex");
    let request = index.get(username);
    request.onsuccess = function(event) {
      let user = event.target.result;
      if (user) {
        user.isBlocked = true;
        let updateRequest = objectStore.put(user);
        updateRequest.onsuccess = function(event) {
          deferred.resolve();
        };
        updateRequest.onerror = function(event) {
          deferred.reject("Error blocking user: " + event.target.errorCode);
        };
      } else {
        deferred.reject("User not found");
      }
    };
    request.onerror = function(event) {
      deferred.reject("Error retrieving user: " + event.target.errorCode);
    };
  }).catch(function(error) {
    deferred.reject("Error opening database: " + error);
  });
  return deferred.promise;
 }
 

 // ----->>> conversations  <<<<---------

 // function to add a conversation to the database
 this.addConversation = (conversation)=>{
  conversation.id = crypto.randomUUID();
  let deferred = $q.defer();
  openDB().then(function (db) {
    let transaction = db.transaction(["conversations"], "readwrite");
    let objectStore = transaction.objectStore("conversations");
    let addRequest = objectStore.add(conversation);
    console.log(conversation);
    addRequest.onsuccess = function(event) {
      deferred.resolve(event.target.result);
    };
    addRequest.onerror = function(event) {
      deferred.reject("Error adding conversation: " + event.target.errorCode);
    };
  }).catch(function(error) {
    deferred.reject("Error opening database: " + error);
  });
  return deferred.promise;
 }

 // function to get all the conversations of a particular user which means fetching all the conversations where the either the sender or the receiver is the user
 this.getUserConversations  = (username)=>{
    let deferred = $q.defer();

    openDB().then(function (db) {
      let transaction = db.transaction(["conversations"], "readonly");
      let objectStore = transaction.objectStore("conversations");
      let index = objectStore.index("senderIndex");
      let request = index.getAll(username);
      request.onsuccess = function(event) {
        let conversations = event.target.result;
        let receiverIndex = objectStore.index("receiverIndex");
        let request2 = receiverIndex.getAll(username);
        request2.onsuccess = function(event) {
          conversations = conversations.concat(event.target.result);
          deferred.resolve(conversations);
        };
        request2.onerror = function(event) {
          deferred.reject("Error getting conversations: " + event.target.errorCode);
        };
      };
      request.onerror = function(event) {
        deferred.reject("Error getting conversations: " + event.target.errorCode);
      };
    });
    return deferred.promise;
  }


  /// add a message to the database 
  this.addMessage = (message)=>{
    message.id = crypto.randomUUID();
    let deferred = $q.defer();
    openDB().then(function (db) {
      let transaction = db.transaction(["messages"], "readwrite");
      let objectStore = transaction.objectStore("messages");
      let addRequest = objectStore.add(message);
      addRequest.onsuccess = function(event) {
        deferred.resolve(event.target.result);
      };
      addRequest.onerror = function(event) {
        deferred.reject("Error adding message: " + event.target.errorCode);
      };
    }).catch(function(error) {
      deferred.reject("Error opening database: " + error);
    });

    return deferred.promise;
  }
   // get messages of a particular conversation
  this.getMessagesAtConversationID = ( conversationID)=>{
    let deferred = $q.defer();
    openDB().then(function (db) {
      let transaction = db.transaction(["messages"], "readonly");
      let objectStore = transaction.objectStore("messages");
      let index = objectStore.index("conversationIDIndex");
      let request = index.getAll(conversationID);
      request.onsuccess = function(event) {
        deferred.resolve(event.target.result);
      };
      request.onerror = function(event) {
        deferred.reject("Error getting messages: " + event.target.errorCode);
      };
    });
    return deferred.promise;
  }
});
