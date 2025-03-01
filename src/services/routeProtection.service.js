angular.module('myApp').service('RouteProtection', function($state, $rootScope) {
    this.isAuthorized = ()=>{
        return JSON.parse(sessionStorage.getItem("user") )? true : false;
    }
    this.isAdmin = () => {
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (!user) return false;
        return user.role === "admin";
    }
    this.isSeller = ()=>{
        return JSON.parse(sessionStorage.getItem("user") ).isSeller === true ? true : false;
    }
    this.isBuyer = ()=>{
        return JSON.parse(sessionStorage.getItem("user") ).isSeller === false ? true : false;
    }
});