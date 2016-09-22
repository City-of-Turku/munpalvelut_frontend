using Microsoft.AspNetCore.Mvc.Razor.Precompilation;
using Microsoft.Dnx.Compilation.CSharp;

namespace PrecompilationWebSite
{
    public class RazorPreCompilation : RazorPreCompileModule
    {
        protected override bool EnablePreCompilation(BeforeCompileContext context) => false;
    }
}