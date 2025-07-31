import React, { useState } from "react";
import { Link } from "react-router-dom";

function Genre({ data }) {
  const colors = [
    "#A4B389",
    "#FFBADE",
    "#935C5F",
    "#AD92BC",
    "#ABCCD8",
    "#D8B2AB",
    "#85E1CD",
    "#B7C996",
  ];

  const [showAll, setShowAll] = useState(false);
  const toggleGenres = () => {
    setShowAll((prev) => !prev);
  };

  return (
    <div className="flex flex-col w-full">
      <h1 className="font-bold text-2xl text-[#ffbade]">Genres</h1>
      <div className="bg-[#373646] py-6 px-4 mt-6 max-[478px]:bg-transparent max-[478px]:px-0">
        <div className="grid grid-cols-3 grid-rows-2 gap-x-4 gap-y-3 w-full max-[478px]:flex max-[478px]:flex-wrap max-[478px]:gap-2">
          {data &&
            (showAll ? data : data.slice(0, 24)).map((item, index) => {
              const textColor = colors[index % colors.length];
              return (
                <Link
                  to={`/genre/${item}`}
                  key={index}
                  className="rounded-[4px] py-2 px-3 hover:bg-[#555462] hover:cursor-pointer max-[478px]:bg-[#373646] max-[478px]:py-[6px]"
                  style={{ color: textColor }}
                >
                  <div className="overflow-hidden text-left text-ellipsis text-nowrap font-bold">
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </div>
                </Link>
              );
            })}
        </div>
        <button
          className="w-full bg-[#555462d3] py-3 mt-4 hover:bg-[#555462] rounded-md font-bold transform transition-all ease-out"
          onClick={toggleGenres}
        >
          {showAll ? "Show less" : "Show more"}
        </button>
      </div>
    </div>
  );
}

export default React.memo(Genre);
