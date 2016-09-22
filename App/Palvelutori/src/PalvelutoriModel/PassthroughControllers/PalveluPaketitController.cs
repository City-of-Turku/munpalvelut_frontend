using BusinessForms;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace PalvelutoriModel.PassthroughControllers
{
    public class PalveluPaketitController: PassthroughBaseController
    {
        public PalveluPaketitController(BFContext context) : base("services/", context)
        {
        }


        [HttpGet("all")]
        public async Task<IActionResult> GetPaketit() {
            HttpClient client = CreateClient();
            var result = await client.GetAsync(FullApi);
            return MapReply(result);
        }

        [HttpGet("{id}")]
        public Task<IActionResult> GetPaketti(string id) {
            return GetRequest(id);
        }
    }
}
