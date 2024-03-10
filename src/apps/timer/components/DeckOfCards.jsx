import { useFlux } from "../../flux/hooks/useFlux";
import { Actions } from "../DeckOfCards";

export const DeckOfCards = ({ deckOfCards }) => {
	const flux = useFlux(deckOfCards);
	const deck = flux.useSelector(state => state.deck);
	const dealtCards = flux.useSelector(state => state.dealtCards);
	const remainingCards = flux.useSelector(state => state.remainingCards);
	const discardedCards = flux.useSelector(state => state.discardedCards);

	const actions = Actions(deckOfCards);

	const handleShuffle = () => actions.shuffle();
	const handleDealOneCard = () => actions.dealOneCard();
	const handleResetDeck = () => actions.resetDeck();
	const handleShuffleRemaining = () => actions.shuffleRemaining();
	const handleDiscard = () => actions.discard();

	return (
		<div>
			<h2>Deck Manager</h2>
			<p>Remaining Cards: { remainingCards }</p>
			<button onClick={ handleShuffle }>Shuffle Deck</button>
			<button onClick={ handleDealOneCard } disabled={ remainingCards === 0 }>Deal One Card</button>
			<button onClick={ handleDiscard } disabled={ remainingCards === 0 }>Discard One Card</button>
			<button onClick={ handleShuffleRemaining }>Shuffle Remaining</button>
			<button onClick={ handleResetDeck }>Reset Deck</button>
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