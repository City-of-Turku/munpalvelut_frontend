using System.Globalization;
using Microsoft.AspNetCore.Mvc;

namespace PalvelutoriModel.Controllers
{
    public abstract class UIController : Controller
    {
        protected UIController()
        {
        }

        protected IActionResult UIView(string viewName, bool forEdit = false)
        {
            return View(viewName, CreateViewInfo(viewName, forEdit));
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

        protected ViewInfo CreateViewInfo(string viewName, bool forEdit)
        {
            // TODO: Kielen haku
            ViewInfo vi = new ViewInfo(viewName, GetRequestCulture());
            vi.EditMode = forEdit;
            return vi;
        }
    }
}
