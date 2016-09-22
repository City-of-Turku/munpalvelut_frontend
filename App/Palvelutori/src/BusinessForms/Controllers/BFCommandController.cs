using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessForms.Controllers
{
    public abstract class BFCommandController: BFController
    {
        protected BFCommandController(BFContext context):base(context)
        {

        }

        [HttpPost()]
        public async Task<IActionResult> Command([FromBody] JObject commandParameters)
        {
            await ValidateCommand(commandParameters);
            if (!Context.IsValid)
                return Context.InvalidReply();
            var jobj = await PerformCommand(commandParameters);
            if (!Context.IsValid)
                return Context.InvalidReply();
            return Json(jobj);
        }

        [HttpGet()]
        public Task<JObject> Create(string contextId = null)
        {
            return PerformCreate(contextId);
        }



        /// <summary>
        /// Override to validate put / post commands
        /// </summary>
        /// <param name="isNew"></param>
        /// <param name="newObject"></param>
        /// <returns></returns>
        protected virtual Task ValidateCommand(JObject commandParameters)
        {
            return Task.FromResult(false);
        }

        protected abstract Task<JObject> PerformCreate(string contextId);

        /// <summary>
        /// Override to perform actual command
        /// </summary>
        /// <param name="commandParameters"></param>
        /// <returns></returns>

        protected abstract Task<JObject> PerformCommand(JObject commandParameters);
    }
}
