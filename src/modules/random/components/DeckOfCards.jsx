import React, { useState } from 'react';
import { useFlux } from "../../flux/hooks/useFlux";

export const DeckOfCards = ({ deckOfCards }) => {
	const flux = useFlux(deckOfCards);
	const dealtCards = flux.useSelector(state => state.dealtCards);
	const remainingCards = flux.useSelector(state => state.remainingCards);
	const discardedCards = flux.useSelector(state => state.discardedCards);
	const currentSeed = flux.useSelector(state => state.seed);

	const [ newSeed, setNewSeed ] = useState(currentSeed.toString());

	const handleShuffle = () => deckOfCards.actions.shuffle(currentSeed);
	const handleDealOneCard = () => deckOfCards.actions.dealOneCard();
	const handleResetDeck = () => deckOfCards.actions.resetDeck(parseInt(newSeed, 10));
	const handleShuffleRemaining = () => deckOfCards.actions.shuffleRemaining(currentSeed);
	const handleDiscard = () => deckOfCards.actions.discard();

	return (
		<div>
			<h2>Deck of Cards</h2>
			<p>Remaining Cards: { remainingCards }</p>
			<label htmlFor="seed">Seed:</label>
			<input
				name="seed"
				type="number"
				value={ newSeed }
				onChange={ (e) => setNewSeed(e.target.value) }
				placeholder="Enter new seed"
			/>
			<button onClick={ handleShuffle }>Shuffle Deck</button>
			<button onClick={ handleDealOneCard } disabled={ remainingCards === 0 }>Deal One Card</button>
			<button onClick={ handleDiscard } disabled={ remainingCards === 0 }>Discard One Card</button>
			<button onClick={ handleShuffleRemaining }>Shuffle Remaining</button>
			<button onClick={ handleResetDeck }>Reseed and Reset Deck</button>
			<div>
				<h3>Dealt Cards:</h3>
				{ dealtCards.length > 0 ? (
					<ul>
						{ dealtCards.map((card, index) => (
							<li key={ index }>{ card.rank } of { card.suit }</li>
						)) }
					</ul>
				) : (
					<p>No cards have been dealt yet.</p>
				) }
			</div>
			<div>
				<h3>Discarded Cards:</h3>
				{ discardedCards.length > 0 ? (
					<ul>
						{ discardedCards.map((card, index) => (
							<li key={ index }>{ card.rank } of { card.suit }</li>
						)) }
					</ul>
				) : (
					<p>No cards have been discarded yet.</p>
				) }
			</div>
		</div>
	);
};

export default DeckOfCards;