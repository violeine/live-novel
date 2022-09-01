import { useCallback, useRef, useState } from "react";
import { ReactReader } from "react-reader";
import { PromptImage } from "./image";

export function HomePage() {
  const [location, setLocation] = useState<any>(null);
  const [currentPrompt, setCurrentPrompt] = useState();
  const locationChanged = (epubcifi: any) => {
    // epubcifi is a internal string used by epubjs to point to a location in an epub. It looks like this: epubcfi(/6/6[titlepage]!/4/2/12[pgepubid00003]/3:0)
    setLocation(epubcifi);
  };
  const cleanupRef = useRef<(() => void) | null>(null);
  const readerRef = useCallback((reader: any) => {
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
    function setRenderSelection(cfiRange: any, content: any) {
      setCurrentPrompt(reader.getRange(cfiRange).toString());
      content.window.getSelection().removeAllRanges();
    }
    reader.on("selected", setRenderSelection);
    cleanupRef.current = () => reader.off("selected", setRenderSelection);
  }, []);
  return (
    <div className="h-screen flex flex-col gap-2 p-3 border border-gray-400 ">
      <div className="h-full flex-1 flex-shrink-0 shadow-sm py-3 rounded-lg border border-gray-300">
        <ReactReader
          showToc={false}
          url="https://react-reader.metabits.no/files/alice.epub"
          location={location}
          locationChanged={locationChanged}
          getRendition={(reader) => readerRef(reader)}
        />
      </div>
      <div className="shadow-sm py-3 rounded-lg border border-gray-300">
        <PromptImage
          prompt={currentPrompt ?? ""}
          seed="1234"
          url="http://selab.nhtlongcs.com:20628"
        />
      </div>
    </div>
  );
}
