import { assertEquals, assertRejects, test } from "./deps_test.ts";
import { Denops } from "./deps.ts";
import { clearEndpoint, edit, execute, setEndpoint } from "./graphql.ts";

const testEndpoint =
  "https://swapi-graphql.netlify.app/.netlify/functions/index";

test({
  mode: "all",
  name: "execute without variables",
  fn: async (denops: Denops) => {
    clearEndpoint();
    const bufname = "test.graphql";
    await denops.cmd(`new ${bufname} | set ft=graphql`);
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
    const got = (await denops.call(
      "getbufline",
      `${bufname}.output.json`,
      1,
      "$",
    ) as string[])
      .join(
        "\n",
      );

    const want = await Deno.readTextFile(
      "denops/graphql/testdata/output.json",
    );

    assertEquals(JSON.parse(got), JSON.parse(want));
  },
});

test({
  mode: "all",
  name: "execute with variables",
  fn: async (denops: Denops) => {
    const bufname = "test.graphql";
    await denops.cmd(`new ${bufname} | set ft=graphql`);
    const q = `
query Query($limit: Int!) {
  allFilms(first: $limit) {
    films {
      title
    }
  }
}    `;
    await denops.call("setline", 1, q);
    await edit(denops);
    await denops.call(
      "setbufline",
      `${bufname}.variables.json`,
      1,
      `{"limit": 1}`,
    );

    await setEndpoint(
      denops,
      testEndpoint,
    );
    await execute(denops);
    const got = (await denops.call(
      "getbufline",
      `${bufname}.output.json`,
      1,
      "$",
    ) as string[])
      .join(
        "\n",
      );

    const want = await Deno.readTextFile(
      "denops/graphql/testdata/output.json",
    );

    assertEquals(JSON.parse(got), JSON.parse(want));
  },
});

test({
  mode: "all",
  name: "execute using endpoint that in comment",
  fn: async (denops: Denops) => {
    clearEndpoint();
    const bufname = "test.graphql";
    await denops.cmd(`new ${bufname} | set ft=graphql`);
    const q =
      `# endpoint: https://swapi-graphql.netlify.app/.netlify/functions/index
query Query {
  allFilms(first: 1) {
    films {
      title
    }
  }
}    `;

    await denops.call("setline", 1, q);
    await execute(denops);
    const got = (await denops.call(
      "getbufline",
      `${bufname}.output.json`,
      1,
      "$",
    ) as string[])
      .join(
        "\n",
      );

    const want = await Deno.readTextFile(
      "denops/graphql/testdata/output.json",
    );

    assertEquals(JSON.parse(got), JSON.parse(want));
  },
});

test({
  mode: "all",
  name: "not found endpoint",
  fn: async (denops: Denops) => {
    clearEndpoint();
    const bufname = "test.graphql";
    await denops.cmd(`new ${bufname} | set ft=graphql`);
    const q = `# endpoint:
query Query {
  allFilms(first: 1) {
    films {
      title
    }
  }
}    `;

    await denops.call("setline", 1, q);

    await assertRejects(
      async () => {
        await execute(denops);
      },
      Error,
      "not found endpoint, please set endpoint by :GraphQLSetEndpoint",
    );
  },
});
