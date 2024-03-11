import { useState } from "react";
import { useFlux } from "../../flux/hooks/useFlux.js";

export const CardGame = ({ cardGame }) => {
	const flux = useFlux(cardGame);
	const players = flux.useSelector(state => state.players);
	const [ selectedPlayerId, setSelectedPlayerId ] = useState(players[ 0 ]?.id || "");
	const [ numberOfCards, setNumberOfCards ] = useState(1);

	const handleAddPlayer = () => {
		const newPlayerId = `player-${ Date.now() }`;
		cardGame.actions.addPlayer(newPlayerId);
		setSelectedPlayerId(newPlayerId);
	};

	const handleDealToPlayer = () => {
		cardGame.actions.dealToPlayer(selectedPlayerId, numberOfCards);
	};

	const handlePlayTurn = () => {
		const player = players.find(player => player.id === selectedPlayerId);
		if(player) {
			cardGame.actions.playTurn(selectedPlayerId, player.hand.slice(0, 1));
		}
	};

	return (
		<div>
			<div>
				<h2>Card Game</h2>
				<button onClick={ handleAddPlayer }>Add Player</button>
				<label>
					Select Player:
					<select value={ selectedPlayerId } onChange={ (e) => setSelectedPlayerId(e.target.value) }>
						{ players.map(player => (
							<option key={ player.id } value={ player.id }>{ player.id }</option>
						)) }
					</select>
				</label>
				<label>
					Cards to Deal:
					<input
						type="number"
						value={ numberOfCards }
						onChange={ (e) => setNumberOfCards(parseInt(e.target.value, 10)) }
					/>
				</label>
				<button onClick={ handleDealToPlayer } disabled={ !selectedPlayerId }>Deal Cards to Player</button>
				<button onClick={ handlePlayTurn } disabled={ !selectedPlayerId }>Play Turn</button>
			</div>
			<div>
				<h3>Players and Hands:</h3>
				{ players.length > 0 ? (
					players.map((player, index) => (
						<div key={ index }>
							<h4>{ player.id }</h4>
							<ul>
								{ player.hand.map((card, index) => (
									<li key={ index }>{ card.rank } of { card.suit }</li>
								)) }
							</ul>
						</div>
					))
				) : (
					<p>No players have been added yet.</p>
				) }
			</div>
		</div>
	);
};

export default CardGame;