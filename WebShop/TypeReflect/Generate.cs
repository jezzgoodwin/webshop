using Microsoft.Extensions.FileProviders;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;

namespace WebShop.TypeReflect
{

    class Line
    {
        public int Tab { get; }
        public string Text { get; }
        public Line(int tab, string text)
        {
            Tab = tab;
            Text = text;
        }
    }

    public class Generate
    {

        private string BaseName { get; } = "WebShop.";
        private List<Line> Lines { get; } = new List<Line>();
        private string CurrentNamespace { get; set; } = null;
        private bool NeedsDictionary { get; set; } = false;

        public void Run(string saveFilename)
        {
            Console.WriteLine("TypeReflect run");

            var enums = Assembly.GetExecutingAssembly()
                    .GetTypes()
                    .Where(t => t.IsEnum && t.IsPublic)
                    .Where(x => x.GetCustomAttributes(typeof(Enum), false).Length > 0)
                    .ToArray();

            foreach (var en in enums)
            {
                OpenDef("enum", en.FullName);
                var fields = en.GetFields();
                foreach (var field in fields)
                {
                    if (field.Name.Equals("value__")) continue;
                    AddLine(0, field.Name + " = " + field.GetRawConstantValue() + ",");
                }
                CloseDef();
            }

            var dtos = Assembly.GetExecutingAssembly()
                .GetTypes()
                .Where(x => x.GetCustomAttributes(typeof(Dto), false).Length > 0)
                .ToArray();

            foreach (var dto in dtos)
            {
                OpenDef("interface", dto.FullName);
                var props = dto.GetProperties();
                foreach (var prop in props)
                {
                    var line = "readonly " + ToCamel(prop.Name);
                    if (prop.GetCustomAttributes(typeof(Optional), false).Length > 0)
                    {
                        line += "?";
                    }
                    line += ": " + TypeName(prop.PropertyType) + ";";
                    AddLine(0, line);
                }
                CloseDef();
            }

            CloseNamespace();

            AddLine(1, "export type ApiMap = {");
            var types = Assembly.GetExecutingAssembly()
                .GetTypes();
            foreach (var type in types)
            {
                var apis = type.GetMethods()
                    .Where(x => x.GetCustomAttributes(typeof(Api), false).Length > 0)
                    .ToArray();
                foreach (var api in apis)
                {

                    var query = "";
                    var parameters = api.GetParameters();
                    if (parameters.Count() == 0)
                    {
                        query = "null";
                    }
                    else
                    {
                        var first = parameters.First().ParameterType;
                        if (first.Equals(typeof(CancellationToken)))
                        {
                            query = "null";
                        }
                         else
                        {
                            query = TypeName(first);
                        }
                    }

                    var result = "";
                    if (api.ReturnType.IsGenericType)
                    {
                        result = TypeName(api.ReturnType.GenericTypeArguments.First());
                    }
                    else
                    {
                        result = "null";
                    }

                    AddLine(1, "\"" + RemoveBase(type.FullName) + "." + api.Name + "\": {");
                    AddLine(0, "query: " + query + ",");
                    AddLine(0, "result: " + result);
                    AddLine(-1, "},");
                }
            }
            AddLine(-1, "}");

            if (NeedsDictionary)
                AddLine(0, "interface ReadonlyDictionary<T> { readonly [index: string]: T; }");

            Write(saveFilename);

        }

        private void AddLine(int tab, string text)
        {
            Lines.Add(new Line(tab, text));
        }

        private void OpenNamespace(string name)
        {
            if (CurrentNamespace != name)
            {
                if (CurrentNamespace != null)
                {
                    AddLine(-1, "}");
                }
                AddLine(1, "export namespace " + name + " {");
            }
            CurrentNamespace = name;
        }

        private void CloseNamespace()
        {
            if (CurrentNamespace != null)
            {
                AddLine(-1, "}");
            }
        }

        private void OpenDef(string type, string fullName)
        {
            var tree = fullName.Split(".");
            var name = tree.Last();
            var list = tree.ToList();
            list.RemoveAt(tree.Count() - 1);
            OpenNamespace(RemoveBase(String.Join(".", list)));
            AddLine(1, "export " + type + " " + name + " {");
        }

        private void CloseDef()
        {
            AddLine(-1, "}");
        }

        private string TypeName(Type type)
        {
            if (type.Equals(typeof(bool)))
            {
                return "boolean";
            }
             if (type.Equals(typeof(int)) || type.Equals(typeof(decimal)))
            {
                return "number";
            }
            if (type.Equals(typeof(string)))
            {
                return "string";
            }
            if (type.IsGenericType && Nullable.GetUnderlyingType(type) != null)
            {
                var genericTypes = type.GenericTypeArguments;
                var inner = TypeName(genericTypes[0]);
                return inner + " | null";
            }
            if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(Dictionary<,>))
            {
                NeedsDictionary = true;
                var genericTypes = type.GenericTypeArguments;
                var inner = TypeName(genericTypes[1]);
                return "ReadonlyDictionary<" + inner + ">";
            }
            if (type.IsGenericType && (type.GetGenericTypeDefinition() == typeof(IEnumerable<>) || type.GetGenericTypeDefinition() == typeof(List<>)))
            {
                var genericTypes = type.GenericTypeArguments;
                var inner = TypeName(genericTypes[0]);
                return "ReadonlyArray<" + inner + ">";
            }
            if (type.FullName.Substring(0, BaseName.Length) == BaseName)
            {
                return RemoveBase(type.FullName);
            }
            throw new Exception("TypeReflect: Cannot workout type name " + type.FullName);
        }

        private string ToCamel(string text)
        {
            return text.ToLower().Substring(0, 1) + text.Substring(1);
        }

        private string RemoveBase(string text)
        {
            if (text.Substring(0, BaseName.Length) == BaseName)
            {
                return text.Substring(BaseName.Length);
            }
            return text;
        }
        private void Write(string saveFilename)
        {
            var output = new List<string>();
            var indent = 0;
            foreach (var line in Lines)
            {
                var draw = "";
                if (line.Tab < 0)
                {
                    indent += line.Tab;
                }
                for (var i = 0; i < indent; i++)
                {
                    draw += "    ";
                }
                draw += line.Text;
                if (line.Tab > 0)
                {
                    indent += line.Tab;
                }
                output.Add(draw);
            }

            var text = String.Join("\r\n", output);
            var save = true;
            if (File.Exists(saveFilename))
            {
                var current = File.ReadAllText(saveFilename);
                if (current == text)
                {
                    save = false;
                }
            }
            if (save)
            {
                File.WriteAllText(saveFilename, text);
            }

        }

    }
}
