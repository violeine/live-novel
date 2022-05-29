import type { NextPage } from "next";
import { useRef } from "react";
import { EpubViewer, ReactEpubViewer } from "react-epub-viewer";
import { EpubCFI } from "epubjs";
const Home: NextPage = () => {
  const viewerRef = useRef(null);
  const p = new EpubCFI();
  return (
    <div style={{ position: "relative", height: "100%" }}>
      <ReactEpubViewer
        url={"/alice.epub"}
        ref={viewerRef}
        onSelection={(e) => console.log(e)}
      />
    </div>
  );
};

export default Home;
