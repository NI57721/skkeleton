import { test } from "./deps/denops_test.ts";
import { assertEquals } from "./deps/std/testing.ts";
import { currentLibrary } from "./store.ts";
import { currentContext } from "./store.ts";
import { initDenops } from "./testutil.ts";

test({
  mode: "nvim", // can input mode test only in nvim
  name: "registerKeyMap",
  pluginName: "skkeleton",
  async fn(denops) {
    await initDenops(denops);
    const lib = await currentLibrary.get();
    lib.registerCandidate("okurinasi", "あ", "亜");
    await denops.cmd('call skkeleton#register_keymap("henkan", "x", "")');
    await denops.cmd(
      'call skkeleton#register_keymap("henkan", "<BS>", "henkanBackward")',
    );

    // Note: `skkeleton#handle` requires consistency of vim buffer and pre-edit buffer.
    await denops.cmd("startinsert");

    // fallback to default mapping because "x" was unmapped
    await denops.cmd('call skkeleton#handle("handleKey", {"key": "A"})');
    await denops.cmd('call skkeleton#handle("handleKey", {"key": " "})');
    await denops.cmd('call skkeleton#handle("handleKey", {"key": "x"})');
    assertEquals(currentContext.get().toString(), "x");

    currentContext.init().denops = denops;

    // backward state with <BS>
    await denops.cmd('call skkeleton#handle("handleKey", {"key": "A"})');
    await denops.cmd('call skkeleton#handle("handleKey", {"key": " "})');
    await denops.cmd('call skkeleton#handle("handleKey", {"key": "<bs>"})');
    assertEquals(currentContext.get().toString(), "▽あ");
  },
});

test({
  mode: "all",
  name: "send multiple keys into handleKey",
  pluginName: "skkeleton",
  async fn(denops) {
    await initDenops(denops);
    const lib = await currentLibrary.get();
    lib.registerCandidate("okurinasi", "われ", "我");
    lib.registerCandidate("okuriari", "おもu", "思");

    await denops.cmd('call skkeleton#handle("handleKey", {"key": "Ware"})');
    assertEquals(currentContext.get().toString(), "▽われ");

    currentContext.init().denops = denops;

    await denops.cmd('call skkeleton#handle("handleKey", {"key": "OmoU"})');
    assertEquals(currentContext.get().toString(), "▼思う");
  },
});
