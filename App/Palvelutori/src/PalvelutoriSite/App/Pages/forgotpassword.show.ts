namespace Palvelutori {
    class ShowForgotPasswordController {
        static $inject = ["ptRegistration"];

        constructor(
            private ptRegistration: RegistrationService) {
        }

        $onInit() {
        }

        public nextStep() {
            var self = this;
            this.ptRegistration.getVetumaAuthenticationIdForPasswordRecovery(function (vetumaId) {
                self.ptRegistration.storeVetumaAuthenticationId(vetumaId);
                self.ptRegistration.redirectoToVetumaRoutePage(vetumaId);
            });            
        }

    }

    // Create components
    app.component("ptShowForgotPassword", {
        templateUrl: () => getUrl('/Page/ShowForgotPassword'),
        controller: ShowForgotPasswordController
    });

    // Configure route
    app.config(function ($routeProvider: angular.route.IRouteProvider) {
        $routeProvider.when('/show/forgotpassword', {
            template: '<pt-show-forgot-password><pt-show-forgot-password>'
        });
    });
}