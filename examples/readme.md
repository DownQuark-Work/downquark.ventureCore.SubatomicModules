# Submodules
_This is a work in progress._
> All CLI instructions assume you are starting from the `/examples` directory.

The envisioned end result is that through this `examples` directory you will find examples and use cases relating to running the submodules found within this repo.



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