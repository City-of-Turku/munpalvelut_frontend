using BusinessForms;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PalvelutoriModel.PassthroughControllers
{
    public abstract class PassthroughCRUDController: PassthroughBaseController
    {
        public PassthroughCRUDController(string api, BFContext context):base(api, context)
        {

        }
        [HttpGet()]
        public Task<JObject> Create([FromQuery] string contextId = null)
        {
            return PerformCreate(contextId);
        }

        protected abstract Task<JObject> PerformCreate(string contextId);

        [HttpGet("{id}")]
        public virtual Task<IActionResult> Get(string id)
        {
            return GetRequest(id);
        }

        [HttpPost()]
        public virtual Task<IActionResult> Post([FromBody] JObject body)
        {
            return PostRequest(body);
        }

        [HttpPut("{id}")]
        public virtual Task<IActionResult> Put(string id,[FromBody] JObject body)
        {
            return PutRequest(id, body);
        }
    }
}
