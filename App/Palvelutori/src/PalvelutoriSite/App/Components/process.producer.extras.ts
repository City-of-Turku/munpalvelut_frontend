namespace Palvelutori {

    export interface IExtraService {
        id: string;
        name: string;
    }

    class ProcessProducerExtrasController {
        public extraServices: IExtraService[] = [];

        constructor() {
            this.extraServices.push({ id: "1", name: "Ikkunoiden pesu" });
            this.extraServices.push({ id: "2", name: "Uunin pesu" });
            this.extraServices.push({ id: "3", name: "Jääkaapin pesu" });
            this.extraServices.push({ id: "4", name: "Pyykinpesu" });
            this.extraServices.push({ id: "5", name: "Saunan pesu" });
            this.extraServices.push({ id: "6", name: "Sisäseinien pesu" });
        }
    }

    app.component("ptProcessProducerExtras", {
        transclude: true,
        templateUrl: () => getUrl('/Components/ProcessProducerExtras'),
        controller: ProcessProducerExtrasController
    });
}