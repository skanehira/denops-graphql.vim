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
      try {
        await edit(denops);
      } catch (e) {
        console.error(e);
      }
    },

    async execute() {
      try {
        await execute(denops);
      } catch (e) {
        console.error(e);
      }
    },

    async setEndpoint(arg: unknown) {
      try {
        await setEndpoint(denops, arg);
      } catch (e) {
        console.error(e);
      }
    },

    async editHttpHeader() {
      try {
        await editHttpHeader(denops);
      } catch (e) {
        console.error(e);
      }
    },
  };
}
