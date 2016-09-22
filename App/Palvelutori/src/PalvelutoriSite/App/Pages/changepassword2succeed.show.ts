namespace Palvelutori {
    class ShowChangePassword2SucceedController {
        static $inject = ["ptRegistration", "ptLogin"];

        constructor(
            private ptRegistration: RegistrationService,
            private ptLogin: LoginService) {

        }
    }

    // Create components
    app.component("ptShowChangePassword2Succeed", {
        templateUrl: () => getUrl('/Page/ShowChangePassword2Succeed'),
        controller: ShowChangePassword2SucceedController
    });

    // Configure route
    app.config(function ($routeProvider: angular.route.IRouteProvider) {
        $routeProvider.when('/show/changepasswordsucceed', {
            template: '<pt-show-change-password2-succeed><pt-show-change-password2-succeed>'
        });
    });
}