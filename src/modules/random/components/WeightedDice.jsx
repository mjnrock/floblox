import React, { useState, useEffect } from "react";
import { useFlux } from "../../../flux/hooks/useFlux";

export const WeightedDice = ({ weightedDice }) => {
	const flux = useFlux(weightedDice);
	const weights = flux.useSelector(state => state.weights);
	const history = flux.useSelector(state => state.history);
	const stats = flux.useSelector(state => state.stats);

	const [ weightsInput, setWeightsInput ] = useState("");
	const [ distributionOdds, setDistributionOdds ] = useState([]);

	useEffect(() => {
		setWeightsInput(weights.join(","));
	}, [ weights ]);

	useEffect(() => {
		if(stats.dist && stats.dist.length > 0) {
			const total = stats.dist.reduce((acc, curr) => acc + curr, 0);
			const odds = stats.dist.map(dist => dist / total);
			setDistributionOdds(odds);
		}
	}, [ stats.dist ]);

	const handleChangeWeights = (e) => {
		setWeightsInput(e.target.value);
	};

	const handleUpdateWeights = () => {
		const weightsArray = weightsInput.split(",").map(weight => parseFloat(weight.trim())).filter(weight => !isNaN(weight));
		weightedDice.actions.setWeights(weightsArray);
	};

	const handleRoll = () => weightedDice.actions.roll();
	const handleResetResults = () => weightedDice.actions.resetResults();

	return (
		<div>
			<h2>Weighted Dice</h2>
			<div>
				<label>
					Weights (comma-separated):
					<input type="text" value={ weightsInput } onChange={ handleChangeWeights } onBlur={ handleUpdateWeights } />
				</label>
				<button onClick={ handleRoll }>Roll Dice</button>
				<button onClick={ handleResetResults }>Reset Results</button>
			</div>
			<div>
				<h3>Rolled Results:</h3>
				{ history.length > 0 ? (
					<ul>
						{ history.map((result, index) => (
							<li key={ index }>Result: { result.result }</li>
						)) }
					</ul>
				) : (
					<p>No dice have been rolled yet.</p>
				) }
			</div>
			<div>
				<h3>Statistics:</h3>
				{ history.length > 0 ? (
					<ul>
						<li>Theoretical: { stats.odds.toString() }</li>
						<li>Actual: { distributionOdds.toString() }</li>
						<li>Distribution: { stats.dist.toString() }</li>
						<li>Mean: { stats.mean.toFixed(2) }</li>
						<li>Median: { stats.median.toFixed(2) }</li>
						<li>Mode: { stats.mode.toFixed(2) }</li>
						<li>Range: { stats.range }</li>
						<li>Minimum: { stats.min }</li>
						<li>Maximum: { stats.max }</li>
						<li>Sum: { stats.sum }</li>
					</ul>
				) : (
					<p>No statistics to display yet.</p>
				) }
			</div>
		</div>
	);
};

export default WeightedDice;
