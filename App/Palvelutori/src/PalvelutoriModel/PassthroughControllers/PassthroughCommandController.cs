using BusinessForms;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PalvelutoriModel.PassthroughControllers
{
    public abstract class PassthroughCommandController: PassthroughBaseController
    {
        public PassthroughCommandController(string api, BFContext context):base(api, context)
        {

        }

        [HttpGet()]
        public Task<JObject> Create(string contextId = null)
        {
            return PerformCreate(contextId);
        }

        protected abstract Task<JObject> PerformCreate(string contextId);
       

        [HttpPost()]
        public virtual Task<IActionResult> Post([FromBody] JObject body)
        {
            return PostRequest(body);
        }
    }
}
