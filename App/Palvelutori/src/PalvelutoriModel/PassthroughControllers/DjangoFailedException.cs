using System;
using System.Net;
using System.Runtime.Serialization;

namespace PalvelutoriModel.PassthroughControllers
{
    public class DjangoFailedException : Exception
    {
        public HttpStatusCode StatusCode { get; private set; }
        public string Body { get; private set; }

        public DjangoFailedException()
        {
        }

        public DjangoFailedException(string message) : base(message)
        {
        }

        public DjangoFailedException(HttpStatusCode statusCode, string body)
        {
            this.StatusCode = statusCode;
            this.Body = body;
        }

    }
}