namespace Palvelutori {
    class HomeServicesServiceController {
        /**
         * 1 = Siivouspalvelut        
         * 99 = Tulossa olevat palvelut
         */
        public id: number;

        constructor() {
        }

        /**
         * Checks if the current service is available for user selection.
         */
        public isServiceAvailable(): boolean {
            switch (this.id) {
                case 1:
                    return true;
                case 99:
                    return false;
                default:
                    throw Error('The service id is not supported.');
            }
        }
    }

    app.component("ptHomeServicesService", {
        bindings: {
            id: '<'
        },
        transclude: true,
        templateUrl: () => getUrl('/Components/HomeServicesService'),
        controller: HomeServicesServiceController
    });
}