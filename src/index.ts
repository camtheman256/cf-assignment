/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Router } from "itty-router";

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
  DB: KVNamespace;
}

const router = Router();

export default {
  fetch: router.handle,
};

router.get("/", async () => {
  return new Response("Hello world!");
});

router.post("/traffic-change", async (request, env: Env) => {
  const req = request as unknown as Request;
  const csvData = await req.text();
  const jsonData = convertCsvToJson(csvData);
  env.DB.put("traffic-change", JSON.stringify(jsonData));
  return Response.json(jsonData);
});

router.get("/traffic-change", async (request, env: Env) => {
  return Response.json(await env.DB.get("traffic-change", "json"));
});

router.post("/popular-domains", async (request, env: Env) => {
  const req = request as unknown as Request;
  const csvData = await req.text();
  const [headers, ...domains] = csvData.split("\n").map(parseCsvLine);
  domains.pop(); // remove empty line at the end
  const jsonData = {
    rankedDomains: domains.map((d) =>
      Object.fromEntries(d.map((v, i) => [headers[i], v]))
    ),
  };
  env.DB.put("popular-domains", JSON.stringify(jsonData));
  return Response.json(jsonData);
});

router.get("/popular-domains", async (request, env: Env) => {
  return Response.json(await env.DB.get("popular-domains", "json"));
});

router.all("*", () => new Response("404 Not Found", { status: 404 }));

/**
 * Parses a line of a CSV file to an array of strings
 * @param line a line of a CSV file, comma separated
 * @returns an array of strings
 */
function parseCsvLine(line: string): string[] {
  const out = [];
  let buffer = "";
  let detectCommas = true;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') {
      detectCommas = !detectCommas;
    } else if (!detectCommas || line[i] !== ",") {
      buffer += line[i];
    } else {
      out.push(buffer);
      buffer = "";
    }
  }
  out.push(buffer);
  return out;
}

/**
 * Inflates an object at the path specified by tree and stores the given value at that spot
 * @param obj an empty object
 * @param tree an array of path values to nest into the object
 * @param value the value to store at that path
 */
function inflateAndStore(obj: any, tree: string[], value: any) {
  let nestedObj = obj;
  for (let i = 0; i < tree.length - 1; i++) {
    if (nestedObj[tree[i]] === undefined) {
      // Next path is only digits, so we should use an array instead of an object
      nestedObj[tree[i]] = /^\d+$/.test(tree[i + 1]) ? [] : {};
    }
    nestedObj = nestedObj[tree[i]];
  }
  nestedObj[tree[tree.length - 1]] = value;
}

/**
 * Converts CSV files with a specific format to JSON.
 *
 * The first column has a header of _key and two values, `data` and `meta`.
 * The paths in the top row are forward-slash separated, such as a/b/0/c.
 * The strings are interpreted as keys in an object, whereas the numbers are interpreted
 * as indices in an array.
 *
 * @param csvString a string containing the CSV file
 * @returns an object representing the data stored in the CSV file
 */
function convertCsvToJson(csvString: string) {
  const lines = csvString.split("\n");
  const [keys, data, meta] = lines.map(parseCsvLine);
  const obj: any = {};
  obj[data[0]] = {};
  obj[meta[0]] = {};
  for (let i = 1; i < keys.length; i++) {
    const tree = keys[i].split("/");
    if (data[i] !== "") {
      inflateAndStore(obj[data[0]], tree, data[i]);
    }
    if (meta[i] !== "") {
      inflateAndStore(obj[meta[0]], tree, meta[i]);
    }
  }
  return obj;
}
