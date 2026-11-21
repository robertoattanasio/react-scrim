# Scripts

## Development

### `npm run dev`

```sh
tsc --watch --preserveWatchOutput
```

Compiles `src` into `dist` and recompiles on every save. Use it while a project consumes the package locally.

### `npm run build`

```sh
rm -rf dist && tsc
```

Empties `dist` and compiles `src` into it: JavaScript, `.d.ts` declarations and source maps.

### `npm run ts:check`

```sh
tsc --noEmit
```

Type-checks `src` without writing any file.

## Release

### `npm run changeset:add`

```sh
changeset
```

Asks for the bump (patch, minor, major) and a summary, and writes them in `.changeset/`.

### `npm run changeset:bump`

```sh
changeset version
```

Consumes the files in `.changeset/`: bumps `version` in `package.json` and adds the summary to `CHANGELOG.md`.

### `npm run build:release`

```sh
npm run ts:check && npm run build && npm pack && changeset publish && git push --follow-tags
```

Stops at the first step that fails.

| Step                     | Does                                                             |
| ------------------------ | ---------------------------------------------------------------- |
| `npm run ts:check`       | type-checks                                                      |
| `npm run build`          | compiles                                                         |
| `npm pack`               | writes the `.tgz` that would be published, to check its contents |
| `changeset publish`      | publishes the version in `package.json` to npm and tags it       |
| `git push --follow-tags` | pushes the commits and the tag                                   |

Needs to be logged in to npm with an account that can publish `react-scrim`.
