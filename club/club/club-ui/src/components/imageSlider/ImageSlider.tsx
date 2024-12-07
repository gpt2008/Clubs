import { useEffect, useRef } from "react";
import "./ImageSlider.scss";

type Props = {
	images: string[];
	interval: number;
};

function ImageSlider(props: Props) {
	const imagesRef = useRef<(HTMLImageElement | null)[]>([]);

	useEffect(() => {
		let index = 1;
		const intervalId = setInterval(() => {
			let prevImg = index !== 0 ? index - 1 : props.images.length - 1;

			if(imagesRef.current[prevImg] && imagesRef.current[index]){
				imagesRef.current[prevImg]!.style.opacity = "0";
				imagesRef.current[index]!.style.opacity = "1";
			}
            
			index = (index + 1) % props.images.length;
		}, props.interval);

		return () => clearInterval(intervalId);
	}, []);

	useEffect(() => {
		imagesRef.current = imagesRef.current.slice(0, props.images.length);
	}, [props.images]);

	return (
		<div className="bg-imgs">
			{props.images.map((image, i) => (
				<img key={i} ref={(el) => (imagesRef.current[i] = el)} src={image} />
			))}
		</div>
	);
}

export default ImageSlider;
