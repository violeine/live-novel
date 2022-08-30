import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { ReactReader } from "react-reader";
import { Ring } from "@uiball/loaders";
import { Tab } from "@headlessui/react";
const alice_highlight = [
  {
    text: "a little table, all made of solid glass. There was nothing on\n\t\tit but a tiny golden key",
    cfiRange: "epubcfi(/6/8!/4/2/26,/1:23,/1:111)",
  },
  {
    text: "beds of bright flowers and those cool fountains,",
    cfiRange: "epubcfi(/6/8!/4/2/28,/1:262,/1:310)",
  },
  {
    text: "The Pool Of Tears\n\t\t\n\t\t",
    cfiRange: "epubcfi(/6/10!/4/2,/2[pgepubid00005]/1:0,/4/1:0)",
  },
  {
    text: "a tidy little room with a table in the\n\t\t\twindow, and on it a fan and two or three pairs of tiny white kid-gloves",
    cfiRange: "epubcfi(/6/14!/4/2/10,/1:43,/1:156)",
  },
  {
    text: "The Duchess \ttucked her arm affectionately into Alice's",
    cfiRange: "epubcfi(/6/14!/4/2/50/4/2,/1:1,/1:56)",
  },
  {
    text: "Alice at the Mad Tea Party.\n\t\t\t\n\t\t\n\t\t\n\t\t",
    cfiRange: "epubcfi(/6/10!/4/2,/40/4/2/1:0,/42/1:0)",
  },
];
export function HomePage() {
  const [location, setLocation] = useState<any>(null);
  const [selections, setSelections] = useState<any[]>([]);

  const [img, setImg] = useState<any>(null);
  const [settings, setSettings] = useState({
    url: "http://selab.nhtlongcs.com:20558",
    seed: 1234,
  });
  const locationChanged = (epubcifi: any) => {
    // epubcifi is a internal string used by epubjs to point to a location in an epub. It looks like this: epubcfi(/6/6[titlepage]!/4/2/12[pgepubid00003]/3:0)
    setLocation(epubcifi);
  };

  const renditionRef = useRef<any>(null);

  const saveHighlight = () => {
    localStorage.setItem("highlights", JSON.stringify(selections));
  };

  const removeHighlight = (cfiRange: any) => {
    setSelections((p) => p.filter((el) => el.cfiRange !== cfiRange));
    renditionRef.current.annotations.remove(cfiRange, "highlight");
  };

  useQueryClient();

  const createImage = useMutation(async (prompt: string) => {
    const result = await fetch(
      `${settings.url}/create?prompt=ilustration of ${prompt} in alice in the wonderland&sess_name=${prompt}1&seed=${settings.seed}`,
      {
        method: "POST",
      }
    );
    return result;
  });
  const getResult = useMutation(
    async (prompt) => {
      const result = await fetch(`${settings.url}/result?sess_name=${prompt}`, {
        method: "POST",
      })
        .then((res) => res.json())
        .then((b) => b.image);
      return result;
    },
    {
      onSuccess: async (res) => {
        setImg(res);
      },
    }
  );

  useEffect(() => {
    if (renditionRef.current) {
      const rendition = renditionRef.current;
      const setRenderSelection = (cfiRange: any, contents: any) => {
        const text = renditionRef.current.getRange(cfiRange).toString();
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
            const highlightFromLocalStorage =
              typeof window !== "undefined"
                ? window.localStorage.getItem("highlights")
                : null;
            const parsedHighlight = JSON.parse(
              highlightFromLocalStorage ?? JSON.stringify([])
            );
            setSelections(() => {
              return parsedHighlight;
            });
            parsedHighlight.map((el: any) => {
              rendition.annotations.add(
                "highlight",
                el.cfiRange,
                {},
                () => {},
                "hl"
              );
            });
          }}
        />
      </div>
      <div className="w-1/2 h-screen px-8 py-3 flex flex-col space-y-8">
        <div className="space-y-3 overflow-y-scroll h-1/2 py-3 px-4 rounded border border-slate-200 bg-slate-50">
          {selections.map(({ text, cfiRange }, i) => {
            return (
              <div
                key={i}
                className="bg-white p-3 rounded shadow text-slate-800 cursor-pointer border-slate-200"
              >
                <p
                  onClick={() => {
                    renditionRef.current.display(cfiRange);
                  }}
                >
                  {text}
                </p>
                <button onClick={() => getResult.mutate(text)}>
                  get result
                </button>
                <button
                  className="bg-gray-100 rounded px-2 py-1 shadow-sm"
                  onClick={() => removeHighlight(cfiRange)}
                >
                  remove
                </button>
              </div>
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
                      ? "border-b-2 border-b-slate-700 hover:rounded-t text-slate-700"
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
                      ? "border-b-2 border-b-slate-700 hover:rounded-t text-slate-700"
                      : "hover:rounded hover:text-slate-700 text-slate-500"
                  }`
                }
              >
                Settings
              </Tab>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel className="flex items-center justify-center h-96 rounded-lg shadow">
                {getResult.isLoading ? (
                  <Ring size={40} lineWeight={5} speed={2} color="black" />
                ) : (
                  <img
                    className="object-cover w-full h-96 rounded-lg"
                    src={`data:image/png;base64,${btoa(img)}`}
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
                <div>
                  <button
                    className="px-3 py-2 bg-blue-400 text-blue-900 rounded"
                    onClick={saveHighlight}
                  >
                    Save your highlight
                  </button>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
}
