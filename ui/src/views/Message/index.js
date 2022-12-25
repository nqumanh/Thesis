import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Message.css";
import { Box, Button, Card, Container, Grid, Stack, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Message() {
    const [typingMessage, setTypingMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const navigate = useNavigate()

    useEffect(() => {
        axios
            .get(`http://localhost:5000/message/${username}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => setMessages(response.data))
            .catch((error) => {
                localStorage.clear()
                navigate('/login')
                console.log(error)
            });
    }, [username, token, navigate]);

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
        <Container maxWidth={false}>
            <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    m: -1
                }}
            >
                <Typography
                    sx={{ m: 1 }}
                    variant="h4"
                >
                    Conversation
                </Typography>
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <Card>
                        <ul>
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
                    </Card>
                </Grid>
                <Grid item xs={9}>
                    <Card sx={{ p: 3 }}>
                        {displayedMessages.map((message, index) => (
                            <div className={`${message.display}`} key={index}>
                                {message.message}
                            </div>
                        ))}
                        <form className="d-flex mt-5" onSubmit={onSubmit}>
                            <Stack direction="row" spacing={2} justifyContent="space-around">
                                <TextField
                                    sx={{ minWidth: "80%" }}
                                    placeholder="Type your message here"
                                    value={typingMessage}
                                    onChange={handleTypingMessageChange}
                                />
                                <Button type="submit" variant="contained" color="primary">
                                    Send
                                </Button>
                            </Stack>
                        </form>
                    </Card>
                </Grid>
            </Grid>
            {/* <div className="card m-4">
                <div className="container mt-4 mb-4">
                    <div className="row">
                        <div className="col-3">
                            <div className="card">
                                <div className="card-body">
                                    <h2>Conversation</h2>
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
            </div> */}
        </Container>
    );
}
