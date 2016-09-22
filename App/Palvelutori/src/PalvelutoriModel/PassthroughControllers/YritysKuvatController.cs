using System.Net.Http;
using System.Threading.Tasks;
using BusinessForms;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using PalvelutoriModel.Caching;

namespace PalvelutoriModel.PassthroughControllers
{
    public class YritysKuvaController : PassthroughCRUDController
    {
        private DjangoCache Cache { get; }

        public YritysKuvaController(BFContext context, DjangoCache cache) : base("companies/x/pictures", context)
        {
            Cache = cache;
        }

        public Task<IActionResult> GetImage(string id, [FromQuery] string companyId)
        {
            if (companyId != null)
            {
                SetApi("companies/" + companyId + "/pictures/");
            }
            return base.Get(id);
        }

        public override Task<IActionResult> Post([FromBody] JObject body)
        {
            var companyId = body["company_id"].ToString();
            Cache.ClearAll();
            SetApi("companies/" + companyId + "/pictures/");
            return base.Post(body);
        }

        [HttpDelete("{id}")]
        public Task<IActionResult> Delete(string id, [FromQuery] string companyId)
        {
            SetApi("companies/" + companyId + "/pictures/");
            Cache.ClearAll();
            return base.DeleteRequest(id);
        }

        protected override Task<JObject> PerformCreate([FromQuery] string companyId)
        {
            companyId = this.Request.Query["companyId"];
            return Task.FromResult(JObject.Parse("{ \"image\": \"\", \"company_id\": \"" + companyId + "\", \"title\": \"kuva\"}"));
        }
    }

    public class YritysKuvatController : PassthroughBaseController
    {
        public YritysKuvatController(BFContext context) : base("companies/", context)
        {
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            HttpClient client = CreateClient();
            var result = await client.GetAsync(FullApi + id + "/pictures/");
            return MapReply(result);
        }
    }
}
