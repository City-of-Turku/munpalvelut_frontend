namespace Palvelutori {
    class HomeServicesController {
        static $inject = ["ptScrolling"];

        constructor(private ptScrolling: ScrollingService) {
        }

        public scrollTop() {
            var self = this;
            self.ptScrolling.scrollTo('pt-navbar');
        }
    }
    app.component("ptHomeServices", {
        transclude: true,
        templateUrl: () => getUrl('/Components/HomeServices'),
        controller: HomeServicesController
    });
}