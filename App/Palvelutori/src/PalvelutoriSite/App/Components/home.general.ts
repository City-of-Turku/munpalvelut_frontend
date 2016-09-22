namespace Palvelutori {
    class HomeGeneralController {
        constructor() {
        }
    }
    app.component("ptHomeGeneral", {
        transclude: true,
        templateUrl: () => getUrl('/Components/HomeGeneral'),
        controller: HomeGeneralController
    });
}