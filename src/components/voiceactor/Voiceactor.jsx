import { useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import VoiceactorList from "../voiceactorlist/VoiceactorList";

function Voiceactor({ animeInfo, className }) {
  const [showVoiceActors, setShowVoiceActors] = useState(false);
  return (
    <div className={`w-full mt-8 flex flex-col gap-y-4 ${className}`}>
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-2xl text-[#ffbade] max-[478px]:text-[18px] capitalize">
          Characters & Voice Actors
        </h1>
        <button className="flex w-fit items-baseline h-fit rounded-3xl gap-x-1 group">
          <p
            className="text-white text-[12px] font-semibold h-fit leading-0"
            onClick={() => {
              setShowVoiceActors(true);
            }}
          >
            View more
          </p>
          <FaChevronRight className="text-white text-[10px]" />
        </button>
      </div>
      <div className="w-full grid grid-cols-3 max-[1024px]:grid-cols-2 max-[758px]:grid-cols-1 gap-4">
        {animeInfo.charactersVoiceActors.slice(0, 6).map((character, index) => (
          <div
            key={index}
            className="flex justify-between items-center px-3 py-4 rounded-md bg-[#373646]"
          >
            {character.character && (
              <div className="w-[50%] float-left overflow-hidden max-[350px]:w-[45%]">
                <div className="w-full flex gap-x-3">
                  {character.character.poster && (
                    <img
                      src={character.character.poster}
                      title={character.character.name || "Character"}
                      alt={character.character.name || "Character"}
                      onError={(e) => {
                        e.target.src = "https://i.postimg.cc/HnHKvHpz/no-avatar.jpg";
                      }}
                      className="w-[45px] h-[45px] flex-shrink-0 rounded-full object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="flex justify-center flex-col">
                    {character.character.name && (
                      <h4 className="text-[13px] text-left leading-[1.3em] font-[400] mb-0 overflow-hidden -webkit-box -webkit-line-clamp-2 -webkit-box-orient-vertical">
                        {character.character.name}
                      </h4>
                    )}
                    {character.character.cast && (
                      <p className="text-[11px] mt-[3px]">
                        {character.character.cast}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            {character.voiceActors.length > 0 && character.voiceActors[0] && (
              <div className="w-[50%] float-right overflow-hidden max-[350px]:w-[45%]">
                <div className="w-full flex justify-end gap-x-2">
                  <div className="flex flex-col justify-center ">
                    {character.voiceActors[0].name && (
                      <span className="text-[13px] text-right leading-[1.3em] font-[400] mb-0 overflow-hidden -webkit-box -webkit-line-clamp-2 -webkit-box-orient-vertical w-fit">
                        {character.voiceActors[0].name}
                      </span>
                    )}
                  </div>
                  {character.voiceActors[0].poster && (
                    <img
                      src={character.voiceActors[0].poster}
                      title={character.voiceActors[0].name || "Voice Actor"}
                      alt={character.voiceActors[0].name || "Voice Actor"}
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = "https://i.postimg.cc/HnHKvHpz/no-avatar.jpg";
                      }}
                      className="w-[45px] h-[45px] rounded-full object-cover grayscale hover:grayscale-0 hover:cursor-pointer flex-shrink-0 transition-all duration-300 ease-in-out"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {showVoiceActors && (
        <VoiceactorList
          id={animeInfo.id}
          isOpen={showVoiceActors}
          onClose={() => setShowVoiceActors(false)}
        />
      )}
    </div>
  );
}

export default Voiceactor;
