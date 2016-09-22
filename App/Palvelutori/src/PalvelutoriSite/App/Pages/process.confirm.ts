namespace Palvelutori {
    class ProcessConfirmController {

        public kohde: {
            values: IKohde;
        }


        public kayttaja: {
            values: IKayttaja;
        }

        get kohdeTallennettu(): boolean {
            if (this.kohde) {
                return true;
            } else {
                return false;
            }
        }

        static $inject = ["ptSearchData", "ptScrolling"];

        constructor(
            public searchData: SearchDataService,
            private scrolling: ScrollingService) {

            var self = this;

            searchData.setCurrentProcessStep(3);

            if (self.kohde) {
                var yritys = self.searchData.data.yritys;
                searchData.data.kohde = self.kohde.values;
                searchData.data.hinta = searchData.calcPrice(null);
                searchData.data.kesto = searchData.calcDuration(yritys);
                searchData.data.hinta2 = searchData.data.kesto * searchData.getPricePerHour(yritys);
            }
            self.searchData.data.me = self.kayttaja.values;
        }
    }

    // Create components
    app.component("ptProcessConfirm", {
        bindings: {
            kayttaja: '<',
            kohde: '<'
        },
        templateUrl: () => getUrl('/Page/ProcessConfirm'),
        controller: ProcessConfirmController
    });

    // Configure route
    app.config(($routeProvider: angular.route.IRouteProvider) => {
        $routeProvider.when('/process/confirm', {
            template: '<pt-process-confirm kayttaja="$resolve.kayttaja" kohde="$resolve.kohde"></pt-process-confirm>',
            resolve: {
                kohde: function (bfDataService: BusinessForms.BFDataService, ptSearchData: SearchDataService) {
                    if (!ptSearchData.data.paketti) {
                        return null;
                    }
                    return bfDataService.query<IKohde>('kohteet').then(arr => {
                        if (arr.length > 0) {
                            return bfDataService.get('kohde', arr[0].id);
                        }
                        return null;
                    });
                },
                kayttaja: function (bfDataService: BusinessForms.BFDataService, ptLogin: LoginService, ptSearchData: SearchDataService) {
                    if (!ptSearchData.data.paketti) {
                        return null;
                    }
                    return bfDataService.get('kayttaja', ptLogin.userId);
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