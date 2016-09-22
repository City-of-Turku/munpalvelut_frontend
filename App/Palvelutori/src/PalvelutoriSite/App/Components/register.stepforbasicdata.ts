namespace Palvelutori {

    class RegisterStep1Controller {
        static $inject = ["ptRegistration", "ptScrolling"];

        public newKayttaja: any;

        constructor(
            private ptRegistration: RegistrationService,
            private ptScrolling: ScrollingService) {

            var trid: string = ptRegistration.getStoredVetumaAuthenticationId();
            this.newKayttaja.setV("trid", trid);
        }

        /**
         * Moves to the next step in the registration process.
         */
        public nextStep() {
            this.ptRegistration.isRegistrationStep1Completed = true;
        }
    }

    app.component("ptRegisterStepForBasicData", {
        bindings: {
            newKayttaja: '<'
        },
        transclude: true,
        templateUrl: () => getUrl('/Components/RegisterStepForBasicData'),
        controller: RegisterStep1Controller
    });
}