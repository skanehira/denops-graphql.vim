import { path } from "./deps.ts";
import xdg from "https://deno.land/x/xdg@v9.4.0/src/mod.deno.ts";

export const configFile = path.join(
  xdg.config(),
  "denops_graphql",
  "config.json",
);

export type HttpConfigs = [
  {
    endpoint: string;
    headers: {
      key: string;
      value: string;
    };
  },
];

export async function readConfig(): Promise<HttpConfigs> {
  const body = await Deno.readTextFile(configFile);
  return JSON.parse(body) as HttpConfigs;
}
