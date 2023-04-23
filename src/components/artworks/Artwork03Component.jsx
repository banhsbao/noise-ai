import { useEffect, useRef } from "react";
import SketchAw3 from "../sketches/SketchAw3";
import p5 from 'p5';

export default function ArtWork03Component() {
  // create a reference to the container in which the p5 instance should place the canvas
  const p5ContainerRef = useRef();

  useEffect(() => {
      // On component creation, instantiate a p5 object with the sketch and container reference 
      const p5Instance = new p5(SketchAw3, p5ContainerRef.current);

      // On component destruction, delete the p5 instance
      return () => {
          p5Instance.remove();
      }
  }, []);
  return (
    <div className="Artwork3" ref={p5ContainerRef}></div>
  );
};
