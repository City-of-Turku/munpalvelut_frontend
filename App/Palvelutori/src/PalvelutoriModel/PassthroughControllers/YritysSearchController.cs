using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using BusinessForms;
using Microsoft.AspNetCore.Mvc;
using PalvelutoriModel.Caching;
using PalvelutoriModel.Search;

namespace PalvelutoriModel.PassthroughControllers
{
    public class YritysSearchController : PassthroughBaseController
    {
        public YritysSearchController(BFContext context, DjangoCache cache) : base("companies/", context)
        {
        }

        [HttpPost("searchFromCompanies")]
        public async Task<List<Company>> Search([FromBody] string key)
        {
            try
            {                
                var api = "companies/?search=" + WebUtility.HtmlEncode(key);
                var jobject = await GetJson(api);
                var items = Deserialize<List<Company>>(jobject["results"]);
                return items;
            }
            catch (Exception ex)
            {
                throw;
            }

        } 

    }
}
