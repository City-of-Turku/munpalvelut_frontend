using BusinessForms.HttpExceptions;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessForms.Controllers
{
    public abstract class BFCRUDController: BFController
    {
        protected BFCRUDController(BFContext context):base(context)
        {

        }

        [HttpGet("{id}")]
        public Task<JObject> Get(string id)
        {
            return PerformGet(id);
        }

        [HttpGet()]
        public Task<JObject> Create(string parentId = null)
        {
            return PerformCreate(parentId);
        }

        

        [HttpPost()]
        public async Task<IActionResult> Post([FromBody] JObject newObject)
        {
            await Validate(true, newObject);
            if (!Context.IsValid)
                return Context.InvalidReply(); 
            var obj = PerformPost(newObject);
            if (Context.IsValid)
                return Json(obj);
            return Context.InvalidReply();
        }

        

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(string id, [FromBody] JObject newObject)
        {
            await Validate(false, newObject);
            if (!Context.IsValid)
                return Context.InvalidReply();
            var obj = PerformPut(id, newObject);
            if (Context.IsValid)
                return Json(obj);
            return Context.InvalidReply();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            var obj = PerformDelete(id);
            if (Context.IsValid)
                return Json(obj);
            return Context.InvalidReply();
        }

        /// <summary>
        /// Default delete will throw unauthorized exception. Override this method to implement delete
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        protected virtual Task<JObject> PerformDelete(string id)
        {
            throw new UnauthorizedException();
        }


        /// <summary>
        /// Override to validate put / post commands
        /// </summary>
        /// <param name="isNew"></param>
        /// <param name="newObject"></param>
        /// <returns></returns>
        protected virtual Task Validate(bool isNew, JObject newObject)
        {
            return Task.FromResult(false);
        }

        protected abstract Task<JObject> PerformCreate(string parentId);

        protected abstract Task<JObject> PerformGet(string id);

        protected abstract Task<JObject> PerformPost(JObject newObject);

        protected abstract Task<JObject> PerformPut(string id, JObject newObject);
    }
}
