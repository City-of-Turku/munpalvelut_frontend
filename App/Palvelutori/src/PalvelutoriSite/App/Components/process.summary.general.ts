namespace Palvelutori {
    class ProcessSummaryGeneralController {
        static $inject = ["$window"];

        constructor(private $window: ng.IWindowService) {
        }

        confirm() {
            alert('Toimintoa ei ole vielä toteutettu!');
        }

        public printPage() {
            this.$window.print();
        }
    }

    app.component("ptProcessSummaryGeneral", {
        bindings: {
            kayttaja: '<',
            kohde: '<',
            searchData: '<'
        },
        transclude: true,
        templateUrl: () => getUrl('/Components/ProcessSummaryGeneral'),
        controller: ProcessSummaryGeneralController
    });
}