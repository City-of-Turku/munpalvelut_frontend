namespace Palvelutori {
    class NavbarController {
        
        static $inject = ["ptLogin"];

        constructor(public ptLogin: LoginService) {
        }

        public logout() {
            this.ptLogin.logout();
        }
    }

    app.component("ptNavbarUser", {
        transclude: true,
        templateUrl: getUrl('/Components/NavBarUser'),
        controller: NavbarController
    });
}