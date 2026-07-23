# create-app

`create-app` is a cli tool that lets developers scaffold a Kissflow custom app project - a minimal frontend project that seamlessly integrates with Kissflow's products and extends its functionality.

## To scaffold a custom app project,

```bash
npx @kissflow/create-app@latest
```

## Non-interactive usage

Any value not supplied as a flag falls back to an interactive prompt, unless `--yes` is set (then a missing required value is an error instead of a prompt). Useful for AI agents or CI.

| Flag          | Description                                                            |
| ------------- | -------------------------------------------------------------------------|
| `--name`      | Project name.                                                            |
| `--yes`, `-y` | Run non-interactively; error instead of prompting for missing values.    |

```bash
npx @kissflow/create-app@latest --name my-app --yes
```
