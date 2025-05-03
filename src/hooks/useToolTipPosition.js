import { useEffect, useRef, useState } from "react";

const useToolTipPosition = (hoveredItem, data) => {
  const cardRefs = useRef([]);
  const [tooltipPosition, setTooltipPosition] = useState("top-1/2");
  const [tooltipHorizontalPosition, setTooltipHorizontalPosition] =
    useState("left-1/2");

  const updateToolTipPosition = () => {
    if (hoveredItem !== null) {
      const refIndex = data.findIndex(
        (item, index) => item.id + index === hoveredItem
      );
      const ref = cardRefs.current[refIndex];
      if (ref) {
        const { top, height, left, width } = ref.getBoundingClientRect();
        const adjustedTop = top + height / 2 - 64;
        const bottomY = window.innerHeight - adjustedTop;
        if (adjustedTop < bottomY) {
          setTooltipPosition("top-1/2");
        } else {
          setTooltipPosition("bottom-1/2");
        }
        const adjustedLeft = left + width / 2;
        const spaceRight = window.innerWidth - adjustedLeft;
        if (spaceRight > 320) {
          setTooltipHorizontalPosition("left-1/2");
        } else {
          setTooltipHorizontalPosition("right-1/2");
        }
      }
    }
  };

  useEffect(() => {
    updateToolTipPosition();
    const handleScroll = () => {
      updateToolTipPosition();
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hoveredItem, data]);

  return { tooltipPosition, tooltipHorizontalPosition, cardRefs };
};

export default useToolTipPosition;
