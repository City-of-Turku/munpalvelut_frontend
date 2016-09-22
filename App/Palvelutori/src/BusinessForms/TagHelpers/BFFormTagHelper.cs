using Microsoft.AspNetCore.Razor.TagHelpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace BusinessForms.TagHelpers
{
    [HtmlTargetElement("bf-form")]
    public class BFFormTagHelper : TagHelper
    {
        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            output.TagName = "form";
            output.Attributes.Add("novalidate", "novalidate");
            output.Attributes.Add(new TagHelperAttribute("name","$form" ));
            output.Attributes.Add("class", "form-horizontal");
        }

        public static string MakeFieldID()
        {
            return "F" + Interlocked.Increment(ref _counter);
        }

        private static long _counter = 1;
    }
}
