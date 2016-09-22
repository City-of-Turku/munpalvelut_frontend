namespace Palvelutori {
    class InfoTextController {
        static $inject = ["ptInfoService"];
        constructor(public ptInfoService: InfoService) {
        }

    }
    app.component("ptInfoText", {
        transclude: true,
        template: `
    <div class="alert alert-info pt-banner pt-banner-info" ng-if="$ctrl.ptInfoService.infos.length > 0">
        <div class="pt-banner-text" ng-repeat="info in $ctrl.ptInfoService.infos">
            {{::info}}
        </div>
    </div>
`,
        controller: InfoTextController
    });
}