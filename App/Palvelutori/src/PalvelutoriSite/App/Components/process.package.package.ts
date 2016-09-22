namespace Palvelutori {

    export interface IPackage {
        id: number;
        title: {
            fi: string;
            sv: string;
        }
        description: {
            fi: string;
            sv: string;
        }
        pricing_formula: string;
        shortname: string;
        website: string;
    }

    class ProcessPackagePackageController {
        public package: IPackage;
        public searchData: SearchDataService;

        static $inject = ["$location"];

        constructor(private _locationService: ng.ILocationService) {
        }

        public selectThis() {
            this.searchData.data.paketti = this.package;
            this._locationService.path("/process/producer");
        }

        public get parsedDesc() {
            var desc: string = this.package.description[Palvelutori.languagePrefix];
            if (desc) {
                return desc.split('\n');
            }
            return [];
        }

        public get imageUrl() {
            var url: string = `images/cleaning-image-${this.package.shortname}.png`;
            return url;
        }

    }

    app.component("ptProcessPackagePackage", {
        bindings: {
            package: '<',
            searchData: '='
        },
        transclude: true,
        templateUrl: () => getUrl('/Components/ProcessPackagePackage'),
        controller: ProcessPackagePackageController
    });
}