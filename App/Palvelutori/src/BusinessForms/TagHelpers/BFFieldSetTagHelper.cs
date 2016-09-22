using Microsoft.AspNetCore.Razor.TagHelpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessForms.TagHelpers
{
    [HtmlTargetElement("bf-fieldset")]
    public class BFFieldSetTagHelper: TagHelper, IBFItemContext
    {

        public string Title { get; set; }

        public string Item { get; set; }

        public string Mode { get; set; }

        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            context.Items.Add(typeof(IBFItemContext), this);
            if (Item == null)
                Item = "$ctrl.item";
            output.TagName = "fieldset";
            output.Attributes.Add(new TagHelperAttribute("novalidate", "novalidate") );
            output.Attributes.Add(new TagHelperAttribute( "bf-item", Item) );
            output.Attributes.Add("class", "bf-fieldset");
            if (Title != null) {
                output.PreContent.AppendHtml("<legend>");
                output.PreContent.Append(Title);
                output.PreContent.AppendHtml("</legend>");
            }
        }

        /// <summary>
        /// Retrieve form from current context
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public static IBFItemContext GetItemContext(TagHelperContext context)
        {
            object tmp = null;
            context.Items.TryGetValue(typeof(IBFItemContext), out tmp);
            IBFItemContext ctx = tmp as IBFItemContext;
            if (ctx == null) {
                throw new SequenceException("This tag item must be placed inside BFFieldSet");
            }
            return ctx;
        }

    }
}
