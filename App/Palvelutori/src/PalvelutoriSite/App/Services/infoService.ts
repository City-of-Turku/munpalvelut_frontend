namespace Palvelutori {
    export class InfoService {
        infos: string[];
        private pending: (() => string)[];

        static $inject = ["$rootScope", "$timeout"];

        constructor(
            private rootScope: ng.IRootScopeService,
            private timeout: ng.ITimeoutService) {

            var self = this;
            self.infos = [];
            self.pending = [];
            rootScope.$on("$routeChangeSuccess", () => {
                self.removeNotes();
                self.processPending();
            });
        }

        addNote(note: string) {
            var self = this;
            if (self.infos.indexOf(note) < 0) {
                self.infos.push(note);                
            }
        }

        addPendingNote(noteGen: () => string) {
            var self = this;
            self.pending.push(noteGen);
        }

        removeNotes() {
            var self = this;
            self.infos.splice(0, self.infos.length);
        }

        private processPending() {
            var self = this;
            for (var p of self.pending) {
                self.addNote(p());
            }
            self.pending = [];
        }

        private hideAfterMoment() {
            var self = this;
            self.timeout(() => {
                self.removeNotes();
                self.infos.splice(0, self.infos.length);
            }, 5000);
        }
    }

    app.service('ptInfoService', InfoService);
}
