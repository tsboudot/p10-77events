import React, { useEffect, useState } from "react"; // Importez React
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";
import "./style.scss";

const Slider = () => {
    // Utilisez une fonction personnalisée pour récupérer les données nécessaires pour le composant
    const { data } = useData();

    // Utilisez l'état pour suivre l'index de la carte actuellement affichée
    const [index, setIndex] = useState(0);

    // Triez les données par date en ordre décroissant
    const byDateDesc = (data?.focus?.sort((evtA, evtB) =>
        new Date(evtB.date) - new Date(evtA.date)
    )) || [];

    // Gérez le clic sur les boutons radio pour changer la carte affichée
    const handleRadioClick = (eventTitle) => {
        console.log("Radio button clicked with eventId:", eventTitle);

        const newIndex = byDateDesc.findIndex(event => event.title === eventTitle);

        console.log("New index after radio click:", newIndex);

        setIndex(newIndex);
    };

    // Fonction pour faire défiler automatiquement les cartes toutes les 5 secondes
    const nextCard = () => setTimeout(() => {
        console.log("Calling nextCard function");

        setIndex(prevIndex => {
            const newIndex = (prevIndex < byDateDesc.length - 1 ? prevIndex + 1 : 0);
            console.log("Auto changing to index:", newIndex);
            return newIndex;
        });
    }, 5000);

    // Utilisez useEffect pour démarrer le timer une fois que le composant est monté
    useEffect(() => {
        console.log("Setting up the timer for auto slide");

        const timer = nextCard();

        console.log("timer ID:", timer);

        return () => {
            console.log("Clearing timer with ID:", timer);
            clearTimeout(timer);
        };
    }, [index]);
    return (
        <div className="SlideCardList">
            {/* Parcourez et affichez toutes les cartes */}
            {byDateDesc.map((event, idx) => (
                <React.Fragment key={event.title}>
                    <div
                        className={`SlideCard SlideCard--${index === idx ? "display" : "hide"}`}
                    >
                        <img src={event.cover} alt="forum" />
                        <div className="SlideCard__descriptionContainer">
                            <div className="SlideCard__description">
                                <h3>{event.title}</h3>
                                <p>{event.description}</p>
                                <div>{getMonth(new Date(event.date))}</div>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            ))}
            {/* Affichez les boutons radio pour permettre à l'utilisateur de changer manuellement de carte */}
            <div className="SlideCard__paginationContainer">
                <div className="SlideCard__pagination">
                    {byDateDesc.map((event, idx) => (
                        <input
                            key={`radio-${event.title}`}
                            type="radio"
                            name="radio-button"
                            checked={index === idx}
                            onChange={() => {
                                console.log(`Radio button for index ${idx} is being changed.`);
                                handleRadioClick(event.title);
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Slider;