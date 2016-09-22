using System;
using System.Globalization;

namespace PalvelutoriModel.Controllers
{
    public class ViewInfo
    {
        private CultureInfo _cultureInfo;
        private readonly string _language;
        private string _viewName;


        public ViewInfo(string viewName, CultureInfo cultureInfo)
        {
            _cultureInfo = cultureInfo;
            _language = cultureInfo?.TwoLetterISOLanguageName;
            _viewName = viewName;
            IsSwedish = String.Compare(_language, "sv", true) == 0;

        }

        public bool IsSwedish { get; private set; }

        public string UriPrefix
        {
            get
            {
                return _language;
            }
        }

        public bool EditMode { get; set; }

    }
}
