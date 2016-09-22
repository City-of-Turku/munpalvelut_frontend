namespace Palvelutori {
    class ShowForgotPassword3SucceedController {
        static $inject = ["ptRegistration"];

        constructor(
            private ptRegistration: RegistrationService) {
        }
    }

    // Create components
    app.component("ptShowForgotPassword3Succeed", {
        templateUrl: () => getUrl('/Page/ShowForgotPassword3Succeed'),
        controller: ShowForgotPassword3SucceedController
    });

    // Configure route
    app.config(function ($routeProvider: angular.route.IRouteProvider) {
        $routeProvider.when('/show/forgotpasswordsucceed', {
            template: '<pt-show-forgot-password3-succeed><pt-show-forgot-password3-succeed>'
        });
    });
}