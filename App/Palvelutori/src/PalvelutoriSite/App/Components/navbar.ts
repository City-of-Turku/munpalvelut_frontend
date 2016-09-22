namespace Palvelutori {
    class NavbarController {
        public projectName: string = "Palvelutori";

        constructor() {
        }

    }
    app.component("ptNavbar", {
        transclude: true,
        templateUrl: () => getUrl('/Components/NavBar'),
        controller: NavbarController
    });
}