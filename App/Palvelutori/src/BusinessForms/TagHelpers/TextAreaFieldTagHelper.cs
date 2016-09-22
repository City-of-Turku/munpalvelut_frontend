using Microsoft.AspNetCore.Razor.TagHelpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessForms.TagHelpers
{

    [HtmlTargetElement("bf-textarea-field")]
    public class BFTextareaFieldTagHelper : BFFieldTagHelper
    {
        protected override void EmitFieldContent(TagHelperContext context, TagHelperOutput output)
        {
            if (Readonly) {
                output.PreContent.AppendHtml("<textarea rows=\"5\" class=\"form-control\"");
                output.PreContent.AppendHtml($" name=\"{Path}\" bf-bind-to=\"{_itemContext.Item}\" disabled=\"disabled\" ></textarea>");
                return;
            }
            output.PreContent.AppendHtml("<textarea rows=\"5\" class=\"form-control\"");
            if (Required) {
                output.PreContent.AppendHtml(" required");
            }
            output.PreContent.AppendHtml($" name=\"{Path}\" bf-bind-to=\"{_itemContext.Item}\" ng-disabled=\"{_itemContext.Item}.readonly\"></textarea>");
        }
    }
}
