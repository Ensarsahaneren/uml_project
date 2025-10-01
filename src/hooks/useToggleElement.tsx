import { useLayoutEffect, useState } from "react";

const useToggleElement = (width = 800) => {
  const [isHidden, setIsHidden] = useState(
    typeof window !== "undefined" ? window.innerWidth <= width : false
  );

  const toggleHidden = (hidden = true) => {
    setIsHidden(hidden);
  };

  useLayoutEffect(() => {
    const handleResize = () => {
      setIsHidden(window.innerWidth <= width);
    };

    // ilk render’da kontrol et
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [width]); // sadece width değişirse yeniden bağlanır

  return { toggleHidden, isHidden };
};

export default useToggleElement;
