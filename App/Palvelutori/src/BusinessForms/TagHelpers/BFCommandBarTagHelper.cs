using Microsoft.AspNetCore.Razor.TagHelpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessForms.TagHelpers
{
    [HtmlTargetElement("bf-command-bar")]
    public class BFCommandBarTagHelper : TagHelper
    {
        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            base.Process(context, output);
            output.TagName = "div";
            output.Attributes.Add("class", "bf-command-bar");
        }
    }
}
