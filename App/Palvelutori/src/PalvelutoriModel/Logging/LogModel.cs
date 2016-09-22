using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PalvelutoriModel.Logging
{
    public class LogModel
    {
        [JsonProperty("message")]
        public string Message { get; set; }

        [JsonProperty("Category")]
        public string Category { get; set; }

        [JsonProperty("ip")]
        public string IP { get; set; }

        [JsonProperty("user")]
        public string User { get; set; }

        [JsonProperty("exception")]
        public string Exception { get; set; }

        [JsonProperty("severity")]
        public LogLevels LogLevel { get; set; }
    }
}
