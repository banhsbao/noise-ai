// import * as THREE from "three";
// import { useEffect, useMemo, useRef } from "react";
// import { MeshLineGeometry, MeshLineMaterial } from "meshline";
// import { extend, Canvas, useFrame } from "@react-three/fiber";
// import { EffectComposer, Bloom } from "@react-three/postprocessing";
// import { easing } from "maath";
// import { useControls } from "leva";
// import { useSelector } from "react-redux";
// extend({ MeshLineGeometry, MeshLineMaterial });
// function Lines({
//   dash,
//   count,
//   colors,
//   radius = 50,
//   rand = THREE.MathUtils.randFloatSpread,
// }) {
//   const lines = useMemo(() => {
//     return Array.from({ length: count }, () => {
//       const pos = new THREE.Vector3(rand(radius), rand(radius), rand(radius));
//       const points = Array.from({ length: 10 }, () =>
//         pos
//           .add(new THREE.Vector3(rand(radius), rand(radius), rand(radius)))
//           .clone()
//       );
//       const curve = new THREE.CatmullRomCurve3(points).getPoints(200);
//       return {
//         color: colors[parseInt(colors.length * Math.random())],
//         width: Math.max(radius / 100, (radius / 50) * Math.random()),
//         speed: Math.max(0.1, 1 * Math.random()),
//         curve: curve.flatMap((point) => point.toArray()),
//       };
//     });
//   }, [colors, count, radius]);
//   return lines.map((props, index) => (
//     <Fatline key={index} dash={dash} {...props} />
//   ));
// }
// function Fatline({ curve, width, color, speed, dash }) {
//   const ref = useRef();
//   useFrame(
//     (state, delta) => (ref.current.material.dashOffset -= (delta * speed) / 10)
//   );
//   return (
//     <mesh ref={ref}>
//       <meshLineGeometry points={curve} />
//       <meshLineMaterial
//         transparent
//         lineWidth={width}
//         color={color}
//         depthWrite={false}
//         dashArray={0.25}
//         dashRatio={dash}
//         toneMapped={false}
//       />
//     </mesh>
//   );
// }
// function Rig({ radius = 20 }) {
//   const positionPoint = useSelector((state) => state.handPoint);
//   useEffect(() => {}, [positionPoint]);
//   useFrame((state, dt) => {
//     easing.damp3(
//       state.camera.position,
//       [
//         Math.sin(positionPoint.handPoint.x * 2) * radius,
//         Math.atan(positionPoint.handPoint.y * 2) * radius,
//         Math.cos(positionPoint.handPoint.x * 2) * radius,
//       ],
//       0.9,
//       dt
//     );
//     state.camera.lookAt(0, 0, 0);
//   });
// }
// export const ArtWork04Component = () => {
//   const { dash, count, radius } = useControls({
//     dash: { value: 0.9, min: 0, max: 0.99, step: 0.01 },
//     count: { value: 200, min: 0, max: 200, step: 1 },
//     radius: { value: 50, min: 1, max: 100, step: 1 },
//   });
//   return (
//     <Canvas camera={{ position: [0, 0, 60], fov: 90 }} style={{ height: 1200 }}>
//       <color attach="background" args={["#101020"]} />
//       <Lines
//         dash={dash}
//         count={count}
//         radius={radius}
//         colors={[
//           [10, 0.5, 2],
//           [1, 2, 10],
//           "#A2CCB6",
//           "#FCEEB5",
//           "#EE786E",
//           "#e0feff",
//         ]}
//       />
//       <Rig />
//       <EffectComposer>
//         <Bloom mipmapBlur luminanceThreshold={1} radius={0.6} />
//       </EffectComposer>
//     </Canvas>
//   );
// };

import { useEffect, useRef } from "react";
import SketchAw4 from "../sketches/SketchAw4";
import p5 from "p5";
import { Hands } from "@mediapipe/hands";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";
import { useState } from "react";

export default function ArtWork04Component() {
  // create a reference to the container in which the p5 instance should place the canvas
  const p5ContainerRef = useRef();

  const webCamRef = useRef(null);
  var camera = null;

  function onResults(result) {
    // console.log(result)
    if (result.multiHandLandmarks.length > 0) {
      localStorage.setItem(
        "corX",
        result.multiHandLandmarks[0][8].x * window.innerWidth
      );
      localStorage.setItem(
        "corY",
        result.multiHandLandmarks[0][8].y * window.innerHeight
      );
    }
  }
  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });
    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    hands.onResults(onResults);

    if (typeof webCamRef !== "undefined" && webCamRef.current !== null) {
      camera = new cam.Camera(webCamRef.current.video, {
        onFrame: async () => {
          await hands.send({ image: webCamRef.current.video });
        },
        width: 400,
        height: 400,
      });
      camera.start();
    }
    // On component creation, instantiate a p5 object with the sketch and container reference
    const p5Instance = new p5(SketchAw4, p5ContainerRef.current);
    // On component destruction, delete the p5 instance
    return () => {
      p5Instance.remove();
    };
  }, []);
  return (
    <>
      <Webcam
        hidden={true}
        ref={webCamRef}
        style={{
          position: "absolute",
          width: window.innerWidth,
          height: window.innerHeight,
        }}
      />
      <div className="Artwork4" ref={p5ContainerRef}></div>
    </>
  );
}
