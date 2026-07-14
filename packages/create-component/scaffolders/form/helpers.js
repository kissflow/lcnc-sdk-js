import path from "path";
import { fileURLToPath } from "url";

// The form scaffold is React-only — `useForm` is a React hook, so there's
// no vanilla-JS template to choose between (unlike the `page` scaffolder).
const getTemplatePath = () => {
  const currentModuleFile = fileURLToPath(import.meta.url);
  const currentModuleDirectory = path.dirname(currentModuleFile);
  return path.resolve(currentModuleDirectory, "./template/");
};

export { getTemplatePath };
