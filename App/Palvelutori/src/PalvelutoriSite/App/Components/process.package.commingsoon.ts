namespace Palvelutori {


    class ProcessPackageCommingSoonController {

        constructor() {
        }

        public get imageUrl() {
            var url: string = `images/cleaning-image-extra.png`;
            return url;
        }

    }

    app.component("ptProcessPackageCommingSoon", {
        //bindings: {
        //    package: '<',
        //    searchData: '='
        //},
        transclude: true,
        templateUrl: () => getUrl('/Components/ProcessPackageCommingSoon'),
        controller: ProcessPackageCommingSoonController
    });
}