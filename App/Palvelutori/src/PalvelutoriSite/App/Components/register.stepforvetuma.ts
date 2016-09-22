namespace Palvelutori {
    class RegisterStep2Controller {
        static $inject = ["ptRegistration", "$location", "ptScrolling", "ptSearchData"];

        constructor(
            private ptRegistration: RegistrationService,
            private $location: ng.ILocationService,
            private ptScrolling: ScrollingService,
            private searchData: SearchDataService) {
        }

        /**
         * Moves to the next step in the registration process.
         */
        public nextStep() {
            var self = this;
            this.ptRegistration.getVetumaAuthenticationIdForNewUser(function (vetumaId) {
                self.searchData.switchDataFromSessionStorageToLocalStorage();
                self.ptRegistration.storeVetumaAuthenticationId(vetumaId);
                self.ptRegistration.redirectoToVetumaRoutePage(vetumaId);
            });
        }
    }

    app.component("ptRegisterStepForVetuma", {
        transclude: true,
        bindings: {
            kayttaja: '<'
        },
        templateUrl: () => getUrl('/Components/RegisterStepForVetuma'),
        controller: RegisterStep2Controller
    });
}