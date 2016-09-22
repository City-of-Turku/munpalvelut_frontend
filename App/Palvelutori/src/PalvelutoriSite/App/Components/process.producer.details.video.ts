namespace Palvelutori {
    class ProcessProducerDetailsVideoController {
        videourl: string;
        static $inject = ["$sce"];
        constructor(private _sce: ng.ISCEService) {
            // _sce.trustAsResourceUrl(this.videourl);
        }
    }

    app.component("ptProcessProducerDetailsVideo", {
        transclude: true,
        bindings: {
            videourl: '<'
        },
        templateUrl: () => getUrl('/Components/ProcessProducerDetailsVideo'),
        controller: ProcessProducerDetailsVideoController
    });

    app.config(function ($sceDelegateProvider: ng.ISCEDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            'https://www.youtube.com/**'
        ]);
    });
}