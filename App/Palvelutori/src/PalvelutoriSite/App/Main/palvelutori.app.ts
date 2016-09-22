/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-route.d.ts" />
/// <reference path="../../typings/businessforms/businessforms.d.ts" />
/// <reference path="../../typings/moment/moment.d.ts" />

namespace Palvelutori {
    export var app = angular.module('palvelutori', ['ngRoute', 'ngAnimate', 'businessForms', 'ngTouch', 'ngFader']);

    export class MainCtrl {
        constructor() {
        }
    }

    export var languagePrefix: string;
    export var isAdminHome: boolean;

    export function getUrl(url: string) {
        var lang = languagePrefix;
        var s = `/${lang}${url}`;
        return s;
    }

    BusinessForms.BFDataService.onValidationFailed.push(item => {
        window.scrollTo(0,0);
    });
    app.controller('mainCtrl', MainCtrl);
    app.config(function ($routeProvider: angular.route.IRouteProvider) {
        $routeProvider.otherwise({
            template: function () {
                return isAdminHome ? '<pt-admin-home yritys="$resolve.yritys"></pt-admin-home>' : '<pt-home></pt-home>'; 
            },
            resolve: {
                yritys: function (bfDataService: BusinessForms.BFDataService, $location: ng.ILocationService, ptLogin: LoginService) {
                    if (isAdminHome) {
                        return bfDataService.get('yritys', 'me');
                    }
                    return null;
                }
            }
        });
    });
}