namespace Palvelutori {
    export interface IResourceCalendarRequest {
        year: number;
        month: number;
        companyId: string;
    }

    export interface IResourceCalendar {
        year: number;
        month: number;        
        monthName: string;
        days: IResourceCalendarDay[];
    }

    export interface IResourceCalendarDay {
        day: string;
        weekday: string;
        isWeekend: boolean;
        resources: IResourceCalendarResource[];
    }

    export interface IResourceCalendarResource {
        id: number;
        name: string;
        timeslots: IResourceCalendarDayTimeslot[];


        previouslyClickedTimeslot: IResourceCalendarDayTimeslot;
    }

    export interface IResourceCalendarDayTimeslot {
        minutes: number;
        text: string;
        isEven: boolean;
        isSelected: boolean;
        css: string;
    }

    export class AdminService {

        static $inject = ["$http", "$q", "ptLogin"];

        constructor(
            private $http: ng.IHttpService,
            private $q: ng.IQService,
            private _loginService: LoginService
        ) {

        }

        public getCalendar(): ng.IPromise<IResourceCalendar> {
            return this.getCalendarForMonth(
                new Date().getFullYear(),
                new Date().getMonth() + 1);
        }

        public getCalendarForMonth(year: number, month: number): ng.IPromise<IResourceCalendar> {
            var vm = this;

            var deferred: ng.IDeferred<any> = vm.$q.defer();

            var request: IResourceCalendarRequest = { year: year, month: month, companyId: this._loginService.companyId };

            vm.$http.post<IResourceCalendar>("/api/AdminResourceCalender/GetResourceCalendar", JSON.stringify(request), {
                headers: {
                    'Content-Type': "application/json",
                    "Authorization": "token " + this._loginService.token
                },
                params: {
                    _t: Date.now()
                }
            })
                .success((data: IResourceCalendar) => {
                    deferred.resolve(data);
                }).error((data, status) => {
                    debugger;
                });
            return deferred.promise;
        }

        public saveCalendar(calendar: IResourceCalendar): ng.IPromise<IResourceCalendar> {
            var vm = this;

            var deferred: ng.IDeferred<any> = vm.$q.defer();

            vm.$http.post<IResourceCalendar>("/api/AdminResourceCalender/SaveResourceCalendar", JSON.stringify(calendar), { headers: { 'Content-Type': "application/json", "Authorization": "token " + this._loginService.token } })
                .success((data: IResourceCalendar) => {
                    deferred.resolve(data);
                }).error((data, status) => {
                    debugger;
                });
            return deferred.promise;
        }

    }

    app.service('ptAdmin', AdminService);
}