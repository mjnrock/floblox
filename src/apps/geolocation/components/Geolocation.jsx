import { useRef, useEffect } from "react";
import { useFlux } from "../../flux/hooks/useFlux";
import { Actions } from "../Geolocation";

export const Geolocation = ({ geo }) => {
	const flux = useFlux(geo);
	const currentLocation = flux.useSelector(state => state.currentLocation);
	const tracking = flux.useSelector(state => state.tracking);

	const actions = Actions(geo);

	const stopTrackingFn = useRef(() => { });

	useEffect(() => {
		return () => {
			if(tracking) {
				stopTrackingFn.current();
			}
		};
	}, [ tracking ]);

	const handleToggleTracking = () => {
		if(tracking) {
			stopTrackingFn.current();
		} else {
			actions.startTracking();
			stopTrackingFn.current = actions.stopTracking;
		}
	};

	const handleGetCurrentLocation = () => {
		actions.getCurrentLocation();
	};

	const handleStopAndClearTracking = () => {
		actions.stopAndClearTracking();
	};

	const locationDisplay = currentLocation
		? `Lat: ${ currentLocation.coords.latitude }, Lon: ${ currentLocation.coords.longitude }`
		: "Location data not available.";

	return (
		<div>
			<h2>Current Location</h2>
			<p>{ locationDisplay }</p>
			<button onClick={ handleGetCurrentLocation }>Get Location</button>
			<button onClick={ handleToggleTracking }>
				{ tracking ? "Stop Tracking" : "Start Tracking" }
			</button>
			<button onClick={ handleStopAndClearTracking }>Stop and Clear Tracking</button>
		</div>
	);
};

export default Geolocation;