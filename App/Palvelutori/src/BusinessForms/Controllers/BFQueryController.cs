using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessForms.Controllers
{
    public abstract class BFQueryController: BFController
    {
        protected BFQueryController(BFContext context):base(context)
        {

        }

        [HttpGet()]
        public Task<JArray> Query()
        {
            JObject queryParams = new JObject();
            if (Request != null && Request.Query != null) {
                foreach (var queryParam in Request.Query) {
                    queryParams.Add(queryParam.Key, queryParam.Value.ToString());
                }
            }
            return PerformQuery(queryParams);
        }

        protected abstract Task<JArray> PerformQuery(JObject queryParams);
    }
}
