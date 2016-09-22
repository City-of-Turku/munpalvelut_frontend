namespace Palvelutori {
    class ShowRegisterController {
        static $inject = ["ptLoginData", "ptLogin", "ptScrolling"];

        constructor(
            private _loginData: LoginDataService,
            private _login: LoginService,
            private scrolling: ScrollingService) {

            _loginData.data.vetumaReturn = _login.pendingReturn;
        }

        $onInit() {
        }
    }

    // Create components
    app.component("ptShowRegister", {
        bindings: {
            newKayttaja: '<'
        },
        templateUrl: () => getUrl('/Page/ShowRegister'),
        controller: ShowRegisterController
    });

    // Configure route
    app.config(function ($routeProvider: angular.route.IRouteProvider) {
        $routeProvider.when('/show/register', {
            template: '<pt-show-register><pt-show-register>'
        });
    });
}