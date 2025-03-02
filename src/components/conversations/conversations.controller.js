angular.module('myApp').controller('conversationsCtrl', function($scope, $stateParams, IDB, $timeout) {
    $scope.myConversations = []; //  array to hold all the conversations of the user
    $scope.messages = []; // array to hold all the messages of a particular conversation
    $scope.selectedConversation = null; // object to hold the selected conversation
    const loggedInUser = JSON.parse(sessionStorage.getItem("user")); // getting the logged in user
     $scope.loggedUser = loggedInUser.username; // for handling the view logic 
    $scope.images = []; // array to hold the images
    $scope.inputMessage = ""; // input message

    // Fetch all conversations for the logged-in user
    // if stateParams.id is 0, fetch all conversations for the user because he is seeing all his chats on the chats section
    // if stateParams.id is not 0, fetch all conversations for the user where the car id is equal to the stateParams.id because he want to communicate at a particular car
    $scope.init = ()=>{
        if($stateParams.id == 0){ // if the stateParams.id is 0, fetch all conversations for the user
            IDB.getUserConversations(loggedInUser.username).then((conversations) => {
                $scope.myConversations = conversations;
                console.log($scope.myConversations);
            }).catch((err) => {
                console.log(err);
                alert(err);
            });
        } else { // else fetch all conversations for the user where the car id is equal to the stateParams.id
            IDB.getUserConversations(loggedInUser.username).then((conversations) => {
                $scope.myConversations = conversations.filter(conversation => conversation.car.id === $stateParams.id);
                console.log($scope.myConversations);
            });
        }
    }


    

    // Fetch messages for a selected conversation
    $scope.fetchMessages = (conversationId) => {
        IDB.getMessagesAtConversationID(conversationId).then((messages) => {
            console.log(conversationId);
            $scope.messages = messages; // set the messages to the messages fetched from the database
            console.log($scope.messages);
            $scope.selectedConversation = $scope.myConversations.find(conversation => conversation.id === conversationId); // set the selected conversation to the conversation with the conversationId
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

    // function to add a message into the database with a particular conversation id
   // function to add a message into the database with a particular conversation id
$scope.sendMessage = () => {
    $scope.images = $scope.images.map(image => image.base64)
    console.log($scope.images);
    const message = {
        message: $scope.inputMessage,
        sender: loggedInUser.username,
        receiver: $scope.selectedConversation.receiver,
        conversation: $scope.selectedConversation,
        createdAt: new Date()
    };
    if ($scope.images.length > 0) {
        message.images = $scope.images;
    } 

    IDB.addMessage(message).then((response) => {
        $scope.messages.push(message);
        $scope.inputMessage = "";
        $scope.images = []; // Reset images after sending the message
    }).catch((error) => {
        console.log("Error sending message", error);
        alert("There was an error sending the message. Please try again.");
    });
};
});