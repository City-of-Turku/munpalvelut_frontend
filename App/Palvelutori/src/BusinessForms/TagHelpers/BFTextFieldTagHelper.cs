using Microsoft.AspNetCore.Razor.TagHelpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessForms.TagHelpers
{
    [HtmlTargetElement("bf-text-field")]
    public class BFTextFieldTagHelper: BFFieldTagHelper
    {
        protected override void EmitFieldContent(TagHelperContext context, TagHelperOutput output)
        {
            if (Readonly) {
                output.PreContent.AppendHtml("<input type=\"text\" class=\"form-control\"");
                output.PreContent.AppendHtml($" name=\"{Path}\" bf-bind-to=\"{_itemContext.Item}\" disabled=\"disabled\" />");
                return;
            }
            output.PreContent.AppendHtml("<input type=\"text\" class=\"form-control\"");
            if (Required) {
                output.PreContent.AppendHtml(" required");
            }
            output.PreContent.AppendHtml($" name=\"{Path}\" bf-bind-to=\"{_itemContext.Item}\" ng-disabled=\"{_itemContext.Item}.readonly\" />");
        }
    }
}
