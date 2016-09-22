
/// <reference path="../../typings/angularjs/angular-route.d.ts" />
/// <reference path="../../typings/businessforms/businessforms.d.ts" />

namespace Palvelutori {
    class CreateTestEntityController {
        $onInit() {
        }
    }

    // Create components
    app.component("ptCreateTestEntity", {
        bindings: {
            item: '<'
        },
        templateUrl: () => getUrl('/TestPage/CreateTestEntity'),
        controller: CreateTestEntityController
    });

    // Configure route
    app.config(function ($routeProvider: angular.route.IRouteProvider) {
        $routeProvider.when('/create/testEntity', {
            template: '<pt-create-test-entity item="$resolve.kohde"><pt-create-test-entity>',
            resolve: {
                kohde: function (bfDataService: BusinessForms.BFDataService, $location: ng.ILocationService) {
                    return bfDataService.create('testEntity',
                        item => $location.url('/list/testEntity')
                    );
                }
            }
        });
    });
}