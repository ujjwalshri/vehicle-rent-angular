angular.module("myApp").directive("base64Converter", function() {
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            element.on("change", function() {
                const reader = new FileReader();
                reader.onload = function(e) {
                    scope.$apply(function() {
                        scope[attrs.base64Converter] = e.target.result;
                    });
                };
                reader.readAsDataURL(element[0].files[0]);
            });
        }
    };
});