import { useQuery } from "react-query";
import { fetchPrompt, Options } from "../utils/fetch";

export const PromptImage = (option: Options) => {
  const result = useQuery(
    ["prompt", option],
    async () => await fetchPrompt(option),
    {
      enabled: option.prompt !== "",
    }
  );
  return (
    <div className="h-[512px]">
      {result.isLoading ? (
        <div>loading</div>
      ) : (
        <img src={result.data} className="aspect-[6/4] w-[768px] h-[512px]" />
      )}
    </div>
  );
};
