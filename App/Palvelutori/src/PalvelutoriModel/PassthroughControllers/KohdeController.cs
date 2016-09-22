using BusinessForms;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PalvelutoriModel.PassthroughControllers
{

    public class KohdeController : PassthroughCRUDController {
        public KohdeController(BFContext context) : base("user-sites/", context) {

        }

        protected override Task<JObject> PerformCreate(string parentId) {
            return Task.FromResult(
                JObject.Parse("{ \"address_street\": \"\", \"address_street2\": \"\", \"address_postalcode\": \"\", \"address_city\": \"\"," + 
                " \"address_country\": \"FIN\", \"room_count\": 2, \"sanitary_count\": 1, \"floor_count\": 1, \"floor_area\": \"75\", \"user\": 0}")
                );
        }

    }
}
