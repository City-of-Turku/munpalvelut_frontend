using BusinessForms;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using PalvelutoriModel.Search;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace PalvelutoriModel.PassthroughControllers
{
    public class KayttajaTilausController: PassthroughBaseController
    {
        public KayttajaTilausController(BFContext context):base("users/id/orders/", context) {

        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAll(string id) {
            SetApi("users/" + id + "/orders/");
            HttpClient client = CreateClient();
            var result = await client.GetAsync(FullApi);
            return MapReply(result);
        }

        [HttpGet("fetch/{id}")]
        public Task<IActionResult> Fetch(string id, [FromQuery] string userId) {
            SetApi("users/" + userId + "/orders/");
            return GetRequest(id);
        }

        [HttpPost("create/{id}")]
        public Task<IActionResult> Create(string id, [FromBody] TilausData searchData) {
            SetApi("users/" + id + "/orders/");
            dynamic jcompany = new JObject();
            jcompany.user_first_name = searchData.Me.FirstName;
            jcompany.user_last_name = searchData.Me.LastName;
            jcompany.user_email = searchData.Me.Email;
            jcompany.user_phone = String.IsNullOrEmpty(searchData.Me.Phone) ? "-" : searchData.Me.Phone;
            jcompany.site_address_street = searchData.Kohde.AddressStreet1;
            jcompany.site_address_street2 = searchData.Kohde.AddressStreet2;
            jcompany.site_address_postalcode = searchData.Kohde.AddressPostalcode;
            jcompany.site_address_city = searchData.Kohde.AddressCity;
            jcompany.site_room_count = searchData.Kohde.RoomCount;
            jcompany.site_sanitary_count = searchData.Kohde.SanitaryCount;
            jcompany.site_floor_count = searchData.Kohde.FloorCount;
            jcompany.site_floor_area = searchData.Kohde.FloorArea;
            jcompany.duration = searchData.Kesto;
            jcompany.price = Math.Round(searchData.Hinta2, 2);
            jcompany.timeslot_start = ToUTC(searchData.Paiva, searchData.Aika.From);
            jcompany.timeslot_end = ToUTC(searchData.Paiva, searchData.Aika.To);
            jcompany.extra_info = searchData.Lisatiedot ?? " ";
            jcompany.company = searchData.Yritys.ID;
            jcompany.service_package = searchData.Paketti.ID;
            jcompany.service_package_shortname = searchData.Paketti.ShortName;
            return PostRequest(jcompany);
            /*
                "user_first_name": "Test",
                "user_last_name": "User",
                "user_email": "test@example.com",
                "user_phone": "+12345678",

                "site_address_street": "Ääkköskatu 3",
                "site_address_street2": "",
                "site_address_postalcode": "12345",
                "site_address_city": "Helsinki",
                "site_room_count": 4,
                "site_sanitary_count": 1,
                "site_floor_count": 1,
                "site_floor_area": 80.4,

                "duration": 3,
                "price": 400,
                "timeslot_start": "2016-10-10T07:00:00Z",
                "timeslot_end": "2016-10-10T11:00:00Z",
                "extra_info": "",

                "company": ${COMPANY_ID},
                "service_package": ${SERVICE_PACKAGE_ID},
                "service_package_shortname": "palvelu-paketti"

            */
        }

        [HttpPost("addRating/{id}")]
        public Task<IActionResult> AddRating(string id, [FromQuery] string userId, [FromBody] JObject rating) {
            SetApi("users/" + userId + "/rate-order/");
            return PutRequest(id, rating);
        }

        public static string ToUTC(string paiva, int from) {
            var dt = SearchController.ToDate(paiva);
            return SearchController.ToUTC(dt.Value, from);
        }
    }
}
