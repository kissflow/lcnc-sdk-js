# create-component

`create-component` is a cli tool that lets developers scaffold custom component projects - minimal frontend projects that seamlessly integrate with Kissflow's products and extend its functionality.

## To scaffold a custom component project,

```bash
npx @kissflow/create-component@latest
```

## Non-interactive usage

Any value not supplied as a flag falls back to an interactive prompt, unless `--yes` is set (then a missing required value is an error instead of a prompt). Useful for AI agents or CI.

| Flag          | Description                                                           |
| ------------- | --------------------------------------------------------------------- |
| `--name`      | Project name.                                                         |
| `--target`    | `page`, `form`, or `form-field`.                                      |
| `--framework` | `page` target only. `HTML` or `React`.                                |
| `--yes`, `-y` | Run non-interactively; error instead of prompting for missing values. |

```bash
npx @kissflow/create-component@latest --target page --framework React --name my-page --yes
npx @kissflow/create-component@latest --target form --name my-form --yes
npx @kissflow/create-component@latest --target form-field --name my-field --yes
```
