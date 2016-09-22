namespace Palvelutori {
    class ProcessPackageGeneralController {
        constructor() {
        }
    }
    app.component("ptProcessPackageGeneral", {
        transclude: true,
        templateUrl: () => getUrl('/Components/ProcessPackageGeneral'),
        controller: ProcessPackageGeneralController
    });
}