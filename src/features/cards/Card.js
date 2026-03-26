import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCards, removeCard } from "./cardsSlice";

export default function Card({ id }) {
  const cards = useSelector(selectCards);
  const card = cards[id];
  const [flipped, setFlipped] = useState(false);
  const dispatch = useDispatch();

  const handleDeleteCard = (e) => {
    e.stopPropagation();
    dispatch(removeCard({ id }));
  };

  return (
    <li>
      <button className="card" onClick={(e) => setFlipped(!flipped)}>
        {flipped ? card.back : card.front}
      </button>
      <button onClick={handleDeleteCard} className="delete-button">
        Delete
      </button>
    </li>
  );
}
