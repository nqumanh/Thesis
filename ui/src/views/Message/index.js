import React, { useState, useEffect, useRef } from "react";
import "./Message.css";
import { alpha, Box, Card, Container, Divider, Grid, IconButton, List, ListItemButton, ListItemText, styled, TextField, Typography } from "@mui/material";
import { Send } from "@mui/icons-material";
import MessageLeft from "./MessageLeft";
import MessageRight from "./MessageRight";
// import { v4 as uuidv4 } from 'uuid';
import EmptyConversation from "./EmptyConversation";
import { useDispatch, useSelector } from "react-redux";
import { fetchChannels, setCurrentChannel } from "features/message/messageSlice";

const ODD_OPACITY = 0.2;

const ChatMenuItem = styled(ListItemButton)(({ theme }) => ({
    '&.selected': {
        backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
    },
    '&': {
        marginLeft: '2px',
        marginRight: '2px',
        borderRadius: '10px',
    },
}))

export default function Message() {
    const dispatch = useDispatch()
    const id = localStorage.getItem("id")
    const bottomRef = useRef(null);

    const [typingMessage, setTypingMessage] = useState('')
    const [messages, setMessages] = useState([]);
    const channels = useSelector(state => state.message.channels)
    const currentChannelId = useSelector(state => state.message.currentChannelId)

    useEffect(() => {
        if (channels.length === 0)
            dispatch(fetchChannels(id))
    }, [dispatch, id, channels.length])

    useEffect(() => {
        // 👇️ scroll to bottom every time messages change
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(11, typingMessage)
        if (typingMessage === "") return;
        let time = new Date()
        setMessages(messages => [
            ...messages,
            {
                channelId: currentChannelId,
                senderId: id,
                message: typingMessage,
                createdTime: time
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

            <Card sx={{ overflow: 'hidden', mt: 3 }}>
                <Grid container>
                    <Grid item xs={3}>
                        <Box sx={{ height: '70vh', borderRight: '1px solid #eee' }}>
                            <Box sx={{
                                alignItems: 'center',
                                display: 'flex',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                m: -1,
                                p: 2,
                            }}>
                                <Typography
                                    sx={{ m: 1 }}
                                    variant="h5"
                                >
                                    Chats
                                </Typography>

                                {/* <IconButton color="primary" aria-label="create channel" component="label" sx={{ backgroundColor: "#eeeeee" }}>
                                    <BorderColor />
                                </IconButton> */}
                            </Box>
                            <Divider />
                            <Box
                                overflow="auto"
                                flex={1}
                                flexDirection="column"
                                display="flex"
                            >
                                <List component="nav" aria-label="secondary mailbox folder">
                                    {channels.map((channel) =>
                                        <ChatMenuItem
                                            key={channel.id}
                                            className={channel.id === currentChannelId && 'selected'}
                                            onClick={() => dispatch(setCurrentChannel(channel.id))}
                                        >
                                            <ListItemText primary={channel.name} />
                                        </ChatMenuItem>
                                    )}
                                </List>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={9}>
                        {currentChannelId ?
                            <Box display="flex" flexDirection="column" sx={{ height: '70vh' }}>
                                <Box sx={{
                                    alignItems: 'center',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    m: -1,
                                    p: 2,
                                }}>
                                    <Typography
                                        sx={{ m: 1 }}
                                        variant="h5"
                                    >
                                        {channels.find(channel => channel.id === currentChannelId).name}
                                    </Typography>
                                </Box>
                                <Divider />
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    flex={1}
                                    flexDirection="column"
                                    sx={{
                                        p: 2, height: '85%'
                                    }}
                                >
                                    <Box overflow="auto" id="scroll" bgcolor="white" mb={2}>
                                        {messages.map((message, index) =>
                                            message.senderId === id ?
                                                <MessageRight message={message.message} />
                                                :
                                                <MessageLeft message={message.message} />
                                        )}
                                        <div ref={bottomRef} />
                                    </Box>
                                    <form onSubmit={(e) => handleSubmit(e)}>
                                        <Box sx={{ mx: 1, display: 'flex', justifyContent: 'space-between' }}>
                                            <TextField
                                                sx={{ display: 'flex', width: '90%' }}
                                                placeholder="Type your message here"
                                                value={typingMessage}
                                                onChange={handleTypingMessageChange}
                                            />
                                            <IconButton
                                                type='submit'
                                                color="primary"
                                                aria-label="send message"
                                            >
                                                <Send />
                                            </IconButton>
                                        </Box>
                                    </form>
                                </Box>
                            </Box>
                            :
                            <EmptyConversation />
                        }
                    </Grid>
                </Grid>
            </Card>
        </Container >
    );
}
