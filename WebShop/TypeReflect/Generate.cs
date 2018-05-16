using Microsoft.Extensions.FileProviders;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
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

        public void Run()
        {
            Console.WriteLine("TypeReflect run");

            var enums = Assembly.GetExecutingAssembly()
                    .GetTypes()
                    .Where(t => t.IsEnum && t.IsPublic)
                    .Where(x => x.GetCustomAttributes(typeof(Enum), false).Length > 0)
                    .ToArray();

            foreach (var en in enums)
            {
                Console.WriteLine("enum = " + en.FullName);
                var fields = en.GetFields();
                foreach (var field in fields)
                {
                    if (field.Name.Equals("value__")) continue;
                    Console.WriteLine("  " + field.Name + " = " + field.GetRawConstantValue());
                }
            }

            var dtos = Assembly.GetExecutingAssembly()
                .GetTypes()
                .Where(x => x.GetCustomAttributes(typeof(Dto), false).Length > 0)
                .ToArray();

            foreach (var dto in dtos)
            {
                OpenInterface(dto.FullName);
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
                CloseInterface();
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
                    AddLine(1, "\"" + RemoveBase(type.FullName) + "." + api.Name + "\": {");
                    AddLine(0, "query: " + TypeName(api.GetParameters().First().ParameterType) + ",");
                    AddLine(0, "result: " + TypeName(api.ReturnType.GenericTypeArguments.First()));
                    AddLine(-1, "},");
                }
            }
            AddLine(-1, "}");

            Write();

            var file = Directory.GetCurrentDirectory().ToString() + @"\webapp\src\contracts.ts";
            Console.WriteLine(file);

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

        private void OpenInterface(string fullName)
        {
            var tree = fullName.Split(".");
            var name = tree.Last();
            var list = tree.ToList();
            list.RemoveAt(tree.Count() - 1);
            OpenNamespace(RemoveBase(String.Join(".", list)));
            AddLine(1, "export interface " + name + " {");
        }

        private void CloseInterface()
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
            if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(List<>))
            {
                var genericTypes = type.GenericTypeArguments;
                var inner = TypeName(genericTypes[0]);
                return "ReadonlyArray<" + inner + ">";
            }
            if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(Dictionary<,>))
            {
                var genericTypes = type.GenericTypeArguments;
                var inner = TypeName(genericTypes[1]);
                return "ReadonlyDictionary<" + inner + ">";
            }
            if (type.FullName.Substring(0, BaseName.Length) == BaseName)
            {
                return RemoveBase(type.FullName);
            }
            throw new Exception("TypeReflect: Cannot workout type name");
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
        private void Write()
        {
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
                Console.WriteLine(draw);
            }
        }

    }
}
