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
    const handleRadioClick = (eventId) => {
        const newIndex = byDateDesc.findIndex(event => event.id === eventId);
        setIndex(newIndex);
    };

    // Fonction pour faire défiler automatiquement les cartes toutes les 5 secondes
    const nextCard = () => setTimeout(() => {
        // Utilisez un rappel pour déterminer le prochain index en fonction du précédent
        setIndex(prevIndex => (prevIndex < byDateDesc.length - 1 ? prevIndex + 1 : 0));
    }, 5000);

    // Utilisez useEffect pour démarrer le timer une fois que le composant est monté
    useEffect(() => {
        const timer = nextCard();
        console.log("timer ID:", timer); // Ceci affichera l'ID du timer.
        return () => clearTimeout(timer);
    }, [index]);

    return (
        <div className="SlideCardList">
            {/* Parcourez et affichez toutes les cartes */}
            {byDateDesc.map((event, idx) => (
                <React.Fragment key={event.id}>
                    <div
                        className={`SlideCard SlideCard--${index === idx ? "display" : "hide"}`}
                    >
                        <img src={event.cover} alt="forum" />
                        <div className="SlideCard__descriptionContainer">
                            <div className="SlideCard__description">
                                <h3>{event.title}</h3>
                                <p>{event.description}</p>
                                {/* Assurez-vous que la fonction getMonth est définie pour afficher correctement le mois */}
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
                            key={`radio-${event.id}`}
                            type="radio"
                            name="radio-button"
                            checked={index === idx}
                            onChange={() => handleRadioClick(event.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Slider;
