
/// <reference path="../../typings/angularjs/angular-route.d.ts" />
/// <reference path="../../typings/businessforms/businessforms.d.ts" />

namespace Palvelutori {
    class EditKayttajaController {
        $onInit() {
        }
    }

    // Create components
    app.component("ptEditKayttaja", {
        bindings: {
            kayttaja: '<'
        },
        templateUrl: () => getUrl('/Page/EditKayttaja'),
        controller: EditKayttajaController
    });

    // Configure route
    app.config(function ($routeProvider: angular.route.IRouteProvider) {
        $routeProvider.when('/edit/kayttaja/:id', {
            template: '<pt-edit-kayttaja kayttaja="$resolve.kayttaja"><pt-edit-kayttaja>',
            resolve: {
                kayttaja: function (bfDataService: BusinessForms.BFDataService, $location: ng.ILocationService, $route: angular.route.IRouteService, ptInfoService: InfoService) {
                    return bfDataService.get('kayttaja', $route.current.params.id,
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