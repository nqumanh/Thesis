import React, { useState, useEffect, useRef } from "react";
import "./Message.css";
import { alpha, Box, Button, Card, Container, Divider, Grid, IconButton, List, ListItemButton, ListItemText, styled, TextField, Typography } from "@mui/material";
import { Send } from "@mui/icons-material";
import MessageLeft from "./MessageLeft";
import MessageRight from "./MessageRight";
// import { v4 as uuidv4 } from 'uuid';
import EmptyConversation from "./EmptyConversation";
import { useDispatch, useSelector } from "react-redux";
import { fetchChannels, setCurrentChannel } from "features/message/messageSlice";
import { createNewChannel, getMesseges, sendMessage } from "api";
import MessageTime from "./MessageTime";
// import SearchUser from "./SearchUser";
// import UserList from "./UserList";

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
    const [onChatChannel, setOnChatChannel] = useState(null)
    // const [onSearch, setOnSearch] = useState(false)

    const channels = useSelector(state => state.message.channels)
    const currentChannelId = useSelector(state => state.message.currentChannelId)

    useEffect(() => {
        if (channels.length === 0) //stop fetch channels because at first chat, the channel have not been in database if it has no message
            dispatch(fetchChannels(id))
    }, [dispatch, id, channels.length])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        getMesseges(currentChannelId).then((res) => {
            setMessages(res.data)
        }).catch((err) => { console.log(err) })

        setOnChatChannel(channels.find(x => x.id === currentChannelId))
    }, [currentChannelId, channels])

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (typingMessage === "") return;
        if (messages.length === 0) {
            let participants = [id, channels.find(x => x.id === currentChannelId).userId].join(" ")
            await createNewChannel(currentChannelId, '', '', participants).then((res) => {
                console.log(res.data)
            }).catch((err) => {
                console.log(err)
            })
        }
        let newMessage = {
            channelId: currentChannelId,
            senderId: id,
            message: typingMessage,
        }
        await sendMessage(newMessage).then((res) => {
            setMessages(messages => [...messages, res.data]);
            dispatch(fetchChannels(id))
        }).catch((err) => { console.log(err) })

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
                        <Box sx={{ height: '80vh', borderRight: '1px solid #eee' }}>
                            <Box sx={{
                                alignItems: 'center',
                                display: 'flex',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                m: -1,
                                p: 2,
                                height: '80px'
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
                            {/* <Divider />
                            <SearchUser onSearch={onSearch} setOnSearch={setOnSearch} /> */}
                            <Divider />
                            {
                                <Box
                                    overflow="auto"
                                    flex={1}
                                    flexDirection="column"
                                    display="flex"
                                    sx={{ height: '75%' }}
                                >
                                    {/* {onSearch ? <UserList /> : */}
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
                                    {/* } */}
                                </Box>
                            }
                        </Box>
                    </Grid>

                    <Grid item xs={9}>
                        {currentChannelId ?
                            <Box display="flex" flexDirection="column" sx={{ height: '80vh' }}>
                                <Box sx={{
                                    alignItems: 'center',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    m: -1,
                                    p: 2,
                                    height: '80px',
                                }}>
                                    <Button>
                                        {onChatChannel?.name}
                                    </Button>
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
                                            // {index === 1 ? <MessageTime createdTime={message.createdTime} /> : <MessageTime createdTime={message.createdTime} />}
                                            <>
                                                {index % 5 === 0 && <MessageTime createdTime={message.createdTime} />}
                                                {message.senderId === id ?
                                                    <Box key={message.id}>
                                                        <MessageRight message={message.message} createdTime={message.createdTime} />
                                                    </Box>
                                                    :
                                                    <Box key={message.id}>
                                                        <MessageLeft message={message.message} createdTime={message.createdTime} />
                                                    </Box>}
                                            </>
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
