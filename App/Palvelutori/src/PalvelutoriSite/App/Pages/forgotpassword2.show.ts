namespace Palvelutori {
    class ShowForgotPassword2Controller {
        static $inject = ["ptRegistration"];

        public resetPassword: any;

        constructor(
            private ptRegistration: RegistrationService) {

            var trid: string = ptRegistration.getStoredVetumaAuthenticationId();
            this.resetPassword.setV("trid", trid);
        }
    }

    // Create components
    app.component("ptShowForgotPassword2", {
        bindings: {
            resetPassword: '<'
        },
        templateUrl: () => getUrl('/Page/ShowForgotPassword2'),
        controller: ShowForgotPassword2Controller
    });

    // Configure route
    app.config(function ($routeProvider: angular.route.IRouteProvider) {
        $routeProvider.when('/show/forgotpassword2', {
            template: '<pt-show-forgot-password2 reset-password="$resolve.reset"><pt-show-forgot-password2>',
            resolve: {
                reset: function (bfDataService: BusinessForms.BFDataService, $location: ng.ILocationService, ptLogin: LoginService, ptRegistration: RegistrationService) {
                    return bfDataService.create('ResetPassword', (reply, data) => {
                        if (data.succeed) {
                            $location.path('/show/forgotpasswordsucceed');
                        } else {
                            $location.path('/show/forgotpasswordfailed');
                        }
                    });
                }
            }

        });
    });
}