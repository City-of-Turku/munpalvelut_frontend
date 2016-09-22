namespace Palvelutori {
    class ShowForgotPassword3FailedController {
        static $inject = ["ptRegistration"];

        constructor(
            private ptRegistration: RegistrationService) {
        }
    }

    // Create components
    app.component("ptShowForgotPassword3Failed", {
        templateUrl: () => getUrl('/Page/ShowForgotPassword3Failed'),
        controller: ShowForgotPassword3FailedController
    });

    // Configure route
    app.config(function ($routeProvider: angular.route.IRouteProvider) {
        $routeProvider.when('/show/forgotpasswordfailed', {
            template: '<pt-show-forgot-password3-failed><pt-show-forgot-password3-failed>'
        });
    });
}