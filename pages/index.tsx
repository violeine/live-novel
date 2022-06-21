import { useEffect, useRef, useState } from "react";
import { ReactReader } from "react-reader";
const Home = () => {
  // And your own state logic to persist state
  const [location, setLocation] = useState<any>(null);
  const [selections, setSelections] = useState<any[]>([]);
  const locationChanged = (epubcifi: any) => {
    // epubcifi is a internal string used by epubjs to point to a location in an epub. It looks like this: epubcfi(/6/6[titlepage]!/4/2/12[pgepubid00003]/3:0)
    console.log("wtf");
    setLocation(epubcifi);
  };
  const renditionRef = useRef<any>(null);
  useEffect(() => {
    if (renditionRef.current) {
      const rendition = renditionRef.current;
      const setRenderSelection = (cfiRange: any, contents: any) => {
        setSelections((p) =>
          p.concat({
            text: renditionRef.current.getRange(cfiRange).toString(),
            cfiRange,
          })
        );
        //send request here
        renditionRef.current.annotations.add(
          "highlight",
          cfiRange,
          {},
          null,
          "hl",
          { fill: "blue", "fill-opacity": "0.5", "mix-blend-mode": "multiply" }
        );
        contents.window.getSelection().removeAllRanges();
      };
      rendition.on("selected", setRenderSelection);
      return () => rendition.off("selected", setRenderSelection);
    }
  }, [selections, setSelections]);
  return (
    <div className="flex items-center">
      <div className="w-1/2 h-screen">
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
      <div className="w-1/2 bg-gray-700 h-screen p-8 space-y-3">
        {selections.map(({ text, cfiRange }, i) => {
          return (
            <p
              key={i}
              className="bg-white p-3 rounded-sm shadow-sm"
              onClick={() => {
                renditionRef.current.display(cfiRange);
              }}
            >
              {text}
            </p>
          );
        })}
      </div>
    </div>
  );
};
export default Home;
