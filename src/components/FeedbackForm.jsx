import { useState, useContext, useEffect } from "react";
import RatingSelect from "./RatingSelect";
import Card from "./shared/Card";
import Button from "./shared/Button";
import FeedbackContext from "../context/FeedbackContext";

function FeedbackForm() {
  const [text, setText] = useState("");
  const [rating, setRating] = useState(10);
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [message, setMessage] = useState("");

  const { addFeedback, feedbackEdit } = useContext(FeedbackContext);

  useEffect(() => {
    if (feedbackEdit.edit) {
      setBtnDisabled(false);
      setText(feedbackEdit.item.text);
      setRating(feedbackEdit.item.rating);
    }
  }, [feedbackEdit]);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);

    if (newText === "") {
      setBtnDisabled(true);
      setMessage(null);
    } else if (newText.trim().length <= 10) {
      setMessage("Metin en az 10 karakter olmalıdır");
      setBtnDisabled(true);
    } else {
      setMessage(null);
      setBtnDisabled(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setMessage("Geri bildirim gönderiliyor...");
      const response = await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, rating }),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage("Geri bildirim başarıyla gönderildi!");
      } else {
        console.error(`Sunucu şu şekilde yanıt verdi: ${response.status}`);
        const errorMessage = await response.text();
        setMessage(`Geri bildirim kaydedilemedi: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Geri bildirim gönderme hatası:", error);
      setMessage("Geri bildirim kaydedilemedi. Lütfen daha sonra tekrar deneyin.");
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <h2>Bizimle olan hizmetinizi nasıl değerlendirirsiniz?</h2>
        <RatingSelect select={(newRating) => setRating(newRating)} />
        <div className="input-group">
          <input
            onChange={handleTextChange}
            type="text"
            placeholder="İnceleme yazın"
            value={text}
          />
          <Button type="Submit" isDisabled={btnDisabled}>
            Gönder
          </Button>
        </div>
        {message && <div className="message">{message}</div>}
      </form>
    </Card>
  );
}

export default FeedbackForm;
