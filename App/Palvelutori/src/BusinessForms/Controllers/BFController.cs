using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace BusinessForms.Controllers
{
    [Route("api/[controller]")]
    public abstract class BFController : Controller
    {
        protected BFController(BFContext context)
        {
            Context = context;
        }

        /// <summary>
        /// Context for Business controller calls
        /// </summary>
        public BFContext Context { get; private set; }

        /// <summary>
        /// Convert JObject to .NET object
        /// </summary>
        /// <typeparam name="T">Type of .NET object</typeparam>
        /// <param name="jobject">Json object to deserialize</param>
        /// <returns></returns>
        public T Deserialize<T>(JToken jobject)
        {
            return CreateSerializer().Deserialize<T>(jobject.CreateReader());
        }

        /// <summary>
        /// Convert .NET object to JObject
        /// </summary>
        /// <typeparam name="T">Type of .NET object</typeparam>
        /// <param name="netObject">Object to serialize</param>
        /// <returns>Json object</returns>
        public JObject Serialize<T>(T netObject)
        {
            JConstructor jc = new JConstructor();
            CreateSerializer().Serialize(jc.CreateWriter(), netObject);
            return (JObject)jc.First;
        }

        /// <summary>
        /// Convert JObject to .NET object
        /// </summary>
        /// <typeparam name="T">Type of .NET object</typeparam>
        /// <param name="netArray">Object array to serialize</param>
        /// <returns>Json array</returns>
        public JArray SerializeArray<T>(IEnumerable<T> netArray)
        {
            JConstructor jc = new JConstructor();
            CreateSerializer().Serialize(jc.CreateWriter(), netArray);
            return (JArray)jc.First;
        }

        /// <summary>
        /// Dispose request context
        /// </summary>
        /// <remarks>When overriding in controller, remember to call base class implementation</remarks>
        /// <param name="disposing"></param>
        protected override void Dispose(bool disposing)
        {
            if (Context != null) {
                Context.Dispose();
                Context = null;
            }
            base.Dispose(disposing);
        }

        /// <summary>
        /// Create and initialize json serializer
        /// </summary>
        /// <returns></returns>
        protected JsonSerializer CreateSerializer()
        {
            return new JsonSerializer();
        }

        protected CultureInfo GetRequestCulture()
        {
            object temp;
            HttpContext.Items.TryGetValue(typeof(CultureInfo), out temp);

            if (temp == null)
            {
                return new CultureInfo("fi-FI");

            }
            return temp as CultureInfo;
        }

    }
}
