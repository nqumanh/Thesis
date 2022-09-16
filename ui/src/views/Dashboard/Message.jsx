import React, { useState, useEffect } from "react";
import axios from "axios";
import "./message.css";

export default function Profile() {
  const [messages, setMessages] = useState([]);

  const username = sessionStorage.getItem("username");
  const id = sessionStorage.getItem("id");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/message/${username}`)
      .then((response) => setMessages(response.data))
      .catch((error) => console.log(error));
  }, [username]);

  let displayedMessages = [...messages].map((message) => {
    let justify = message.sender_id === id ? "message-right" : "message-left";
    return {
      message: message.message,
      display: justify,
    };
  });

  let educatorList = [
    ...new Set(messages.map((message) => message.sender_id)),
  ].filter((message) => message !== id);

  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    axios
      .post(`http://localhost:5000/get-contacts`, { listId: educatorList })
      .then((response) => setContacts(response.data))
      .catch((error) => console.log(error));
  }, [educatorList]);

  return (
    <div className="card">
      <div className="container">
        <div className="row">
          <div className="col-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Conversation</h5>
                <ul className="list-group list-group-flush">
                  {contacts.map((message, index) => (
                    <li className="list-group-item" key={index}>
                      {message}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="col-9">
            <div className="card">
              <div className="card-body">
                <div className="d-inline">
                  {displayedMessages.map((message, index) => (
                    <div className={`${message.display}`} key={index}>
                      {message.message}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
