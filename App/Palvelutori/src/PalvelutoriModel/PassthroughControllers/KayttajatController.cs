using BusinessForms;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace PalvelutoriModel.PassthroughControllers
{
    public class KayttajatController: PassthroughBaseController
    {
        public KayttajatController(BFContext context) : base("users/", context)
        {
        }

        [HttpGet()]
        public async Task<IActionResult> GetMe()
        {
            HttpClient client = CreateClient();
            var result = await client.GetAsync(FullApi);
            return MapReply(result);
        }
    }
}
