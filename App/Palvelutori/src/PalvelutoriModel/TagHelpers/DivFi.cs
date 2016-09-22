using Microsoft.AspNetCore.Razor.TagHelpers;
using PalvelutoriModel.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PalvelutoriModel.TagHelpers
{
    [HtmlTargetElement("div-fi")]
    public class DivFi : TagHelper
    {
        public ViewInfo Model { get; set; }

        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            if (Model.IsSwedish)
                output.SuppressOutput();
            output.TagName = "div";
            base.Process(context, output);
        }
    }
}
