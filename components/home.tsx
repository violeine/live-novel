import { Tab } from "@headlessui/react";
import { DotSpinner } from "@uiball/loaders";
import { useCallback, useRef, useState } from "react";
import { useMutation } from "react-query";
import { ReactReader } from "react-reader";
import { fetchPrompt } from "../utils/fetch";
export interface Options {
  prefix: string;
  postfix: string;
  prompt: string;
  seed: string;
  url: string;
}
export function HomePage() {
  const [location, setLocation] = useState<any>(null);
  const locationChanged = (epubcifi: any) => {
    // epubcifi is a internal string used by epubjs to point to a location in an epub. It looks like this: epubcfi(/6/6[titlepage]!/4/2/12[pgepubid00003]/3:0)
    setLocation(epubcifi);
  };
  const [option, setOption] = useState({
    prefix: "",
    postfix: "",
    prompt: "",
    seed: "1234",
    url: "http://selab.nhtlongcs.com:20628",
  });
  const cleanupRef = useRef<(() => void) | null>(null);
  const readerRef = useCallback((reader: any) => {
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
    function setRenderSelection(cfiRange: any, content: any) {
      setOption((p) => ({
        ...p,
        prompt: reader.getRange(cfiRange).toString(),
      }));
      content.window.getSelection().removeAllRanges();
    }
    reader.on("selected", setRenderSelection);
    cleanupRef.current = () => reader.off("selected", setRenderSelection);
  }, []);

  const createImage = useMutation(fetchPrompt);
  return (
    <div className="h-screen flex gap-4 p-3 border border-gray-400">
      <div className="h-full flex-1 flex-shrink-0 shadow-sm py-3 rounded-md border border-gray-200">
        <ReactReader
          showToc={false}
          url="https://react-reader.metabits.no/files/alice.epub"
          locationChanged={locationChanged}
          getRendition={(reader) => readerRef(reader)}
        />
      </div>
      <Tab.Group
        as="div"
        className="min-w-[768px] space-y-2 h-full flex flex-col"
      >
        <Tab.List className="space-x-2 font-semibold text-slate-600 flex justify-center">
          <Tab className="px-3 py-2 bg-slate-200 rounded-lg">Prompt</Tab>
        </Tab.List>
        <Tab.Panels as="div" className="h-full flex-1">
          <Tab.Panel
            as="div"
            className="flex flex-col max-w-[768px] gap-3 flex-1 h-full"
          >
            <div className="flex flex-col justify-between gap-2">
              <div className="space-x-2 flex items-center">
                <label
                  htmlFor="prefix"
                  className="font-medium text-slate-700 w-14"
                >
                  Prefix
                </label>
                <input
                  type="text"
                  name="prefix"
                  id="prefix"
                  value={option.prefix}
                  onChange={(e) =>
                    setOption((p) => ({ ...p, prefix: e.target.value }))
                  }
                  placeholder="An illustration about..."
                  className="p-2 rounded border focus:border-slate-500 focus:outline-none flex-1"
                />
              </div>
              <div className="space-x-2 flex">
                <label
                  htmlFor=""
                  className="font-medium text-slate-700 w-14 pt-2"
                >
                  Prompt
                </label>
                <textarea
                  rows={4}
                  name="prompt"
                  id="prompt"
                  value={option.prompt.replace(/\s/g, " ")}
                  onChange={(e) =>
                    setOption((p) => ({ ...p, prompt: e.target.value }))
                  }
                  className="p-2 whitespace-normal h-auto border border-slate-200 rounded focus:border-slate-500 focus:outline-none flex-1"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label
                  htmlFor="postfix"
                  className="font-medium text-slate-700 w-14"
                >
                  Postfix
                </label>
                <input
                  type="text"
                  id="postfix"
                  name="postfix"
                  value={option.postfix}
                  onChange={(e) =>
                    setOption((p) => ({ ...p, postfix: e.target.value }))
                  }
                  placeholder="highly detailed, trending on artstation, by van gogh,..."
                  className="p-2 rounded border focus:border-slate-500 focus:outline-none flex-1"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="seed"
                    className="font-medium text-slate-700 w-14"
                  >
                    Seed
                  </label>
                  <input
                    id="seed"
                    name="seed"
                    value={option.seed}
                    onChange={(e) =>
                      setOption((p) => ({ ...p, seed: e.target.value }))
                    }
                    type="text"
                    className="p-2 rounded border focus:border-slate-500 focus:outline-none"
                  />
                </div>
                <button
                  className="bg-green-300 px-3 py-2 rounded text-green-900 font-medium"
                  onClick={() => createImage.mutate(option)}
                >
                  Submit
                </button>
              </div>
            </div>
            {createImage.isLoading && (
              <div className="flex-1 h-full w-full flex items-center justify-center">
                <DotSpinner />
              </div>
            )}
            <img src={createImage.data} alt="" className="rounded" />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
