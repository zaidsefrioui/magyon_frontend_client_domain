// components/AutoScrollList.jsx
import { useRef, useState, useEffect } from "react";

export default function AutoScrollList({ children , products }) {
  const scrollRef = useRef(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let direction = 1;
    let speed = 1.5;
    let animationFrame;

    const animate = () => {
      if (!paused) {
        container.scrollLeft += direction * speed;
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth)
          direction = -1;
        else if (container.scrollLeft <= 0)
          direction = 1;
      }
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [paused]);

  const handlePause = () => setPaused(true);

  return (
    <ul
      ref={scrollRef}
      // onClick={handlePause}
      onMouseDown={handlePause}
      className={products ===1 ?
        "flex flex-row justify-center gap-4 overflow-auto py-3 scroll-smooth cursor-pointer" :
        "flex flex-row gap-4 overflow-auto py-3 scroll-smooth cursor-pointer"
      
      }
      onMouseEnter={() => setPaused(true)}
      // onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      // onTouchEnd={() => setPaused(false)}
    >
      {children}
    </ul>
  );
}
