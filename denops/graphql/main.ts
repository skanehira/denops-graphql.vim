import { autocmd, Denops } from "./deps.ts";
import { edit, editHttpHeader, execute, setEndpoint } from "./graphql.ts";

export async function main(denops: Denops): Promise<void> {
  for (
    const cmd of [
      `command! GraphqlEdit call denops#notify("${denops.name}", "edit", [])`,
      `command! GraphqlExecute call denops#notify("${denops.name}", "execute", [])`,
      `command! -nargs=1 GraphqlSetEndpoint call denops#notify("${denops.name}", "setEndpoint", [<f-args>])`,
      `command! GraphqlEditHttpHeader call denops#notify("${denops.name}", "editHttpHeader", [])`,
    ]
  ) {
    await denops.cmd(cmd);
  }

  autocmd.group(denops, "denops_graphql", (helper) => {
    helper.remove("*");
    helper.define(
      "BufEnter",
      "*.graphql",
      "nnoremap <buffer> <silent> <Plug>(graphql-execute) :GraphqlExecute<CR>",
    );
  });

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

    async editHttpHeader() {
      await editHttpHeader(denops);
    },
  };
}
