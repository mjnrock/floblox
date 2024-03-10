import React from "react";
import { useFlux } from "../../flux/hooks/useFlux";

export const Dice = ({ dice }) => {
	const flux = useFlux(dice);
	const sides = flux.useSelector(state => state.sides);
	const history = flux.useSelector(state => state.history);
	const stats = flux.useSelector(state => state.stats);

	const handleChangeSides = (e) => {
		dice.actions.setSides(parseInt(e.target.value, 10));
	};
	const handleRollDice = () => dice.actions.rollDice();
	const handleResetResults = () => dice.actions.resetResults();

	return (
		<div>
			<h2>Dice Roller</h2>
			<div>
				<label>
					Number of sides:
					<input type="number" value={ sides } onChange={ handleChangeSides } min="1" />
				</label>
				<button onClick={ handleRollDice }>Roll Dice</button>
				<button onClick={ handleResetResults }>Reset Results</button>
			</div>
			<div>
				<h3>Rolled Results:</h3>
				{ history.length > 0 ? (
					<ul>
						{ history.map((result, index) => (
							<li key={ index }>Sides: { result.sides }, Result: { result.result }</li>
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

export default Dice;