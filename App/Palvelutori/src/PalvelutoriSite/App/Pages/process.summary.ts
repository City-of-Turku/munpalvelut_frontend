namespace Palvelutori {
    class ProcessSummaryController {
        static $inject = ["ptSearchData", "ptScrolling"];

        kohde: {
            values: IKohde;
        }

        constructor(
            public searchData: SearchDataService,
            private scrolling: ScrollingService) {

            var self = this;

            searchData.setCurrentProcessStep(4);

            if (self.kohde) {
                searchData.data.kohde = self.kohde.values;
            }
            searchData.data.hinta = searchData.calcPrice(null);
        }
    }

    // Create components
    app.component("ptProcessSummary", {
        bindings: {
            kayttaja: '<',
            kohde: '<'
        },
        templateUrl: () => getUrl('/Page/ProcessSummary'),
        controller: ProcessSummaryController
    });

    // Configure route
    app.config(($routeProvider: angular.route.IRouteProvider) => {
        $routeProvider.when('/process/summary', {
            template: '<pt-process-summary kayttaja="$resolve.kayttaja" kohde="$resolve.kohde"></pt-process-summary>',
            resolve: {
                kohde: function (bfDataService: BusinessForms.BFDataService) {
                    return bfDataService.query<IKohde>('kohteet').then(arr => {
                        if (arr.length > 0) {
                            return bfDataService.get('kohde', arr[0].id);
                        }
                        return null;
                    });
                },
                kayttaja: function (bfDataService: BusinessForms.BFDataService, ptLogin: LoginService) {
                    return bfDataService.get('kayttaja', ptLogin.userId);
                }
            }
        });
    });
}