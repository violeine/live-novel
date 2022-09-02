import { Options } from "../components/home";
import { promptToSHA1 } from "./hash";

export const fetchPrompt = async (o: Options): Promise<string> => {
  const prompt = `${o.prefix} ${o.prompt} ${o.postfix}`;
  const session = await promptToSHA1(prompt + o.seed);

  const URL = `${o.url}/create?sess_name=${session}&prompt=${prompt}&seed=${o.seed}&ratio=4x6`;
  const create = await fetch(URL, {
    method: "POST",
  });
  const result = await fetch(`${o.url}/result?sess_name=${session}`, {
    method: "POST",
  }).then((res) => res.json());
  return `data:image/png;base64,${btoa(result.image)}`;
};
