import { assertEquals, Denops, test } from "../deps.ts";
import { ensureBuffer } from "./ensures.ts";

test({
  mode: "all",
  name: "ensure when not exist buffer",
  fn: async (denops: Denops) => {
    const bufname = "test";
    await ensureBuffer(denops, "vnew", bufname, async () => {
      await denops.cmd("setlocal ft=json");
    });

    const winid = await denops.call("bufwinid", bufname);
    assertEquals(winid, 1001);
    const ft = await denops.call("win_execute", winid, "echo &ft") as string;
    assertEquals(ft.trim(), "json");
  },
});

test({
  mode: "all",
  name: "ensure when existed buffer",
  fn: async (denops: Denops) => {
    const bufname = "test";
    await denops.cmd(`new ${bufname}`);
    await ensureBuffer(denops, "new", bufname);

    const winid = await denops.call("bufwinid", bufname);
    assertEquals(winid, 1001);
  },
});

test({
  mode: "all",
  name: "ensure when none display buffer",
  fn: async (denops: Denops) => {
    const bufname = "test";
    await denops.cmd(`new ${bufname}`);
    await denops.cmd("bw");
    await ensureBuffer(denops, "new", bufname);

    const winid = await denops.call("bufwinid", bufname);
    assertEquals(winid, 1002);
  },
});
