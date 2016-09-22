using BusinessForms;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace PalvelutoriModel.PassthroughControllers
{
    public class ImageController: PassthroughBaseController
    {
        public ImageController(BFContext context): base("media/images/", context) {

        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetImage(string id, [FromQuery] string token) {
            HttpClient client = CreateClient();
            client.DefaultRequestHeaders.Add("Authorization", "token " + token);
            var result = await client.GetAsync(RootAPI + "media/images/" + id);
            return MapReplyBin(result);
        }
    }
}
