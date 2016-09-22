namespace Palvelutori {
    class ProcessProducerController {
        static $inject = ["ptSearchData", "ptScrolling"];

        public kohde: {
            values: IKohde;
        }

        public searchOk: boolean;

        constructor(
            public searchData: SearchDataService,
            private scrolling: ScrollingService) {

            var self = this;

            var autoScrollToSearchResults: boolean = false;
            if (searchData.currentProcessStep > 2) {
                autoScrollToSearchResults = true;
            }
            else if (searchData.currentProcessStep === 2 && searchData.currentProcessSubStep > 0) {
                autoScrollToSearchResults = true;
            }

            if (autoScrollToSearchResults) {
                setTimeout(() => {
                    self.scrolling.scrollTo('search-results');
                }, 500);
            }

            searchData.setCurrentProcessStep(2);

            self.searchOk = true;

            if (self.kohde != null) {
                searchData.data.kohde = angular.copy(self.kohde.values);
            } else {
                if (!searchData.data.kohde) {
                    searchData.data.kohde = {
                        id: null,
                        room_count: 2,
                        sanitary_count: 1,
                        floor_count: 1,
                        floor_area: 75,
                        address_street: null,
                        address_street2: null,
                        address_postalcode: null,
                        address_city: null
                    };
                }
            }
        }

        public get canSearch() {
            if (!this.searchData.data.paiva) {
                return false;
            }
            if (!this.searchData.data.aika) {
                return false;
            }
            return true;
        }
    }

    // Create components
    app.component("ptProcessProducer", {
        templateUrl: () => getUrl('/Page/ProcessProducer'),
        bindings: {
            kohde: '<'
        },
        controller: ProcessProducerController
    });

    // Configure route
    app.config(($routeProvider: angular.route.IRouteProvider) => {
        $routeProvider.when('/process/producer', {
            template: '<pt-process-producer kohde="$resolve.kohde"></pt-process-producer>',
            resolve: {
                kohde: function (bfDataService: BusinessForms.BFDataService, ptLogin: LoginService) {
                    if (!ptLogin.isLoggedIn)
                        return null;
                    return bfDataService.query<IKohde>('kohteet').then(arr => {
                        if (arr.length > 0) {
                            return bfDataService.get('kohde', arr[0].id);
                        }
                        return null;
                    });
                },
                wrongPhase: function (ptSearchData: SearchDataService, $location: ng.ILocationService) {
                    if (!ptSearchData.data.paketti) {
                        $location.path('');
                    }
                }

            }
        });
    });
}