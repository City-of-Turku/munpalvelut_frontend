
namespace Palvelutori {
    class ProcessProducerZackitController {
        static $inject = ["ptSearchData"];

        constructor(private _searchData: SearchDataService) {            
        }

        get yritys() {
            return this._searchData.data.yritys;
        }

        getZeckiUrl() {
            return "https://zeckit.com/selvitys/widget/badge/FI/" + this._searchData.data.yritys.businessid + ".png";
        }

        getZeckiPageUrl() {
            return "https://zeckit.com/selvitys/FI/" + this._searchData.data.yritys.businessid;
        }
    }

    app.component("ptProcessProducerZackit", {
        templateUrl: () => getUrl('/Components/ProcessProducerZackit'),
        controller: ProcessProducerZackitController
    });
}