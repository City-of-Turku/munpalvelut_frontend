using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using BusinessForms;
using BusinessForms.FSControllers;
using PalvelutoriModel.Translation;
using PalvelutoriModel.Caching;
using PS = PalvelutoriModel.PassthroughControllers;
using PalvelutoriModel.Vetuma;

namespace Microsoft.AspNetCore.Builder
{
    public static class PalvelutoriExtensions
    {
        public static void AddPalvelutori(this IServiceCollection services, string dataPath, string djangoApi)
        {
            services.AddTransient<PS.KohdeController>();
            services.AddTransient<PS.KohteetController>();
            services.AddTransient<PS.KayttajaController>();
            services.AddTransient<PS.KayttajatController>();
            services.AddTransient<PS.LoginController>();
            services.AddTransient<PS.PalveluPaketitController>();
            services.AddTransient<PS.AdminResourceCalenderController>();
            services.AddTransient<PS.YritysSearchController>();
            services.AddTransient<BFContext>(sp => new BFContext(sp, djangoApi));
            services.AddSingleton<IFSProvider>(sp =>
                new FSProvider(dataPath)
            );
            services.AddSingleton<DjangoCache, DjangoCache>();
        }

        public static void UsePalvelutoriTranslation(this IApplicationBuilder app)
        {
            app.Use(TranslationMiddleware.ExtractLanguage);
        }

        public static void AddVetuma<TVetumaController>(this IServiceCollection services, VetumaEnvironment environment) where TVetumaController : Controller
        {
            services.AddSingleton<VetumaEnvironment>(en => environment);
            services.AddTransient<IVetumaFactory, VetumaFactory>();

            // TODO: Tämä ehkä vähän huono tässä -> Voisi olla fiksummassakin paikassa.
            services.AddTransient<TVetumaController>();
        }
    }
}

namespace PalvelutoriModel
{
    internal static class LocalExtensions
    {
        internal static string GetUserID(this Controller controller)
        {
            return "416757105098753";
        }
    }
}
