import { useState, useEffect } from "react";
import JoggingImage from "../Assets/jogging.jpg";
import GymImage from "../Assets/gym.jpg";

interface QuoteData {
  content: string;
  author: string;
}

type QuotesProps = {
  isRaining?: boolean;
};

const Quotes: React.FC<QuotesProps> = ({ isRaining }) => {
  const [quote, setQuote] = useState<QuoteData | null>({
    content: "Loading quote...",
    author: "Unknown",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.onLine) {
      setQuote({ content: "No internet connection.", author: "System" });
      setLoading(false);
      return;
    }

    fetch("https://api.quotable.io/random")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json() as Promise<QuoteData>;
      })
      .then((data) => {
        setQuote(
          data && data.content && data.author
            ? data
            : { content: "Failed to load quote.", author: "Unknown" }
        );
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching quote:", error);
        setQuote({ content: "Failed to fetch quote.", author: "Unknown" });
        setLoading(false);
      });
  }, []);

  const imageSrc = isRaining ? GymImage : JoggingImage;

  if (loading) {
    return <div>Loading quote...</div>;
  }

  return (
    <div>
      <blockquote>
        <p>{quote?.content}</p>
        <footer>{quote?.author}</footer>
      </blockquote>
      <img
        src={imageSrc}
        alt={isRaining ? "Gym workout" : "Jogging outside"}
        style={{ width: "500px", height: "auto" }}
      />
      <p>
        {isRaining
          ? "It is raining today, so hit the gym!"
          : "Nice weather today - go for a jog!"}
      </p>
    </div>
  );
};

export default Quotes;
