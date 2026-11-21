# Release

## Steps

1. Describe the change.

   ```sh
   npm run changeset:add
   ```

2. Apply it.

   ```sh
   npm run changeset:bump
   ```

3. Commit the new version.

   ```sh
   git commit -am "Release x.y.z"
   ```

4. Publish.

   ```sh
   npm run build:release
   ```

See [scripts.md](./scripts.md) for what each script does.

## Requirements

- Logged in to npm (`npm login`) with an account that can publish `react-scrim`.
- The package is public: `access` is `public` in `.changeset/config.json`.
