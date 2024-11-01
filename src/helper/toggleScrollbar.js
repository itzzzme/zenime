export function toggleScrollbar(isOpen) {
  const getScrollbarWidth = () => {
    return window.innerWidth - document.documentElement.clientWidth;
  };
  const body = document.body;
  if (isOpen) {
    const scrollbarWidth = getScrollbarWidth();
    body.style.paddingRight = `${scrollbarWidth}px`;
    body.classList.add("overflow-y-hidden");

    const style = document.createElement("style");
    style.id = "hide-scrollbar";
    style.innerHTML = `::-webkit-scrollbar { display: none; }`;
    document.head.appendChild(style);
  } else {
    body.style.paddingRight = "0";
    body.classList.remove("overflow-y-hidden");
    const styleElement = document.getElementById("hide-scrollbar");
    if (styleElement) {
      styleElement.remove();
    }
  }
}
export function cleanupScrollbar() {
  const body = document.body;
  body.style.paddingRight = "0";
  body.classList.remove("overflow-y-hidden");
  const styleElement = document.getElementById("hide-scrollbar");
  if (styleElement) {
    styleElement.remove();
  }
}
