using BusinessForms;
using BusinessForms.Controllers;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net.Http;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json.Linq;
using System.Text;
using Microsoft.AspNetCore.Http;
using PalvelutoriModel.Logging;
using Newtonsoft.Json;
using System.IO;

namespace PalvelutoriModel.PassthroughControllers {
    public class PassthroughBaseController : BFController {
        public readonly string RootAPI;


        private string _defaultApi;

        public PassthroughBaseController(string api, BFContext context): base(context)
        {
            _defaultApi = api;
            RootAPI = context.DjangoApi;
        }

#pragma warning disable 4014
        protected void LogEvent(HttpContext context, LogLevels level, string message, string category)
        {
            LogModel lm = new LogModel() {
                Message = message,
                LogLevel = level,
                Category = category,
                Exception = "none"
            };
            if (context != null && context.Connection != null && context.Connection.RemoteIpAddress != null) {
                lm.IP = context.Connection.RemoteIpAddress.ToString();
            }
            PostLogEvent(lm);
        }

        public void LogEvent(LogLevels level, string message, string category)
        {
            LogEvent(this.HttpContext, level, message, category);
        }

#pragma warning restore 4014
        private async Task PostLogEvent(LogModel lm)
        {
            HttpClient client = CreateClient();
            JsonSerializer js = new JsonSerializer();
            byte[] bytes;
            using (StringWriter sw = new StringWriter()) {
                js.Serialize(sw, lm);
                bytes = Encoding.UTF8.GetBytes(sw.ToString());
            }
            
            HttpContent sendContent = new ByteArrayContent(bytes);
            sendContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json");
            var result = await client.PostAsync(BaseAPI + "/logs/", sendContent);
            var resultString = await result.Content.ReadAsStringAsync();
        }

        public string FullApi {
            get {           
                 return BaseAPI + _defaultApi;
            }
        }

        public string BaseAPI {
            get {
                return RootAPI + "api/";
            }
        }


        protected void SetApi(string api) {
            _defaultApi = api;
        }
        protected async Task<IActionResult> PostRequest(JObject content)
        {
            HttpClient client = CreateClient();
            var bytes = Encoding.UTF8.GetBytes(content.ToString());
            HttpContent sendContent = new ByteArrayContent(bytes);
            sendContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json");
            var result = await client.PostAsync(FullApi, sendContent);
            return MapReply(result);
        }

        protected async Task<IActionResult> PutRequest(string id, JObject content)
        {
            HttpClient client = CreateClient();
            var bytes = Encoding.UTF8.GetBytes(content.ToString());
            HttpContent sendContent = new ByteArrayContent(bytes);
            sendContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json");
            var result = await client.PutAsync(FullApi + id + "/", sendContent);
            return MapReply(result);
        }

        protected async Task<IActionResult> GetRequest(string id)
        {
            HttpClient client = CreateClient();
            id += "/";
            var result = await client.GetAsync(FullApi + id);
            return MapReply(result);
        }

        protected async Task<IActionResult> DeleteRequest(string id) {
            HttpClient client = CreateClient();
            id += "/";
            var result = await client.DeleteAsync(FullApi + id);
            return MapReply(result);
        }

        protected async Task DeleteItem(string id) {
            HttpClient client = CreateClient();
            id += "/";
            var result = await client.DeleteAsync(FullApi + id);
            var body = await result.Content.ReadAsStringAsync();
            if (result.StatusCode != System.Net.HttpStatusCode.OK && result.StatusCode != System.Net.HttpStatusCode.NoContent) {
                throw new DjangoFailedException(result.StatusCode, body);
            }
        }

        protected async Task<JObject> GetJson(string api, string id)
        {
            HttpClient client = CreateClient();
            id += "/";
            var result = await client.GetAsync(BaseAPI + api + id);
            var body = await result.Content.ReadAsStringAsync();
            if (result.StatusCode != System.Net.HttpStatusCode.OK) {
                throw new DjangoFailedException(result.StatusCode, body);
            }
            return JObject.Parse(body);
        }

        protected async Task<JObject> GetJson(string api) {
            HttpClient client = CreateClient();
            var result = await client.GetAsync(BaseAPI + api);
            var body = await result.Content.ReadAsStringAsync();
            if (result.StatusCode != System.Net.HttpStatusCode.OK) {
                throw new DjangoFailedException(result.StatusCode, body);
            }
            return JObject.Parse(body);
        }

