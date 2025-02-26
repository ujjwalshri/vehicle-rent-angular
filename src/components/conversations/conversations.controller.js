angular.module('myApp').controller('conversationsCtrl', function($scope, $stateParams, IDB, $rootScope) {
        $scope.myConversations = [];
        $scope.carID = $stateParams.id;
        IDB.getUserConversations().then((conversations)=>{
            $scope.myConversations = conversations.filter(conversation => conversation.car.id === $scope.carID);
            console.log($scope.myConversations);
        }).catch((err)=>{
            console.log(err);
            alert(err);
        });
}
);