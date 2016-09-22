using Microsoft.AspNetCore.Razor.TagHelpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessForms.TagHelpers
{
    [HtmlTargetElement("bf-number-field")]
    public class BFNumberFieldTagHelper: BFFieldTagHelper
    {
        public int Scale { get; set; }

        public string Unit { get; set; }

        protected override void EmitFieldContent(TagHelperContext context, TagHelperOutput output)
        {
            if (Readonly) {
                output.PreContent.AppendHtml("<input type=\"text\" class=\"form-control\"");
                output.PreContent.AppendHtml($" name=\"{Path}\" bf-bind-to=\"{_itemContext.Item}\" disabled=\"disabled\" bf-format-number=\"{Scale}\" />");
                return;
            }
            output.PreContent.AppendHtml("<input type=\"text\" class=\"form-control\"");
            if (Required) {
                output.PreContent.AppendHtml(" required");
            }
            output.PreContent.AppendHtml($" name=\"{Path}\" bf-bind-to=\"{_itemContext.Item}\" ng-disabled=\"{_itemContext.Item}.readonly\"  bf-format-number=\"{Scale}\" />");
        }
    }
}
