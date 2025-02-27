angular.module('myApp').controller('conversationsCtrl', function($scope, $stateParams, IDB, $rootScope, $timeout,) {
    $scope.myConversations = [];
    $scope.messages = [];
    $scope.selectedConversation = null;
    const loggedInUser = JSON.parse(sessionStorage.getItem("user"));
    $scope.loggedUser = loggedInUser.username;
    $scope.images = [];

    // Fetch all conversations for the logged-in user
    // if stateParams.id is 0, fetch all conversations for the user because he is seeing all his chats on the chats section
    // if stateParams.id is not 0, fetch all conversations for the user where the car id is equal to the stateParams.id because he want to communicate at a particular car
    if($stateParams.id == 0){
        IDB.getUserConversations(loggedInUser.username).then((conversations) => {
            $scope.myConversations = conversations;
            console.log($scope.myConversations);
        }).catch((err) => {
            console.log(err);
            alert(err);
        });
    } else {
        IDB.getUserConversations(loggedInUser.username).then((conversations) => {
            $scope.myConversations = conversations.filter(conversation => conversation.car.id === $stateParams.id);
            console.log($scope.myConversations);
        });
    }

    // Fetch messages for a selected conversation
    $scope.fetchMessages = (conversationId) => {
        IDB.getMessagesAtConversationID(conversationId).then((messages) => {
            console.log(conversationId);
            $scope.messages = messages;
            console.log($scope.messages);
            $scope.selectedConversation = $scope.myConversations.find(conversation => conversation.id === conversationId);
        }).catch((err) => {
            console.log(err);
            alert(err);
        });
    };

    // Function to handle image preview and Base64 conversion
    $scope.previewImages = function (input) {
        if (input.files) {
          let files = Array.from(input.files); // Convert FileList to an array
          let totalFiles = files.length;
          let processedFiles = 0;
      
          files.forEach((file) => {
            let reader = new FileReader();// making new instance of FileReader
            reader.readAsDataURL(file); // read the file as data url which means converting it basically into the base64 format
            
            reader.onload = function (e) {  // onload event is triggered when the file is read
           
              $scope.images.push({ file: file, base64: e.target.result }); // pushing the file and the base64 data into the images array
              processedFiles++;
          
              console.log("Image added:", file.name);
              
              if (processedFiles === totalFiles) { // if all the files are processed then log the images array
                console.log("All images processed:", $scope.images);
              }
              $timeout(); // timeout is used to update the view
            };
          });
        }
      };

    // Send a new message
    $scope.inputMessage = "";
    $scope.sendMessage = () => {
        $scope.images = $scope.images.map(image => image.base64);
        console.log($scope.images);
        const message = {
            message: $scope.inputMessage,
            sender: loggedInUser.username,
            images: $scope.images,
            receiver: $scope.selectedConversation.receiver,
            conversation: $scope.selectedConversation,
            createdAt: new Date()
        };

        IDB.addMessage(message).then((response) => {
            
            $scope.fetchMessages($scope.selectedConversation.id);            
            $scope.inputMessage = "";
        }).catch((error) => {
            console.log("Error sending message", error);
            alert("There was an error sending the message. Please try again.");
        });
    };
});