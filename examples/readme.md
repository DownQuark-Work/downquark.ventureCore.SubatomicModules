# Submodules
_This is a work in progress._
> All CLI instructions assume you are starting from the `/examples` directory.

The envisioned end result is that through this `examples` directory you will find examples and use cases relating to running the submodules found within this repo.

The files and scripts run from here are not intended to be exhaustive, or even cover all basic methods available. They are to be used more as a reference to sping up _quick start_ process. There will be an attempt to ensure each example covers both a basic `module` and `CLI` implementation.

> NOTE: To keep the source files clean the `example` part of the `CLI` implementation will handle the _"return value"_ \(I know) of the script as it is called directly from the command line.
> > e.g.: `% deno run iterables/array/grid.cli.ts $(deno run ../_dq/_run/array.grid.ts -w 42 -h 13)` is the equivalent of
> > running the submodule script directly: `% deno run ../_dq/_run/array.grid.ts -w 42 -h 13`
> > then running the example file: `% deno run iterables/array/grid.cli.ts` using the output of the submodule script as `arg[0]`

## API
### NPM
> Currently only `CLI` is supported
```bash
  deno run --allow-net api/npm.ts --pkg qonsole -- pkgStatsDownloaded
  deno run --allow-net api/npm.ts --pkg chalk -- pkgStatsDownloaded
  deno run --allow-net api/npm.ts --pkg @vue/shared -- pkgStatsDownloaded
```

## Array
### CLI
> NOTE: configuration options are currently not supported using `CLI`
```bash
deno run iterables/array/grid.cli.ts $(deno run ../_dq/_run/array.grid.ts -w 42 -h 13)
deno run iterables/array/grid.cli.ts $(deno run ../_dq/_run/array.grid.ts -w 13 -h 8)
```
### module
`% deno run iterables/array/grid.mod.ts`

## PRNG & Seed
### CLI
```bash
deno run iterables/seed.cli.ts $(deno run ../_dq/_run/prng.seed.ts 230)
deno run iterables/seed.cli.ts $(deno run ../_dq/_run/prng.seed.ts 230 --seed 13)
deno run iterables/seed.cli.ts $(deno run ../_dq/_run/prng.seed.ts 230 --seed 13 --v3b 13,42)
```
### module
`% deno run iterables/seed.mod.ts`

## Maze
> Opinionated for `Gaming`.
> > Incorporates **PRNG & Seed** by default.
### CLI
> _carved_ maze by default
```bash
deno run maze/_base.cli.ts -w 30 -h 15
```
### module
> _bordered_ maze by default
> > assumes [caddy](https://www.caddyserver.com) is installed
`% deno run --allow-write maze/_base.mod.ts -w 30 -h 15 --export-path 'maze/_html' && open http://0.0.0.0:1313/maze/_html/base.bordered.html && caddy file-server --listen :1313`