
/// <reference path="../../typings/angularjs/angular-route.d.ts" />
/// <reference path="../../typings/businessforms/businessforms.d.ts" />

namespace Palvelutori {
    export interface IKayttaja {
        id: string,
        email: string;
        company: string;
    }

    class WelcomeShowController {
        static $inject = ["ptLogin", "ptLoginData", "$location", "ptSearchData"];

        kayttaja: {
            values: IKayttaja;
        }

        constructor(
            private _loginService: LoginService,
            private _loginData: LoginDataService,
            private _location: ng.ILocationService,
            private searchData: SearchDataService) {
        }

        $onInit() {
            var self = this;
            self._loginService.login(self._loginService.token, self.kayttaja.values.email, self.kayttaja.values.id, self.kayttaja.values.company);
            self.searchData.switchDataFromLocalStorageToSessionStorage();
        }

        jatka() {
            var self = this;
            var path: string;
            if (self.searchData.currentProcessStep === 0) {
                path = '/show/perustiedot';
            } else {
                path = self._loginData.data.vetumaReturn || '';
            }
            self._location.path(path);
        }
    }

    // Create components
    app.component("ptShowWelcome", {
        bindings: {
            kayttaja: '<'
        },
        templateUrl: () => getUrl('/Page/ShowWelcome'),
        controller: WelcomeShowController
    });

    // Configure route
    app.config(function ($routeProvider: angular.route.IRouteProvider) {
        $routeProvider.when('/show/welcome', {
            template: '<pt-show-welcome kayttaja="$resolve.kayttaja"></pt-show-welcome>',
            resolve: {
                kayttaja: function (bfDataService: BusinessForms.BFDataService, ptLogin: LoginService) {
                    return bfDataService.get('kayttaja', 'me');
                }
            }
        });
    });

}
