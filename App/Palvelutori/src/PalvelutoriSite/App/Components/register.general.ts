namespace Palvelutori {
    class RegisterGeneralController {
        static $inject = ["ptRegistration"];

        constructor(private ptRegistration: RegistrationService) {
            ptRegistration.isRegistrationStarted = true;
        }
    }

    app.component("ptRegisterGeneral", {
        transclude: true,
        templateUrl: () => getUrl('/Components/RegisterGeneral'),
        controller: RegisterGeneralController
    });
}