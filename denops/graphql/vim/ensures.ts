import { Denops } from "../deps.ts";

export async function ensureBuffer(
  denops: Denops,
  opencmd: string,
  bufname: string,
  init?: () => Promise<void>,
): Promise<void> {
  const exist = await denops.call("bufexists", bufname);
  const display = (await denops.call("bufwinid", bufname) as number) !== -1;

  if (!display) {
    const oldwin = await denops.call("win_getid");
    await denops.cmd(`${opencmd} ${bufname}`);
    if (!exist && init) {
      await init();
    }
    await denops.call("win_gotoid", oldwin);
  }
}
