/// <reference path="../../typings/angularjs/angular-route.d.ts" />
/// <reference path="../../typings/businessforms/businessforms.d.ts" />

namespace Palvelutori {
    class ListTestEntityController {
        $onInit() {
        }
    }
    // Create components
    app.component("ptListTestEntities", {
        bindings: {
            items: '<'
        },
        templateUrl: ()=> getUrl('/TestPage/ListTestEntity'),
        controller: ListTestEntityController
    });

    // Configure route
    app.config(function ($routeProvider: angular.route.IRouteProvider) {
        $routeProvider.when('/list/testEntity', {
            template: '<pt-list-test-entities items="$resolve.testEntities"></pt-list-test-entities>',
            resolve: {
                testEntities: function (bfDataService: BusinessForms.BFDataService, $location: ng.ILocationService) {
                    return bfDataService.query('testEntities');
                }
            }
        });
    });
}