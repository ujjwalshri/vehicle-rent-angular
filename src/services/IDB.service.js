// this file contains the service that will be used to interact with the IndexedDB database.
angular.module('myApp').service("IDB", function ($q, hashPassword) {
  let db = null;
  let DB_NAME = "vehicalRental";
  let DB_VERSION = 2;
  function openDB() {
    let deferred = $q.defer();

    // If database is already open, return it immediately
    if (db) {
      deferred.resolve(db);
      return deferred.promise;
    }

    let request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = function (event) {
      db = event.target.result;
      // Create or upgrade object stores
      if (!db.objectStoreNames.contains("users")) {
        const userObjectStore = db.createObjectStore("users", {
          keyPath: "username",
        });
        
        userObjectStore.createIndex("firstNameIndex", "firstName", {
          unique: false,
        });
        userObjectStore.createIndex("lastNameIndex", "lastName", {
          unique: false,
        });
        userObjectStore.createIndex("usernameIndex", "username", {
          unique: true,
        });
        userObjectStore.createIndex("emailIndex", "email", {
          unique: true,
        });
        userObjectStore.createIndex("isSellerIndex", "isSeller", {
          unique: false,
        });
        userObjectStore.createIndex("cityIndex", "city", { unique: false });
        userObjectStore.createIndex("isBlockedIndex", "isBlocked", {
          unique: false,
        });
        userObjectStore.createIndex("adhaarIndex", "adhaar", { unique: true });
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
        vehiclesObjectStore.createIndex("typeIndex", "type", { unique: false });
        vehiclesObjectStore.createIndex("nameIndex", "name", { unique: false });
        vehiclesObjectStore.createIndex("modelIndex", "model", {
          unique: false,
        });
        vehiclesObjectStore.createIndex("categoryIndex", "category", {
          unique: false,
        });
        vehiclesObjectStore.createIndex("locationIndex", "location", {
          unique: false,
        });
        vehiclesObjectStore.createIndex("priceIndex", "price", {
          unique: false,
        });
        vehiclesObjectStore.createIndex("createdAtIndex", "createdAt", {
          unique: false,
        });
        vehiclesObjectStore.createIndex("isApprovedIndex", "isApproved", {
          unique: false,
        });
        vehiclesObjectStore.createIndex("deletedIndex", "deleted", {
          unique: false,
        });
        vehiclesObjectStore.createIndex("mileageIndex", "mileage", {
          unique: false,
        });
      }
      if (!db.objectStoreNames.contains("vehicleReviews")) {
        const vehicleReviewsObjectStore = db.createObjectStore("carReviews", {
          keyPath: "id",
        });
        vehicleReviewsObjectStore.createIndex("vehicleIndex", "vehicle.id", {
          unique: false,
        });
        vehicleReviewsObjectStore.createIndex(
          "reviewerIndex",
          "reviewer.username",
          { unique: false }
        );
        vehicleReviewsObjectStore.createIndex("ratingIndex", "rating", {
          unique: false,
        });
        vehicleReviewsObjectStore.createIndex("reviewIndex", "review", {
          unique: false,
        });
        vehicleReviewsObjectStore.createIndex("createdAtIndex", "createdAt", {
          unique: false,
        });
      }
      if (!db.objectStoreNames.contains("biddings")) {
        const biddingsObjectStore = db.createObjectStore("biddings", {
          keyPath: "id",
        });
        biddingsObjectStore.createIndex("vehicleIndex", "vehicle.id", {
          unique: false,
        });
        biddingsObjectStore.createIndex("bidderIndex", "bidder.username", {
          unique: false,
        });
        biddingsObjectStore.createIndex("amountIndex", "amount", {
          unique: false,
        });
        biddingsObjectStore.createIndex("createdAtIndex", "createdAt", {
          unique: false,
        });
        biddingsObjectStore.createIndex("ownerIndex", "owner.username", {
          unique: false,
        });
      }
      if(!db.objectStoreNames.contains("converations")){
        const converationsObjectStore = db.createObjectStore("converations", {
          keyPath: "id",
        });
        converationsObjectStore.createIndex("senderIndex", "sender.username", {
          unique: false,
        });
        converationsObjectStore.createIndex("receiverIndex", "receiver.username", {
          unique: false,
        });
        converationsObjectStore.createIndex('carIndex', 'car.id', {
          unique: false,
        });
        converationsObjectStore.createIndex("createdAtIndex", "createdAt", {
          unique: false,
        });
      }
    };
   

    request.onsuccess = function (event) {
      db = event.target.result;
      deferred.resolve(db);
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
        if (event.target.result) {
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
    });
    return deferred.promise;
      
  }
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
  this.addCar = function (car){
    let deferred = $q.defer();
    openDB().then(function (db) {
      let transaction = db.transaction(["vehicles"], "readwrite");
      let objectStore = transaction.objectStore("vehicles");
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
});
