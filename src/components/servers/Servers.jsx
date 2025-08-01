/* eslint-disable react/prop-types */
import {
  faClosedCaptioning,
  faFile,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BouncingLoader from "../ui/bouncingloader/Bouncingloader";
import "./Servers.css";
import { useEffect } from "react";

function Servers({
  servers,
  activeEpisodeNum,
  activeServerId,
  activeServerName,
  setActiveServerId,
  serverLoading,
  setActiveServerType,
  setActiveServerName,
}) {
  const rawServers = servers?.filter((s) => s.type === "raw") || [];
  const subServers = servers?.filter((s) => s.type === "sub") || [];
  const dubServers = servers?.filter((s) => s.type === "dub") || [];

  const nonEmptyLists = [rawServers, subServers, dubServers].filter((list) => list.length > 0).length;

  useEffect(() => {
    const savedServerName = localStorage.getItem("server_name");
    if (savedServerName) {
      const match = servers?.find((s) => s.serverName === savedServerName);
      if (match) {
        setActiveServerId(match.data_id);
        setActiveServerType(match.type);
      } else if (servers?.length) {
        setActiveServerId(servers[0].data_id);
        setActiveServerType(servers[0].type);
      }
    } else if (servers?.length) {
      setActiveServerId(servers[0].data_id);
      setActiveServerType(servers[0].type);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [servers]);

  const handleServerSelect = (server) => {
    setActiveServerId(server.data_id);
    setActiveServerType(server.type);
    setActiveServerName(server.serverName);
    localStorage.setItem("server_name", server.serverName);
    localStorage.setItem("server_type", server.type);
  };

  return (
    <div
      className={`relative bg-[#11101A] p-4 w-full min-h-[100px] flex justify-center ${
        nonEmptyLists === 1 ? "items-start" : "items-center"
      } max-[1200px]:bg-[#14151A]`}
    >
      {serverLoading ? (
        <div className="w-full h-full rounded-lg flex justify-center items-center max-[600px]:rounded-none">
          <BouncingLoader />
        </div>
      ) : servers ? (
        <div className="w-full h-full rounded-lg grid grid-cols-[minmax(0,30%),minmax(0,70%)] overflow-hidden max-[800px]:grid-cols-[minmax(0,40%),minmax(0,60%)] max-[600px]:flex max-[600px]:flex-col max-[600px]:rounded-none">
          <div className="h-full bg-[#ffbade] px-6 text-black flex flex-col justify-center items-center gap-y-2 max-[600px]:bg-transparent max-[600px]:h-1/2 max-[600px]:text-white max-[600px]:mb-4">
            <p className="text-center leading-5 font-medium text-[14px]">
              You are watching <br />
              <span className="font-semibold max-[600px]:text-[#ffbade]">
                Episode {activeEpisodeNum}
              </span>
            </p>
            <p className="leading-5 text-[14px] font-medium text-center">
              If the current server doesn’t work, please try other servers beside.
            </p>
          </div>
          <div className="bg-[#201F31] flex flex-col max-[600px]:h-full">
            {rawServers.length > 0 && (
              <div className="servers p-2 flex items-center flex-wrap ml-2 max-[600px]:py-2">
                <div className="flex items-center gap-x-2">
                  <FontAwesomeIcon icon={faFile} className="text-[#ffbade] text-[13px]" />
                  <p className="font-bold text-[14px]">RAW:</p>
                </div>
                <div className="flex gap-[7px] ml-8 flex-wrap">
                  {rawServers.map((item, idx) => (
                    <div
                      key={idx}
                      className={`px-6 py-[5px] rounded-lg cursor-pointer ${
                        activeServerId === item.data_id && activeServerName === item.serverName
                          ? "bg-[#ffbade] text-black"
                          : "bg-[#373646] text-white"
                      } max-[700px]:px-3`}
                      onClick={() => handleServerSelect(item)}
                    >
                      <p className="text-[13px] font-semibold">{item.serverName}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {subServers.length > 0 && (
              <div className="servers p-2 flex items-center flex-wrap ml-2 max-[600px]:py-2">
                <div className="flex items-center gap-x-2">
                  <FontAwesomeIcon icon={faClosedCaptioning} className="text-[#ffbade] text-[13px]" />
                  <p className="font-bold text-[14px]">SUB:</p>
                </div>
                <div className="flex gap-[7px] ml-8 flex-wrap">
                  {subServers.map((item, idx) => (
                    <div
                      key={idx}
                      className={`px-6 py-[5px] rounded-lg cursor-pointer ${
                        activeServerId === item.data_id && activeServerName === item.serverName
                          ? "bg-[#ffbade] text-black"
                          : "bg-[#373646] text-white"
                      } max-[700px]:px-3`}
                      onClick={() => handleServerSelect(item)}
                    >
                      <p className="text-[13px] font-semibold">{item.serverName}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {dubServers.length > 0 && (
              <div className="servers p-2 flex items-center flex-wrap ml-2 max-[600px]:py-2">
                <div className="flex items-center gap-x-3">
                  <FontAwesomeIcon icon={faMicrophone} className="text-[#ffbade] text-[13px]" />
                  <p className="font-bold text-[14px]">DUB:</p>
                </div>
                <div className="flex gap-[7px] ml-8 flex-wrap">
                  {dubServers.map((item, idx) => (
                    <div
                      key={idx}
                      className={`px-6 py-[5px] rounded-lg cursor-pointer ${
                        activeServerId === item.data_id && activeServerName === item.serverName
                          ? "bg-[#ffbade] text-black"
                          : "bg-[#373646] text-white"
                      } max-[700px]:px-3`}
                      onClick={() => handleServerSelect(item)}
                    >
                      <p className="text-[13px] font-semibold">{item.serverName}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center font-medium text-[15px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
          Could not load servers <br />
          Either reload or try again after sometime
        </p>
      )}
    </div>
  );
}

export default Servers;
