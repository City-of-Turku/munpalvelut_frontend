using System;
using System.Threading.Tasks;
using BusinessForms;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.Mvc;
using PalvelutoriModel.Caching;

namespace PalvelutoriModel.PassthroughControllers
{
    public class YritysController : PassthroughCRUDController
    {
        private DjangoCache Cache { get; }

        public YritysController(BFContext context, DjangoCache cache) : base("companies/", context)
        {
            Cache = cache;
        }

        public override async Task<IActionResult> Get(string id)
        {
            string companyId;
            JObject me;
            try
            {
                me = await GetJson("users/", "me");
                companyId = me["company"].ToString();
            }
            catch (DjangoFailedException dje)
            {
                if (dje.StatusCode == System.Net.HttpStatusCode.NotFound || dje.StatusCode == System.Net.HttpStatusCode.Unauthorized)
                {
                    return new UnauthorizedResult();
                }
                throw;
            }
            if (companyId != null)
            {
                return await base.Get(companyId);
            }
            return new StatusCodeResult(403);
        }

        protected override Task<JObject> PerformCreate(string contextId)
        {
            throw new NotImplementedException();
        }

        public override Task<IActionResult> Put(string id, [FromBody] JObject body)
        {
            Cache.ClearAll();
            return base.Put(id, body);
        }

        public override Task<IActionResult> Post([FromBody] JObject body)
        {
            Cache.ClearAll();
            return base.Post(body);
        }
    }
}
