using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Razor.TagHelpers;

namespace BusinessForms.TagHelpers
{
    [HtmlTargetElement("bf-action-button-container")]
    public class BFActionButtonContainerTagHelper : TagHelper
    {
        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            base.Process(context, output);
            output.TagName = "div";
            output.Attributes.Add("class", "bf-action-button-container");                                  
        }
    }
}
