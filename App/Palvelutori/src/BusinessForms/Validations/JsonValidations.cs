using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessForms.Validations
{
    public static class JsonValidations
    {
        public static BFContext ValidateString(this BFContext context, JObject jobj, string path, Func<string,string> validation)
        {
            JValue val = jobj[path] as JValue;
            string error = validation(val != null ? val.ToString() : null);
            if (error != null) {
                context.Invalid(path, error);
            }
            return context;
        }

        public static BFContext ValidateMinLength(this BFContext context, JObject jobj, string path, int minLength, string message)
        {
            return context.ValidateString(jobj, path, s => String.IsNullOrEmpty(s) || s.Length < minLength ? message : null);
        }

        public static bool HasValue(this JObject jobj, string path )
        {
            var val = jobj[path];
            if (val == null || val.Type == JTokenType.Null || val.Type == JTokenType.Undefined)
                return false;
            return true;
        }
    }
}
