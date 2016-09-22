using Microsoft.AspNetCore.Http;
using System;
using System.Globalization;
using System.Threading.Tasks;

namespace PalvelutoriModel.Translation
{
    public class TranslationMiddleware
    {
        private static readonly CultureInfo CiFi = new CultureInfo("fi-FI");

        private static readonly CultureInfo CiSv = new CultureInfo("sv-FI");

        public static Task ExtractLanguage(HttpContext context, Func<Task> next)
        {
            PathString psRest;
            var ci = CiFi;

            if (context.Request.Path.StartsWithSegments("/fi", out psRest))
            {
                if (!psRest.HasValue || psRest.ToString().StartsWith("/"))
                {
                    context.Request.Path = psRest;
                }
            }
            else if (context.Request.Path.StartsWithSegments("/sv", out psRest))
            {
                if (!psRest.HasValue || psRest.ToString().StartsWith("/"))
                {
                    context.Request.Path = psRest;
                    ci = CiSv;
                }
            }

            context.Items.Add(typeof(CultureInfo), ci);
            return next();
        }
    }
}
