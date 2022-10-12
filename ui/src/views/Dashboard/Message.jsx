import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./message.css";

export default function Profile() {
  const [typingMessage, setTypingMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem("token");
  const username = sessionStorage.getItem("username");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/message/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setMessages(response.data))
      .catch((error) => console.log(error));
  }, [username, token]);

  let displayedMessages = messages.map((message) => {
    let justify =
      message.sender_id === username ? "message-right" : "message-left";
    return {
      message: message.message,
      display: justify,
    };
  });

  let contacts = messages.map((message) => {
    if (message.id === message.sender_id)
      return {
        name: message.receiver_id,
        sender: "You: ",
        message: message.message,
      };
    return {
      name: message.sender_id,
      sender: "",
      message: message.message,
    };
  });
  let unique = new Map();
  for (let i = 0; i < contacts.length; i++) {
    unique.set(contacts[i].name, contacts[i]);
  }
  contacts = [...unique.values()];
  contacts = contacts.filter((contact) => contact.name !== username);

  const onSubmit = (e) => {
    e.preventDefault();
    if (typingMessage === "") return;
    setMessages([
      ...messages,
      {
        sender_id: username,
        receiver_id: "30000010",
        message: typingMessage,
        created_time: new Date(),
      },
    ]);
    setTypingMessage("");
  };

  const handleTypingMessageChange = (e) => {
    let target = e.target;
    setTypingMessage(target.value);
  };

  return (
    <div>
      <nav className="ms-4 mt-3" aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link style={{ textDecoration: "none" }} to="/dashboard">
              Course
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Message
          </li>
        </ol>
      </nav>
      <div className="card m-4">
        <div className="container mt-4 mb-4">
          <div className="row">
            <div className="col-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Conversation</h5>
                  <ul
                    className="list-group list-group-flush scrollspy-example bg-light p-3 rounded-2 bg-white"
                    data-bs-spy="scroll"
                    data-bs-target="#navbar-example2"
                    data-bs-root-margin="0px 0px -40%"
                    data-bs-smooth-scroll="true"
                    tabIndex="0"
                  >
                    {contacts.map((contact, index) => (
                      <li className="list-group-item" key={index}>
                        <div>
                          <strong>{contact.name}</strong>
                        </div>
                        <p>
                          {contact.sender}
                          {contact.message}
                        </p>
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
                  <form className="d-flex mt-5" onSubmit={onSubmit}>
                    <input
                      type="text"
                      className="form-control me-2"
                      style={{ flex: "1" }}
                      placeholder="Type your message here"
                      value={typingMessage}
                      onChange={handleTypingMessageChange}
                    />
                    <button className="btn btn-primary" type="submit">
                      Send
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
