using Microsoft.AspNetCore.Razor.TagHelpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessForms.TagHelpers
{
    [HtmlTargetElement("bf-field")]
    public class BFFieldTagHelper: TagHelper
    {
        protected IBFItemContext _itemContext;
        private string _descId;

        /// <summary>
        /// Label for field
        /// </summary>
        public string Label { get; set; }

        /// <summary>
        /// Description for field
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// Set if field is mandatory
        /// </summary>
        public bool Required { get; set; }

        public bool Readonly { get; set; }

        /// <summary>
        /// Path for field
        /// </summary>
        /// <remarks>Path can't contain html restricted characters</remarks>
        public string Path { get; set; }

        public string FieldMaxLength { get; set; }

        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            _itemContext = BFFieldSetTagHelper.GetItemContext(context);
            _descId = BFFormTagHelper.MakeFieldID();
            if (Path == null) {
                throw new ArgumentException("Path is mandatory", "Path");
            }
            if (Label == null) {
                throw new ArgumentException("Label is mandatory", "Label");
            }
            
            output.TagName = "div";
            output.Attributes.Add("class", "form-group");
            output.Attributes.Add("bf-validation-feedback", _itemContext.Item);
            output.Attributes.Add("name", Path);
            output.PreContent.AppendHtml($"<label for=\"{Path}\" class=\"col-md-12 control-label\">");
            output.PreContent.Append(Label);
            if (Required) {
                // TODO: Make nices later
                output.PreContent.Append(" *"); 
            }
            output.PreContent.AppendHtml("</label>\n");
            output.PreContent.AppendHtml("<div class=\"col-md-12\">");
            if (FieldMaxLength != null) {
                output.PreContent.AppendHtml($"<div style=\"max-width: { FieldMaxLength }\">");
                output.PostContent.AppendHtml("</div>");
            }
            EmitFieldContent(context, output);

            output.PostContent.AppendFormat($"<div id={_descId}>\n");

            if (!Readonly) {
                // Error field
                output.PostContent.AppendHtml($"<div class=\"bf-validation-error\" ng-show=\"{_itemContext.Item}.getError('{Path}')\">");
                output.PostContent.AppendHtml("<span class=\"label label-danger\">{{ ");
                output.PostContent.Append($"{_itemContext.Item}.getError('{Path}')");
                output.PostContent.AppendHtml(" }}</span></div>");
            }

            // description
            if (Description != null) {
                output.PostContent.AppendHtml($"<span id=\"{_descId}\" class=\"help-block\" >");
                output.PostContent.Append(Description);
                output.PostContent.AppendHtml("<span>");
            }
            output.PostContent.AppendHtml("</div></div>\n");
        }

        /// <summary>
        /// Override to emit default field content like text input
        /// </summary>
        protected virtual void EmitFieldContent(TagHelperContext context, TagHelperOutput output)
        {
            
        }
    }
}
