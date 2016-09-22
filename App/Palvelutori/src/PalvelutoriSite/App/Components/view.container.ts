namespace Palvelutori {
    class ViewContainerController {
    }
    app.component("ptViewContainer", {
        template:
        `
        <div id="view-container" class="pt-view-container">
            <ng-view class="pt-view" autoscroll="true"></ng-view>
        </div>
        `,
        controller: ViewContainerController
    });
}


