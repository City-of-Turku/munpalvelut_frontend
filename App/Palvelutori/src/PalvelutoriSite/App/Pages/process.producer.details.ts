namespace Palvelutori {
    class ProcessProducerDetailsController {
        static $inject = ["ptSearchData", "ptScrolling"];

        constructor(
            public searchData: SearchDataService,
            private scrolling: ScrollingService) {

            searchData.setCurrentProcessStep(2, 1);
        }
    }

    // Create components
    app.component("ptProcessProducerDetails", {
        templateUrl: () => getUrl('/Page/ProcessProducerDetails'),
        controller: ProcessProducerDetailsController
    });

    // Configure route
    app.config(($routeProvider: angular.route.IRouteProvider) => {
        $routeProvider.when('/process/producerdetails', {
            template: '<pt-process-producer-details></pt-process-producer-details>',
            resolve: {
                wrongPhase: function (ptSearchData: SearchDataService, $location: ng.ILocationService) {
                    if (!ptSearchData.data.paketti || !ptSearchData.data.yritys) {
                        $location.path('');
                    }
                }
            }
        });
    });
}