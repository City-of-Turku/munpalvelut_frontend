namespace Palvelutori {
    class AdminNavbarController {
        public projectName: string = "Palvelutori";
        static $inject = ["ptLogin"];
        constructor(public ptLogin: LoginService) {
        }

        logout() {
            this.ptLogin.logout();
            var homeUrl = window.location.protocol + "//" + window.location.hostname;
            if (window.location.port) {
                homeUrl += ":" + window.location.port;
            }
            window.location.href = homeUrl;
        }
    }
    app.component("ptAdminNavbar", {
        transclude: true,
        templateUrl: () => getUrl('/Admin/AdminNavBar'),
        controller: AdminNavbarController
    });
}