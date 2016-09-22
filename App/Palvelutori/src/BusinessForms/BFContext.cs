using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using Newtonsoft.Json;

namespace BusinessForms
{
    /// <summary>
    /// Common context for 
    /// </summary>
    public class BFContext : IDisposable
    {
        public BFContext(IServiceProvider serviceProvider, string djangoApi)
        {
            ServiceProvider = serviceProvider;
            DjangoApi = djangoApi;
        }

        public IServiceProvider ServiceProvider { get; private set; }

        public virtual void Dispose()
        {
        }

        /// <summary>
        /// Mark context as invalid
        /// </summary>
        /// <param name="path">Path to invalid property</param>
        /// <param name="error">Error text</param>
        public void Invalid(string path, string error)
        {
            if (_invalidFields == null) {
                _invalidFields = new Dictionary<string, string>();
            }
            _invalidFields.Add(path, error);
        }

        internal IActionResult InvalidReply()
        {
            return new InvalidReplyResult(_invalidFields);
        }

        /// <summary>
        /// Is context valid
        /// </summary>
        public bool IsValid
        {
            get
            {
                return _invalidFields == null;
            }
        }

        public string DjangoApi { get; private set; }

        private Dictionary<string, string> _invalidFields;

        private class InvalidReplyResult : IActionResult
        {
            private Dictionary<string, string> _invalidFields;

            public InvalidReplyResult(Dictionary<string, string> _invalidFields)
            {
                this._invalidFields = _invalidFields;
            }

            public async Task ExecuteResultAsync(ActionContext context)
            {
                context.HttpContext.Response.StatusCode = 422;
                MemoryStream ms = new MemoryStream();
                using (StreamWriter sw = new StreamWriter(ms)) {
                    JsonTextWriter jtw = new JsonTextWriter(sw);
                    jtw.WriteStartObject();
                    foreach (var kv in _invalidFields) {
                        jtw.WritePropertyName(kv.Key);
                        jtw.WriteValue(kv.Value);
                    }
                    jtw.WriteEndObject();
                }
                
                context.HttpContext.Response.Headers.Add("Content-type", "application/json");
                await context.HttpContext.Response.Body.WriteAsync(ms.ToArray(), 0, ms.ToArray().Length);
            }
        }
    }
}
