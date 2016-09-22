

namespace Palvelutori {
    class ShowFAQController {

    }

    // Create components
    app.component("ptShowForbidden", {
        templateUrl: () => getUrl('/Page/ShowForbidden'),
        controller: ShowFAQController
    });

    // Configure route
    app.config(function ($routeProvider: angular.route.IRouteProvider) {
        $routeProvider.when('/show/forbidden', {
            template: '<pt-show-forbidden><pt-show-forbidden>',
        });
    });
}