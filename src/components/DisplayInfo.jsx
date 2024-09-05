import React, { useState } from 'react';
import './DisplayInfo.css';

const DisplayInfo = () => {
  const [inputText, setInputText] = useState('');
  const [responses, setResponses] = useState([]); // Array to hold all sent and received messages
  const [isSubmitted, setIsSubmitted] = useState(false); // Track if the first prompt has been submitted

  const handleSubmit = async () => {
    try {
      const sentMessage = inputText; // Save the input text before clearing
      setInputText(''); // Clear the text area
      setIsSubmitted(true); // Set isSubmitted to true after the first submission

      // Temporarily add the sent message with an empty response
      setResponses(prevResponses => [
        ...prevResponses, 
        { sent: sentMessage, received: "" } 
      ]);

      const response = await fetch('http://192.168.43.57:5000/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputText: sentMessage }), // Send the saved input text
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();

      // Update the last response with the received message
      setResponses(prevResponses => {
        const newResponses = [...prevResponses];
        newResponses[newResponses.length - 1].received = data.message;
        return newResponses;
      });

    } catch (error) {
      console.error("Error:", error);

      // Update the last response with an error message
      setResponses(prevResponses => {
        const newResponses = [...prevResponses];
        newResponses[newResponses.length - 1].received = "Something went wrong!";
        return newResponses;
      });
    }
  };

  return (
    <div className="container">
      {!isSubmitted ? (
        <>
          <h1 className="greeting">Hello, Keshara</h1>
          <h2 className="subtext">How can I help you today?</h2>

          <div className="card-container">
            <div className="card">Draft an email to a recruiter to accept a job offer</div>
            <div className="card">Create trivia questions about a specific topic</div>
            <div className="card">Provide questions to help me prepare for an interview</div>
            <div className="card">Help explain a concept in a kid-friendly way</div>
          </div>

          <p className="info-text">
            Humans review some saved chats to improve Google AI. To stop this for future chats, turn off Gemini Apps Activity. 
            If this setting is on, don't enter info you wouldn’t want reviewed or used.
            <br/>
            <a href="#" className="info-link">How it works</a>
          </p>

          <div className="input-container">
            <textarea
              className="input-area"
              placeholder="Enter a prompt here"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            ></textarea>
            <div className="icons">
              <img src="src/assets/2.png" alt="Image Icon" className="icon" />
              <img src="src/assets/1.png" alt="Mic Icon" className="icon" />
              <button className="submit-button" onClick={handleSubmit}>Sub</button>
            </div>
          </div>
        </>
      ) : (
        <div className="scrollable-content">
          <div className="response-container">
            {responses.map((response, index) => (
              <div key={index}>
                <p className="send-text">{response.sent}</p>
                <p className="response-text">{response.received}</p>
                <br />
              </div>
            ))}
          </div>
          <div className="input-container">
            <textarea
              className="input-area"
              placeholder="Enter a prompt here"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            ></textarea>
            <div className="icons">
              <img src="src/assets/2.png" alt="Image Icon" className="icon" />
              <img src="src/assets/1.png" alt="Mic Icon" className="icon" />
              <button className="submit-button" onClick={handleSubmit}>Sub</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayInfo;