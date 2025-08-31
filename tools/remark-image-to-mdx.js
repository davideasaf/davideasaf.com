import path from "node:path";
import { visit } from "unist-util-visit";

// Helper to create proper MDX expression attribute
function createMdxJsxAttributeValueExpression(value) {
  return {
    type: "mdxJsxAttributeValueExpression",
    value,
    data: {
      estree: {
        type: "Program",
        start: 0,
        end: value.length,
        body: [
          {
            type: "ExpressionStatement",
            start: 0,
            end: value.length,
            expression: {
              type: "Identifier",
              start: 0,
              end: value.length,
              name: value,
            },
          },
        ],
        sourceType: "module",
        comments: [],
      },
    },
  };
}

export default function remarkImageToMdx(_opts = {}) {
  const defaults = {
    widths: [320, 640, 960, 1280],
    formats: ["avif", "webp", "jpg"],
    quality: 82,
    defaultSizes: "100vw",
  };

  const parseTitle = (title) => {
    if (!title) return {};
    const out = {};
    title
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((pair) => {
        const [k, ...rest] = pair.split("=");
        const key = (k || "").trim().toLowerCase();
        const value = rest.join("=").trim();
        if (!key || !value) return;
        out[key] = value;
      });
    return out;
  };

  const toArray = (val) =>
    Array.isArray(val)
      ? val
      : typeof val === "string"
        ? val
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

  return (tree, _file) => {
    const imports = [];
    let counter = 0;

    visit(tree, "image", (node, index, parent) => {
      if (!parent) return;
      const src = node.url;
      if (!src) return;

      const attrs = parseTitle(node.title);
      const widths = toArray(attrs.widths).map(Number).filter(Boolean);
      const formats = toArray(attrs.formats);
      const q = Number(attrs.q) || defaults.quality;
      const sizes = attrs.sizes || defaults.defaultSizes;

      const finalWidths = widths.length ? widths : defaults.widths;
      const finalFormats = formats.length ? formats : defaults.formats;

      // Skip SVGs - they don't need optimization
      if (src.endsWith(".svg")) return;

      // Handle both absolute paths from root (/src/assets/...) and relative paths
      let importPath = src;
      if (src.startsWith("/src/assets/")) {
        // Use the absolute path directly - Vite can handle this with the @ alias
        importPath = src.replace("/src/", "@/");
      } else if (src.startsWith("../../src/assets/")) {
        // Convert relative path to use @ alias for better Vite compatibility
        importPath = src.replace("../../src/", "@/");
      }

      const varName = `__img${counter++}`;
      const query = `?w=${finalWidths.join(";")}&format=${finalFormats.join(";")}&as=picture&quality=${q}`;
      const fullImportPath = path.posix.normalize(importPath) + query;
      imports.push(`import ${varName} from '${fullImportPath}';`);

      parent.children[index] = {
        type: "mdxJsxFlowElement",
        name: "ResponsiveImage",
        attributes: [
          {
            type: "mdxJsxAttribute",
            name: "data",
            value: createMdxJsxAttributeValueExpression(varName),
          },
          { type: "mdxJsxAttribute", name: "alt", value: node.alt ?? "" },
          { type: "mdxJsxAttribute", name: "sizes", value: sizes },
        ],
        children: [],
      };
    });

    if (imports.length) {
      // Add ResponsiveImage import and image imports with proper ESTree AST
      const componentImport = `import { ResponsiveImage } from '@/components/ResponsiveImage';`;
      const allImports = [componentImport, ...imports].join("\n");

      // Create proper ESTree AST for the imports
      const importDeclarations = [];

      // ResponsiveImage import
      importDeclarations.push({
        type: "ImportDeclaration",
        specifiers: [
          {
            type: "ImportSpecifier",
            imported: { type: "Identifier", name: "ResponsiveImage" },
            local: { type: "Identifier", name: "ResponsiveImage" },
          },
        ],
        source: {
          type: "Literal",
          value: "@/components/ResponsiveImage",
          raw: "'@/components/ResponsiveImage'",
        },
      });

      // Image imports
      imports.forEach((importStatement, _index) => {
        const match = importStatement.match(/import\s+(\w+)\s+from\s+['"]([^'"]+)['"];?/);
        if (match) {
          const [, varName, importPath] = match;
          importDeclarations.push({
            type: "ImportDeclaration",
            specifiers: [
              {
                type: "ImportDefaultSpecifier",
                local: { type: "Identifier", name: varName },
              },
            ],
            source: { type: "Literal", value: importPath, raw: `'${importPath}'` },
          });
        }
      });

      tree.children.unshift({
        type: "mdxjsEsm",
        value: allImports,
        data: {
          estree: {
            type: "Program",
            start: 0,
            end: allImports.length,
            body: importDeclarations,
            sourceType: "module",
            comments: [],
          },
        },
      });
    }
  };
}
