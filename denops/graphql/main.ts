import { Denops } from "./deps.ts";
import { edit, execute, setEndpoint } from "./vim/graphql.ts";

export async function main(denops: Denops): Promise<void> {
  for (
    const cmd of [
      `command! GraphqlEdit call denops#notify("${denops.name}", "edit", [])`,
      `command! GraphqlExecute call denops#notify("${denops.name}", "execute", [])`,
      `command! -nargs=1 GraphqlSetEndpoint call denops#notify("${denops.name}", "setEndpoint", [<f-args>])`,
    ]
  ) {
    await denops.cmd(cmd);
  }

  denops.dispatcher = {
    async edit() {
      await edit(denops);
    },

    async execute() {
      await execute(denops);
    },

    async setEndpoint(arg: unknown) {
      await setEndpoint(denops, arg);
    },
  };
}
