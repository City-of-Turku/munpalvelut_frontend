/// <reference path="../../typings/angularjs/angular.d.ts" />

module BusinessForms {
    class ShowErrorController {
        static $inject = ["bfErrorService"];
        errors: IErrorInfo[];
        constructor(public errorService: BFErrorService) {
            this.errors = errorService.errors;
        }
        $onInit() {
        }
    }

    // Create components
    app.component("bfShowError", {
        bindings: {
            item: '<'
        },
        templateUrl: '/Home/ShowError',
        controller: ShowErrorController
    });

    app.config(function ($routeProvider: angular.route.IRouteProvider) {
        $routeProvider.when('/show/error', {
            template: '<bf-show-error></bf-show-error>'
        });
    });
}