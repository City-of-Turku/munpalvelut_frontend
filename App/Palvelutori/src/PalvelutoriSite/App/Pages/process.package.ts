namespace Palvelutori {
    class ProcessPackageController {
        public packages: any;

        static $inject = ["ptSearchData", "ptScrolling"];

        constructor(
            public searchData: SearchDataService,
            private scrolling: ScrollingService) {

            searchData.setCurrentProcessStep(1);

            if (!searchData.data) {
                searchData.initNew();               
            }
        }
    }

    // Create components
    app.component("ptProcessPackage", {
        bindings: {
            packages: '<'
        },
        templateUrl: () => getUrl('/Page/ProcessPackage'),
        controller: ProcessPackageController
    });

    // Configure route
    app.config(($routeProvider: angular.route.IRouteProvider) => {
        $routeProvider.when('/process/package', {
            template: '<pt-process-package packages="$resolve.packages"></pt-process-package>',
            resolve: {
                packages: function (bfDataService: BusinessForms.BFDataService) {
                    return bfDataService.query('palveluPaketit/all');
                }
            }
        });
    });
}