
/// <reference path="../../typings/angularjs/angular-route.d.ts" />
/// <reference path="../../typings/businessforms/businessforms.d.ts" />

namespace Palvelutori {
    class CreateKohdeController {
        $onInit() {
        }
    }

    // Create components
    app.component("ptEditKohde", {
        bindings: {
            item: '<'
        },
        templateUrl: () => getUrl('/Page/EditKohde'),
        controller: CreateKohdeController
    });

    // Configure route
    app.config(function ($routeProvider: angular.route.IRouteProvider) {
        $routeProvider.when('/edit/kohde/:id', {
            template: '<pt-edit-kohde item="$resolve.kohde"><pt-edit-kohde>',
            resolve: {
                kohde: function (bfDataService: BusinessForms.BFDataService, $location: ng.ILocationService,
                    $route: angular.route.IRouteService, ptInfoService: InfoService) {
                    return bfDataService.get('kohde', $route.current.params.id,
                        item => {
                            $location.url('/show/perustiedot');
                            ptInfoService.addPendingNote(() => "Tiedot tallennettu!");
                        }
                    );
                }
            }
        });
    });
}