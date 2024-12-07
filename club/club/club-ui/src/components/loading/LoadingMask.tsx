import { LoadingOutlined } from "@ant-design/icons";
import "./LoadingMask.scss";

function LoadingMask() {
  return (
    <div className="loading-mask">
      <LoadingOutlined style={{ fontSize: 48 }} spin />
    </div>
  );
}

export default LoadingMask;
