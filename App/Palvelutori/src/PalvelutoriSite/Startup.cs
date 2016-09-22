using System;
using System.IO;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.FileProviders;
using PalvelutoriModel.Vetuma;
using PalvelutoriSite.Controllers;

namespace PalvelutoriSite
{
    public class Startup
    {
        private readonly string _dataPath;
        private string _djangoApi;

        public IConfigurationRoot Configuration { get; set; }

        public static string SystemInfo { get; private set; }

        public static bool IsTrackingEnabled { get; private set; }

        public Startup(IHostingEnvironment env)
        {
            var configRoot = Path.GetDirectoryName(env.ContentRootPath);

            // Set up configuration sources.
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json");
            if (Directory.Exists(configRoot + "\\config")) {
                var fp = new PhysicalFileProvider(configRoot + "\\config");
                builder.AddJsonFile(fp, "serverSettings.json", false, false);
            }
            builder.AddEnvironmentVariables();

            if (env.IsDevelopment())
            {
                builder.AddUserSecrets();
            }
         
            Configuration = builder.Build();
            _dataPath = env.WebRootPath + "\\AppData";

            SystemInfo = Configuration["systemInfo"];

            var tmp = Configuration["IsTrackingEnabled"];
            if (!String.IsNullOrEmpty(tmp))
            {
                IsTrackingEnabled = Boolean.Parse(tmp);
            }
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMemoryCache();
            services.AddMvc();
            services.AddBFComponents();

            _djangoApi = Configuration["djangoApi"];
            if (_djangoApi == null) {
                throw new ArgumentException("Django api must be set in system configuration");
            }

            Console.WriteLine("Running on django '{0}'", _djangoApi);
            services.AddPalvelutori(_dataPath, _djangoApi);
            services.AddVetuma<VetumaController>(new VetumaEnvironment(Configuration));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();            
            app.UseBFExceptions();
            app.UsePalvelutoriTranslation();
            app.UseStaticFiles();         
            app.UseMvc(opt => opt.MapRoute(name: "default", template: "{controller=Home}/{action=Index}/{id?}"));
        }       
    }
}
