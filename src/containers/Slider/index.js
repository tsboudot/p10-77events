import React, { useEffect, useState } from "react"; // Importez React
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";
import "./style.scss";

const Slider = () => {

    const { data } = useData();


    const [index, setIndex] = useState(0);


    const byDateDesc = (data?.focus?.sort((evtA, evtB) =>
        new Date(evtA.date) - new Date(evtB.date)
    )) || [];


    const handleRadioClick = (eventTitle) => {
        console.log("Radio button clicked with eventId:", eventTitle);

        const newIndex = byDateDesc.findIndex(event => event.title === eventTitle);

        console.log("New index after radio click:", newIndex);

        setIndex(newIndex);
    };


    const nextCard = () => setTimeout(() => {
        console.log("Calling nextCard function");

        setIndex(prevIndex => {
            const newIndex = (prevIndex < byDateDesc.length - 1 ? prevIndex + 1 : 0);
            console.log("Auto changing to index:", newIndex);
            return newIndex;
        });
    }, 5000);


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