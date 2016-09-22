

namespace Palvelutori {
    app.filter('ptTime', function () {
        return function (val: number) {
            var min = (val % 60).toString();
            if (min.length < 2) {
                min = "0" + min;
            }
            var h = val / 60;
            return h.toString() + ":" + min;
        }
    });
}