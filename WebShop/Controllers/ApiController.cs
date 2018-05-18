using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Reflection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using WebShop.TypeReflect;

namespace WebShop.Controllers
{
    [Route("api")]
    public class ApiController : Controller
    {
        private string Prepend { get; } = "WebShop.";

        [HttpGet("call")]
        public async Task<IActionResult> Call(string name, string json, CancellationToken cancellationToken)
        {

            // find api
            var findName = Prepend + name;
            var types = Assembly.GetExecutingAssembly()
                .GetTypes();
            foreach (var type in types)
            {
                var api = type.GetMethods()
                    .Where(x => x.GetCustomAttributes(typeof(Api), false).Length > 0)
                    .Where(x => type.FullName + "." + x.Name == findName)
                    .FirstOrDefault();
                if (api != null)
                {

                    // has input argument
                    bool hasInput;
                    bool hasCancellation;
                    var parameters = api.GetParameters();
                    if (parameters.Count() == 0)
                    {
                        hasInput = false;
                        hasCancellation = false;
                    }
                    else
                    {
                        var first = parameters.First().ParameterType;
                        if (first.Equals(typeof(CancellationToken)))
                        {
                            hasInput = false;
                            hasCancellation = true;
                        }
                        else
                        {
                            hasInput = true;
                            if (parameters.Count() > 1)
                            {
                                if (parameters[1].ParameterType.Equals(typeof(CancellationToken)))
                                {
                                    hasCancellation = true;
                                }
                                else
                                {
                                    hasCancellation = false;
                                }
                            }
                            else
                            {
                                hasCancellation = false;
                            }
                        }
                    }


                    // call api
                    var service = HttpContext.RequestServices.GetService(type);

                    dynamic output = null;
                    if (hasInput)
                    {
                        var inputType = api.GetParameters().First().ParameterType;
                        var input = JsonConvert.DeserializeObject(json, inputType);
                        if (hasCancellation)
                        {
                            output = api.Invoke(service, new object[] { input, cancellationToken });
                        }
                        else
                        {
                            output = api.Invoke(service, new object[] { input });
                        }
                    }
                    else if (hasCancellation)
                    {
                        output = api.Invoke(service, new object[] { cancellationToken });
                    }
                    else
                    {
                        output = api.Invoke(service, new object[] { });
                    }

                    var result = await output;

                    return Ok(result);

                }
            }

            return NotFound("Cannot find api function " + findName);
            
        }

    }
}
