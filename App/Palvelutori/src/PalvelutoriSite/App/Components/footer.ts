namespace Palvelutori {
    class FooterController {
        project_name: string;
        constructor() {
            this.project_name = "Test";
        }
    }
    app.component("ptFooter", {
        templateUrl: () => getUrl('/Components/Footer'),
        controller: FooterController 
    });
}