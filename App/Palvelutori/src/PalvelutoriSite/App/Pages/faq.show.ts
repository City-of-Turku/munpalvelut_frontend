/// <reference path="../../typings/angularjs/angular-route.d.ts" />

namespace Palvelutori {
    class ShowFAQController {
        static $inject = ["ptScrolling"];

        constructor(
            private scrolling: ScrollingService) {
        }
    }

    // Create components
    app.component("ptShowFaq", {
        templateUrl: () => getUrl('/Page/ShowFaq'),
        controller: ShowFAQController
    });

    // Configure route
    app.config(function ($routeProvider: angular.route.IRouteProvider) {
        $routeProvider.when('/show/faq', {
            template: '<pt-show-faq><pt-show-faq>'
        });
    });
}