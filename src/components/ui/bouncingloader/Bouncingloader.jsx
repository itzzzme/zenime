import "./Bouncingloader.css"
const BouncingLoader = () => {
    return (
        <div className="bouncing-loading flex gap-x-[5px]">
            <div className="span1"></div>
            <div className="span2"></div>
            <div className="span3"></div>
        </div>
    );
};

export default BouncingLoader;