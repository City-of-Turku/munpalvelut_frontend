using BusinessForms;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace PalvelutoriModel.PassthroughControllers
{
    public class KohteetController: PassthroughBaseController
    {
        public KohteetController(BFContext context):base("user-sites/", context)
        {

        }


        [HttpGet()]
        public async Task<IActionResult> GetMyKohteet() {
            HttpClient client = CreateClient();
            var result = await client.GetAsync(FullApi);
            return MapReply(result);
        }
    }
}
