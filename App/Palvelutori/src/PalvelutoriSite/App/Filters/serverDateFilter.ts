namespace Palvelutori {
    app.filter('ptServerDate', function () {
        return function (val: string) {
            var dt = new Date(Date.parse(val));
            return dt.getUTCDate() + "." + (dt.getUTCMonth() + 1) + "." + dt.getUTCFullYear();
        }
    });
}