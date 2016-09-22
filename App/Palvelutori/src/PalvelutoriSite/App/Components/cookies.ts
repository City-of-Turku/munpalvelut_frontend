namespace Palvelutori {
    class CookiesController {
        public projectName: string = "Palvelutori";
        // private _cookiesAccepted: boolean;
        private _booted: boolean;

        static $inject = ["ptLoginData", "$rootScope"];
        constructor(public ptLoginData: LoginDataService, rootScope: ng.IRootScopeService) {
            var self = this;
            self._booted = false;
            setTimeout(() => {
                self._booted = true;
                rootScope.$apply();
            }, 1000);
        }

        get cookiesAccepted() {
            return this.ptLoginData.data.cookies || !this._booted;
        }


        accept() {
            // this.ptLoginData.data.cookies = true;
            this.ptLoginData.data.cookies = true;
        }

    }
    app.component("ptCookies", {
        transclude: true,
        templateUrl: () => getUrl('/Components/Cookies'),
        controller: CookiesController
    });
}