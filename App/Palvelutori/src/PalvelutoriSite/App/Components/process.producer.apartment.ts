namespace Palvelutori {
    class ProcessProducerApartmentController {
        static $inject = ["ptLogin"];
        constructor(private _loginService: LoginService) {
        }

        get isLoggedIn() {
            return this._loginService.isLoggedIn;
        }

        $onInit() {
        }
    }

    app.component("ptProcessProducerApartment", {
        transclude: true,
        bindings: {
            searchData: '='
        },
        templateUrl: () => getUrl('/Components/ProcessProducerApartment'),
        controller: ProcessProducerApartmentController
    });
}