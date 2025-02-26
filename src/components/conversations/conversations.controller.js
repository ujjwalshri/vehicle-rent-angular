angular.module('myApp').controller('conversationsCtrl', function($scope, $stateParams, IDB, $rootScope) {
    $scope.myConversations = [];
    $scope.messages = [];
    $scope.selectedConversation = null;
    const loggedInUser = JSON.parse(sessionStorage.getItem("user"));

    // Fetch all conversations for the logged-in user
    IDB.getUserConversations(loggedInUser.username).then((conversations) => {
        $scope.myConversations = conversations;
    }).catch((err) => {
        console.log(err);
        alert(err);
    });

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

    // Send a new message
    $scope.inputMessage = "";
    $scope.sendMessage = () => {
        if ($scope.inputMessage.trim() === "") return;

        const message = {
            message: $scope.inputMessage,
            sender: loggedInUser.username,
            reciever: $scope.selectedConversation.receiver,
            conversation: $scope.selectedConversation,
            createdAt: new Date()
        };

        IDB.addMessage(message).then((response) => {
            $scope.messages.push(response);
            $scope.inputMessage = "";
        }).catch((error) => {
            console.log("Error sending message", error);
            alert("There was an error sending the message. Please try again.");
        });
    };
});