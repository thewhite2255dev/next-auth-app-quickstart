import fs from "fs";
import path from "path";

function scanAppRoutes(): {
  route: string;
  type: "public" | "protected" | "admin" | null;
}[] {
  const routes: {
    route: string;
    type: "public" | "protected" | "admin" | null;
  }[] = [];
  const appDir = path.join(process.cwd(), "app");

  function scanDirectory(
    dir: string,
    baseRoute = "",
    parentGroup: "public" | "protected" | "admin" | null = null,
  ) {
    if (!fs.existsSync(dir)) return;

    const items = fs.readdirSync(dir);

    for (const item of items) {
      if (
        item.startsWith("_") ||
        item === "api" ||
        item.startsWith(".") ||
        item === "components"
      )
        continue;

      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        let routeSegment = item;
        let currentGroup = parentGroup;

        // 📦 [slug] → :slug
        if (item.startsWith("[") && item.endsWith("]")) {
          routeSegment = `:${item.slice(1, -1)}`;
        }
        // 🪶 (group) → définir le type et ne pas ajouter au route
        else if (item.startsWith("(") && item.endsWith(")")) {
          const groupName = item.slice(1, -1);
          if (
            groupName === "public" ||
            groupName === "protected" ||
            groupName === "admin"
          ) {
            currentGroup = groupName;
          }
          routeSegment = "";
        }

        const newBaseRoute = path.posix.join(baseRoute, routeSegment);
        scanDirectory(fullPath, newBaseRoute, currentGroup);
      } else if (/^page\.(tsx|ts|jsx|js)$/.test(item)) {
        let route = baseRoute || "/";
        route = route.replace(/\\/g, "/").replace(/\/+/g, "/");

        if (!routes.find((r) => r.route === route)) {
          routes.push({ route, type: parentGroup });
        }
      }
    }
  }

  scanDirectory(appDir);
  return routes.sort((a, b) => a.route.localeCompare(b.route));
}

function generateRoutesFile() {
  console.log("🔍 Scanning app directory for routes...");

  const scannedRoutes = scanAppRoutes();
  console.log(
    "📋 Found routes:",
    scannedRoutes.map((r) => r.route),
  );

  // Classification automatique à partir du groupe
  const routesConfig = {
    public: scannedRoutes
      .filter((r) => r.type !== "protected" && r.type !== "admin")
      .map((r) => r.route),
    protected: scannedRoutes
      .filter((r) => r.type === "protected")
      .map((r) => r.route),
    auth: scannedRoutes
      .filter((r) => r.route.includes("/auth/"))
      .map((r) => r.route),
    admin: scannedRoutes.filter((r) => r.type === "admin").map((r) => r.route),
    generatedAt: new Date().toISOString(),
  };

  // 🧾 Format final propre et typé
  const output = `// ⚠️ Auto-generated file. Do not edit manually.
// Run "pnpm generate-routes" to update.

export const generatedRoutes = {
  public: ${JSON.stringify(routesConfig.public, null, 2)},
  protected: ${JSON.stringify(routesConfig.protected, null, 2)},
  auth: ${JSON.stringify(routesConfig.auth, null, 2)},
  admin: ${JSON.stringify(routesConfig.admin, null, 2)},
  generatedAt: '${routesConfig.generatedAt}'
} as const;

export type GeneratedRoutes = typeof generatedRoutes;
`;

  const libDir = path.join(process.cwd(), "lib");
  fs.mkdirSync(libDir, { recursive: true });

  const outputPath = path.join(libDir, "generated-routes.ts");
  fs.writeFileSync(outputPath, output);

  console.log("✅ Routes generated successfully!");
  console.table({
    public: routesConfig.public.length,
    protected: routesConfig.protected.length,
    auth: routesConfig.auth.length,
    admin: routesConfig.admin.length,
    total: scannedRoutes.length,
    output: outputPath,
  });
}

// 🚀 Run
generateRoutesFile();
