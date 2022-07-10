import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { ReactReader } from "react-reader";
import { Ring } from "@uiball/loaders";
import { Tab } from "@headlessui/react";

export function HomePage() {
  const [location, setLocation] = useState<any>(null);
  const [selections, setSelections] = useState<any[]>([]);
  const [img, setImg] = useState<any>(null);
  const [settings, setSettings] = useState({
    url: "http://nhtlongcs.com:5000",
    style: "watercolor",
    seed: 1234,
  });
  const locationChanged = (epubcifi: any) => {
    // epubcifi is a internal string used by epubjs to point to a location in an epub. It looks like this: epubcfi(/6/6[titlepage]!/4/2/12[pgepubid00003]/3:0)
    setLocation(epubcifi);
  };

  const renditionRef = useRef<any>(null);

  useQueryClient();

  const createImage = useMutation(
    async (prompt: string) => {
      const result = await fetch(settings.url, {
        method: "POST",
        body: JSON.stringify({
          text: prompt.replace(/^\s*|\s(?=\s)|\s*$/g, "").replace(/[\t]/g, " "),
          style: settings.style,
          seed: settings.seed,
        }),
      })
        .then((res) => res.blob())
        .then((b) => URL.createObjectURL(b));
      return result;
    },
    {
      onSuccess: (res) => {
        setImg(res);
      },
    }
  );

  useEffect(() => {
    if (renditionRef.current) {
      const rendition = renditionRef.current;
      const setRenderSelection = (cfiRange: any, contents: any) => {
        const text = renditionRef.current.getRange(cfiRange).toString();
        console.log(text);
        setSelections((p) =>
          p.concat({
            text,
            cfiRange,
          })
        );
        //send request here
        createImage.mutate(text);
        renditionRef.current.annotations.add(
          "highlight",
          cfiRange,
          {},
          null,
          "hl"
        );
        contents.window.getSelection().removeAllRanges();
      };
      rendition.on("selected", setRenderSelection);
      return () => rendition.off("selected", setRenderSelection);
    }
  }, [selections, setSelections, createImage]);

  return (
    <div className="flex items-center bg-slate-100">
      <div className="w-1/2 h-screen shadow-lg py-3 rounded-lg">
        <ReactReader
          location={location}
          locationChanged={locationChanged}
          url="https://react-reader.metabits.no/files/alice.epub"
          getRendition={(rendition) => {
            renditionRef.current = rendition;
            setSelections([]);
          }}
        />
      </div>
      <div className="w-1/2 h-screen px-8 py-3 flex flex-col space-y-8">
        <div className="space-y-3 overflow-y-scroll h-1/2 py-3 px-4 rounded border border-slate-200 bg-slate-50">
          {selections.map(({ text, cfiRange }, i) => {
            return (
              <p
                key={i}
                className="bg-white p-3 rounded shadow text-slate-800 cursor-pointer border-slate-200"
                onClick={() => {
                  renditionRef.current.display(cfiRange);
                }}
              >
                {text}
              </p>
            );
          })}
        </div>
        <div>
          <Tab.Group>
            <Tab.List className="space-x-2 pb-2 text-slate-700">
              <Tab
                className={({ selected }) =>
                  ` px-2 hover:bg-slate-200 w-24 font-semibold
                  ${
                    selected
                      ? "border-b border-b-slate-700 hover:rounded-t text-slate-700"
                      : "hover:rounded hover:text-slate-700 text-slate-500"
                  }`
                }
              >
                Image
              </Tab>
              <Tab
                className={({ selected }) =>
                  ` px-2 hover:bg-slate-200 w-24 font-semibold
                  ${
                    selected
                      ? "border-b border-b-slate-700 hover:rounded-t text-slate-700"
                      : "hover:rounded hover:text-slate-700 text-slate-500"
                  }`
                }
              >
                Settings
              </Tab>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel className="flex items-center justify-center h-96 rounded-lg shadow">
                {createImage.isLoading ? (
                  <Ring size={40} lineWeight={5} speed={2} color="black" />
                ) : (
                  <img
                    className="object-cover w-full h-96 rounded-lg"
                    src="https://images.unsplash.com/photo-1657311277092-fe3655cf2e8c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2970&q=80"
                  />
                )}
              </Tab.Panel>
              <Tab.Panel className="h-96 rounded-lg border-slate-200 border p-5 text-slate-700 space-y-2">
                <div className="flex items-center w-full">
                  <label htmlFor="url" className="w-1/6 font-semibold">
                    Url
                  </label>
                  <input
                    type="text"
                    className="form-input rounded bg-slate-50 border-none w-1/2 shadow-sm"
                    name="url"
                    value={settings.url}
                    onChange={(e) => {
                      setSettings((p) => ({ ...p, url: e.target.value }));
                    }}
                  />
                </div>
                <div className="flex items-center w-full">
                  <label htmlFor="url" className="w-1/6 font-semibold">
                    Seed
                  </label>
                  <input
                    type="number"
                    className="form-input rounded bg-slate-50 border-none w-1/2 shadow-sm"
                    name="url"
                    value={settings.seed}
                    onChange={(e) => {
                      setSettings((p) => ({
                        ...p,
                        seed: Number(e.target.value),
                      }));
                    }}
                  />
                </div>
                <div className="flex items-center w-full">
                  <label htmlFor="url" className="w-1/6 font-semibold">
                    Style
                  </label>
                  <input
                    type="text"
                    className="form-input rounded bg-slate-50 border-none w-1/2 shadow-sm"
                    name="url"
                    value={settings.style}
                    onChange={(e) => {
                      setSettings((p) => ({ ...p, style: e.target.value }));
                    }}
                  />
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
}
