import {
  faClosedCaptioning,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BouncingLoader from "../ui/bouncingloader/Bouncingloader";
import "./Servers.css";

function Servers({
  servers,
  activeEpisodeNum,
  activeServerId,
  setActiveServerId,
  serverLoading,
}) {
  const subServers = servers?.filter((server) => server.type === "sub") || [];
  const dubServers = servers?.filter((server) => server.type === "dub") || [];

  return (
    <div className="bg-[#11101A] p-4 w-full min-h-[100px] flex justify-center items-center max-[1200px]:bg-[#14151A]">
      {serverLoading ? (
        <div className="w-full h-full rounded-lg flex justify-center items-center max-[600px]:rounded-none">
          <BouncingLoader />
        </div>
      ) : (
        <div className="w-full h-full rounded-lg grid grid-cols-[minmax(0,30%),minmax(0,70%)] overflow-hidden max-[800px]:grid-cols-[minmax(0,40%),minmax(0,60%)] max-[600px]:flex max-[600px]:flex-col max-[600px]:rounded-none">
          <div className="h-full bg-[#ffbade] px-6 text-black flex flex-col justify-center items-center gap-y-2 max-[600px]:bg-transparent max-[600px]:h-1/2 max-[600px]:text-white max-[600px]:mb-4">
            <p className="text-center leading-5 font-medium text-[14px]">
              You are watching <br />
              <span className="font-semibold  max-[600px]:text-[#ffbade]">
                Episode {activeEpisodeNum}
              </span>
            </p>
            <p className="leading-5 text-[14px] font-medium text-center">
              If the current server doesn&apos;t work, please try other servers
              beside.
            </p>
          </div>
          <div className="bg-[#201F31] flex flex-col max-[600px]:h-full ">
            {subServers.length > 0 && (
              <div
                className={`servers px-2 flex items-center flex-wrap ml-2 max-[600px]:py-2 ${
                  dubServers.length === 0 ? "h-1/2" : "h-full"
                }`}
              >
                <div className="flex items-center gap-x-2">
                  <FontAwesomeIcon
                    icon={faClosedCaptioning}
                    className="text-[#ffbade] text-[13px]"
                  />
                  <p className="font-bold text-[14px]">SUB:</p>
                </div>
                <div className="flex gap-x-[7px] ml-8 flex-wrap">
                  {subServers.map((item, index) => (
                    <div
                      key={index}
                      className={` px-6 py-[5px] rounded-lg cursor-pointer ${
                        activeServerId === item?.data_id
                          ? "bg-[#ffbade] text-black"
                          : "bg-[#373646] text-white"
                      } max-[700px]:px-3`}
                      onClick={() => {
                        setActiveServerId(item?.data_id);
                      }}
                    >
                      <p className="text-[13px] font-semibold">
                        {item.serverName}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {dubServers.length > 0 && (
              <div
                className={`servers px-2 flex items-center flex-wrap ml-2 max-[600px]:py-2 ${
                  subServers.length === 0 ? "h-1/2 " : "h-full"
                }`}
              >
                <div className="flex items-center gap-x-3">
                  <FontAwesomeIcon
                    icon={faMicrophone}
                    className="text-[#ffbade] text-[13px]"
                  />
                  <p className="font-bold text-[14px]">DUB:</p>
                </div>
                <div className="flex gap-x-[7px] ml-8 flex-wrap">
                  {dubServers.map((item, index) => (
                    <div
                      key={index}
                      className={` px-6 py-[5px] rounded-lg cursor-pointer ${
                        activeServerId === item?.data_id
                          ? "bg-[#ffbade] text-black"
                          : "bg-[#373646] text-white"
                      } max-[700px]:px-3`}
                      onClick={() => setActiveServerId(item?.data_id)}
                    >
                      <p className="text-[13px] font-semibold">
                        {item.serverName}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Servers;
