namespace Palvelutori {
    class ShowChangePassword2FailedController {
        static $inject = ["ptRegistration", "ptLogin"];

        constructor(
            private ptRegistration: RegistrationService,
            private ptLogin: LoginService) {

        }
    }

    // Create components
    app.component("ptShowChangePassword2Failed", {
        templateUrl: () => getUrl('/Page/ShowChangePassword2Failed'),
        controller: ShowChangePassword2FailedController
    });

    // Configure route
    app.config(function ($routeProvider: angular.route.IRouteProvider) {
        $routeProvider.when('/show/changepasswordfailed', {
            template: '<pt-show-change-password2-failed><pt-show-change-password2-failed>'
        });
    });
}