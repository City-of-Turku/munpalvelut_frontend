namespace Palvelutori {
    class ShowChangePasswordController {
        static $inject = ["ptRegistration", "ptLogin"];

        public changePassword: any;

        constructor(
            private ptRegistration: RegistrationService,
            private ptLogin: LoginService) {

            var self = this;
            self.changePassword.setV('userId', ptLogin.userId);
        }
    }

    // Create components
    app.component("ptShowChangePassword", {
        bindings: {
            changePassword: '<'
        },
        templateUrl: () => getUrl('/Page/ShowChangePassword'),
        controller: ShowChangePasswordController
    });

    // Configure route
    app.config(function ($routeProvider: angular.route.IRouteProvider) {
        $routeProvider.when('/show/changepassword', {
            template: '<pt-show-change-password change-password="$resolve.change"><pt-show-change-password>',
            resolve: {
                change: function (bfDataService: BusinessForms.BFDataService, $location: ng.ILocationService, ptLogin: LoginService, ptRegistration: RegistrationService) {
                    return bfDataService.create('ChangePassword', (reply, data) => {
                        if (data.succeed) {
                            $location.path('/show/changepasswordsucceed');
                        } else {
                            $location.path('/show/changepasswordfailed');
                        }
                    });
                }
            }
        });
    });
}