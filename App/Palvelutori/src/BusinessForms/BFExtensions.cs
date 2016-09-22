using BusinessForms.Controllers;
using BusinessForms.HttpExceptions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Microsoft.AspNetCore.Builder
{
    public static class BFExtensions
    {
        public static void UseBFExceptions(this IApplicationBuilder app)
        {
            app.Use(BFExceptionMiddleware);
        }

        public static void AddBFComponents(this IServiceCollection services)
        {
        }

        private static async Task BFExceptionMiddleware(HttpContext context, Func<Task> next)
        {
            try {
                await next();
            } catch (BFHttpException bfException) {
                context.Response.StatusCode = bfException.HttpStatus;
            }
        }
    }
}
