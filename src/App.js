import { useState } from "react";
import Header from "./components/Header";
import Feedbacklist from "./components/FeedbackList";
import FeedbackData from "./data/FeedbackData";

function App() {
  const [feedback, setFeedback] = useState(FeedbackData);
  return (
    <>
      <Header />
      <div className="container">
        <Feedbacklist feedback={feedback} />
      </div>
    </>
  );
}

export default App;
