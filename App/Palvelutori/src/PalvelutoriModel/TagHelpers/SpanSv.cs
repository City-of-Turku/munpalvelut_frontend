using Microsoft.AspNetCore.Razor.TagHelpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PalvelutoriModel.Controllers;

namespace PalvelutoriModel.TagHelpers
{
    [HtmlTargetElement("span-sv")]
    public class SpanSv : TagHelper
    {
        public ViewInfo Model { get; set; }

        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            if (!Model.IsSwedish)
                output.SuppressOutput();
            output.TagName = "span";
            base.Process(context, output);
        }
    }
}
