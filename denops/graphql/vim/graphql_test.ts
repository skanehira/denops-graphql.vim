import { assertEquals, Denops, test } from "../deps.ts";
import { execute, setEndpoint } from "./graphql.ts";

const testEndpoint =
  "https://swapi-graphql.netlify.app/.netlify/functions/index";

test({
  mode: "nvim",
  name: "execute without variables",
  fn: async (denops: Denops) => {
    const bufname = "test.graphql";
    await denops.cmd(`new ${bufname}`);
    const q = `
query Query {
  allFilms(first: 1) {
    films {
      title
    }
  }
}    `;

    await denops.call("setline", 1, q);
    await setEndpoint(
      denops,
      testEndpoint,
    );
    await execute(denops);
    const got =
      (await denops.call("getbufline", `${bufname}.output`, 1, "$") as string[])
        .join(
          "\n",
        );

    const want = await Deno.readTextFile(
      "denops/graphql/vim/testdata/output.json",
    );

    assertEquals(JSON.parse(got), JSON.parse(want));
  },
  timeout: 3000,
});

test({
  mode: "nvim",
  name: "execute with variables",
  fn: async (denops: Denops) => {
    const bufname = "test.graphql";
    await denops.cmd(`new ${bufname}`);
    const q = `
query Query($limit: Int!) {
  allFilms(first: $limit) {
    films {
      title
    }
  }
}    `;
    const oldwin = await denops.call("win_getid");
    await denops.call("setline", 1, q);
    await denops.cmd(`new ${bufname}.variables`);
    await denops.call("setline", 1, `{"limit": 1}`);
    await denops.call("win_gotoid", oldwin);

    await setEndpoint(
      denops,
      testEndpoint,
    );
    await execute(denops);
    const got =
      (await denops.call("getbufline", `${bufname}.output`, 1, "$") as string[])
        .join(
          "\n",
        );

    const want = await Deno.readTextFile(
      "denops/graphql/vim/testdata/output.json",
    );

    assertEquals(JSON.parse(got), JSON.parse(want));
  },
  timeout: 3000,
});
