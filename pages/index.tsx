import type { NextPage } from "next";
import { useEffect, useRef } from "react";
import { EpubViewer, ReactEpubViewer } from "react-epub-viewer";
import ePub, { EpubCFI } from "epubjs";
const Home: NextPage = () => {
  const epub = useRef<HTMLDivElement>(null);
  const p = new EpubCFI();

  useEffect(() => {
    console.count("run");
    if (epub.current !== null) {
      const book = ePub("./alice.epub");
      var rendition = book.renderTo(epub.current);
      rendition.display();
    }
  }, [epub]);

  return (
    <div className="flex justify-between h-screen">
      <div className="w-1/2" ref={epub}></div>
      <div className="w-1/2">hello</div>
    </div>
  );
};

export default Home;
