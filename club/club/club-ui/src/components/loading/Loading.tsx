import { LoadingGIF } from "images";
import "./Loading.scss";

function Loading() {
	return (
		<div className="loading__container">
			<img src={LoadingGIF} height={64} alt="loading" />
		</div>
	);
}

export default Loading;
