namespace Palvelutori {
    class ProcessPackagePackagesController {
        public packages: any;


        public showOnScreen(p: IPackage): boolean {
            if (p.shortname === 'sesonki') {
                return true;
            }
            return false;
        }

    }

    app.component("ptProcessPackagePackages", {
        bindings: {
            packages: '<',
            searchData: '='
        },
        transclude: true,
        templateUrl: () => getUrl('/Components/ProcessPackagePackages'),
        controller: ProcessPackagePackagesController
    });
}