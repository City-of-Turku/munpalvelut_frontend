/// <reference path="../../typings/angularjs/angular-route.d.ts" />
/// <reference path="../../typings/businessforms/businessforms.d.ts" />

namespace Palvelutori {
    export interface IKohde {
        id: string;
        room_count: number;
        sanitary_count: number;
        floor_count: number;
        floor_area: number;
        address_street: string;
        address_street2: string;
        address_postalcode: string;
        address_city: string;
    }


    class ShowPerustiedotController {
        /**
         * Back button url will be calculated based on the current process step.
         */
        public backUrl: string;

        public kohde: IKohde;

        static $inject = ["ptSearchData"];

        constructor(
            public searchData: SearchDataService) {

            switch (searchData.currentProcessStep) {
                case 1:
                    this.backUrl = '#/process/package';
                    break;
                case 2:
                    this.backUrl = '#/process/producer';
                    break;
                case 3:
                    this.backUrl = '#/process/confirm';
                    break;
                case 4:
                    this.backUrl = '#/process/summary';
                    break;
                default:
                    this.backUrl = '#';
                    break;
            }
        }
    }

    // Create components
    app.component("ptShowPerustiedot", {
        bindings: {
            kohde: '<',
            kayttaja: '<',
            tilaukset: '<'
        },
        templateUrl: () => getUrl('/Page/ShowPerustiedot'),
        controller: ShowPerustiedotController
    });

    // Configure route
    app.config(function ($routeProvider: angular.route.IRouteProvider) {
        $routeProvider.when('/show/perustiedot', {
            template: '<pt-show-perustiedot kohde="$resolve.kohde" kayttaja="$resolve.kayttaja" tilaukset="$resolve.tilaukset"></pt-show-perustiedot>',
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
                },
                tilaukset: function (bfDataService: BusinessForms.BFDataService, ptLogin: LoginService) {
                    return bfDataService.query('kayttajaTilaus/' + ptLogin.userId);
                }
            }
        });
    });

}