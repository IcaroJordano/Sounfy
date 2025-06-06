import { useRef, useEffect, useState } from "react";

interface TimelineItem {
  title?: string;
  artist?: string;
  image?: string;
  link?: string;
}

interface Props {
  itens: TimelineItem[];
}

const TimeLine = ({ itens }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartY = useRef(0);

  // Ref dinâmica para cada seção
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Scroll via mouse (desktop)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 30) scrollToSection(currentIndex + 1);
      else if (e.deltaY < -30) scrollToSection(currentIndex - 1);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [currentIndex]);

  // Scroll via toque (mobile)
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY.current - touchEndY;

      if (diff > 30) scrollToSection(currentIndex + 1);
      else if (diff < -30) scrollToSection(currentIndex - 1);
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentIndex]);

  const scrollToSection = (index: number) => {
    if (index < 0 || index >= itens.length) return;
    setCurrentIndex(index);
    sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="absolute h-screen w-full overflow-hidden z-50">
      {itens.map((item, index) => (
        <div
          key={index}
          ref={(el) => {
            sectionRefs.current[index] = el;
          }}
          className="h-screen w-full flex flex-col justify-center items-center text-white bg-black px-4 text-center"
        >
          <h1 className="text-4xl font-bold mb-4">{item.title}</h1>
          <p className="text-lg max-w-xl">{item.link}</p>
          {item.image && (
            <img src={item.image} alt={item.title} className="mt-4 max-w-xs rounded" />
          )}
        </div>
      ))}
    </div>
  );
};

export default TimeLine;
