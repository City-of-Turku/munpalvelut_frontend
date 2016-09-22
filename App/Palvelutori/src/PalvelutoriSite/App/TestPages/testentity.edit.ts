
/// <reference path="../../typings/angularjs/angular-route.d.ts" />
/// <reference path="../../typings/businessforms/businessforms.d.ts" />

namespace Palvelutori {
    class EditTestEntityController {
        $onInit() {
        }
    }

    // Create components
    app.component("ptEditTestEntity", {
        bindings: {
            item: '<'
        },
        templateUrl: () => getUrl('/TestPage/EditTestEntity'),
        controller: EditTestEntityController
    });

    // Configure route
    app.config(function ($routeProvider: angular.route.IRouteProvider) {
        $routeProvider.when('/edit/testEntity/:id', {
            template: '<pt-edit-test-entity item="$resolve.kohde"><pt-edit-test-entity>',
            resolve: {
                kohde: function (bfDataService: BusinessForms.BFDataService, $location: ng.ILocationService, $route: angular.route.IRouteService) {
                    return bfDataService.get('testEntity', $route.current.params.id,
                        item => $location.url('/list/testEntity')
                    );
                }
            }
        });
    });
}