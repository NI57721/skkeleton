import { splitSequentialKeys } from "./util.ts";
import { assertEquals } from "./deps/std/testing.ts";

type Tests = [string, string[]][];

Deno.test({
  name: "splitSequentialKeys",
  fn() {
    const tests: Tests = [
      ["", []],
      ["hoge", ["h", "o", "g", "e"]],
      ["<CR>", ["<CR>"]],
      ["ho<CR>", ["h", "o", "<CR>"]],
      ["<CR>ge", ["<CR>", "g", "e"]],
      ["ho<CR>ge", ["h", "o", "<CR>", "g", "e"]],
      ["ho<CR", ["h", "o", "<", "C", "R"]],
      ["CR>ge", ["C", "R", ">", "g", "e"]],
      ["<<CR>>", ["<", "<CR>", ">"]],
    ];
    for (const test of tests) {
      assertEquals(splitSequentialKeys(test[0]), test[1]);
    }
  },
});
