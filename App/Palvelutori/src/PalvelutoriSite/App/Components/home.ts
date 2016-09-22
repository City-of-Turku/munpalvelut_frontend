namespace Palvelutori {
    class HomeController {
        constructor() {
        }
    }
    app.component("ptHome", {
        transclude: true,
        templateUrl: () => getUrl('/Components/Home'),
        controller: HomeController
    });
}