        protected async Task<JObject> PostJson(string api, JObject content)
        {
            HttpClient client = CreateClient();
            var bytes = Encoding.UTF8.GetBytes(content.ToString());
            HttpContent sendContent = new ByteArrayContent(bytes);
            sendContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json");
            var result = await client.PostAsync(BaseAPI + api, sendContent);
            var body = await result.Content.ReadAsStringAsync();

            if (result.StatusCode != System.Net.HttpStatusCode.Created && result.StatusCode != System.Net.HttpStatusCode.OK) {
                throw new DjangoFailedException(result.StatusCode, body);
            }
            return JObject.Parse(body);
        }

        protected async Task<JObject> PutJson(string api, string id, JObject content)
        {
            HttpClient client = CreateClient();
            id += "/";
            var bytes = Encoding.UTF8.GetBytes(content.ToString());
            HttpContent sendContent = new ByteArrayContent(bytes);
            sendContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json");
            var result = await client.PutAsync(BaseAPI + api + id, sendContent);
            var body = await result.Content.ReadAsStringAsync();

            if (result.StatusCode != System.Net.HttpStatusCode.OK) {
                throw new DjangoFailedException(result.StatusCode, body);
            }
            return JObject.Parse(body);
        }

        protected async Task<JObject> PutJson(string api, JObject content)
        {
            HttpClient client = CreateClient();
            var bytes = Encoding.UTF8.GetBytes(content.ToString());
            HttpContent sendContent = new ByteArrayContent(bytes);
            sendContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json");
            var result = await client.PutAsync(BaseAPI + api, sendContent);
            var body = await result.Content.ReadAsStringAsync();

            if (result.StatusCode != System.Net.HttpStatusCode.OK)
            {
                throw new DjangoFailedException(result.StatusCode, body);
            }
            return JObject.Parse(body);
        }

        protected string _auth;
        protected HttpClient CreateClient()
        {
            HttpClient client = new HttpClient();
            StringValues auth;
            if (Request.Headers.TryGetValue("Authorization", out auth)) {
                _auth = auth.ToString();
            }
            if (_auth != null) { 
                client.DefaultRequestHeaders.Add("Authorization", _auth);
            }
            return client;
        }

      

        protected virtual IActionResult MapReply(HttpResponseMessage result)
        {
            if (result.StatusCode != System.Net.HttpStatusCode.OK && result.StatusCode != System.Net.HttpStatusCode.NoContent && result.StatusCode != System.Net.HttpStatusCode.Created) {
                LogEvent(LogLevels.Trace, $"Reply status: {result.StatusCode.ToString()} from call to apu {FullApi} ", "status");
            }
            return new MapReplyImpl(result);
        }

        protected virtual IActionResult MapReplyBin(HttpResponseMessage result) {
            if (result.StatusCode != System.Net.HttpStatusCode.OK && result.StatusCode != System.Net.HttpStatusCode.NoContent && result.StatusCode != System.Net.HttpStatusCode.Created) {
                LogEvent(LogLevels.Trace, $"Reply status: {result.StatusCode.ToString()} from call to apu {FullApi} ", "status");
            }
            return new MapReplyBinImpl(result);
        }

        private class MapReplyImpl : IActionResult
        {
            private HttpResponseMessage result;

            public MapReplyImpl(HttpResponseMessage result)
            {
                this.result = result;
            }

            public async Task ExecuteResultAsync(ActionContext context)
            {
                var body = await result.Content.ReadAsStringAsync();
                foreach (var hr in result.Headers) {
                    if (!FilterHeader(hr.Key)) {
                        result.Content.Headers.Add(hr.Key, hr.Value);
                    }
                }
                context.HttpContext.Response.StatusCode = (int) result.StatusCode;
                var bytes = Encoding.UTF8.GetBytes(body.ToString());
                await context.HttpContext.Response.Body.WriteAsync(bytes, 0, bytes.Length);
            }

            private bool FilterHeader(string key)
            {
                
                return true;
            }
        }

        private class MapReplyBinImpl : IActionResult {
            private HttpResponseMessage result;

            public MapReplyBinImpl(HttpResponseMessage result) {
                this.result = result;
            }

            public async Task ExecuteResultAsync(ActionContext context) {
                var body = await result.Content.ReadAsByteArrayAsync();
                foreach (var hr in result.Headers) {
                    if (!FilterHeader(hr.Key)) {
                        result.Content.Headers.Add(hr.Key, hr.Value);
                    }
                }
                context.HttpContext.Response.StatusCode = (int)result.StatusCode;
                await context.HttpContext.Response.Body.WriteAsync(body, 0, body.Length);
            }

            private bool FilterHeader(string key) {

                return true;
            }
        }
    }
}
