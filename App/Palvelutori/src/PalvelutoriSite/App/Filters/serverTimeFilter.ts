namespace Palvelutori {
    app.filter('ptServerTime', function () {
        return function (val: string) {
            var dt = new Date(Date.parse(val));
            var min = dt.getUTCMinutes();
            if (min < 10) {
                return dt.getUTCHours() + ":0" + min;
            }
            return dt.getUTCHours() + ":" + min;
        }
    });
}