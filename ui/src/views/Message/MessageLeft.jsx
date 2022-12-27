import { Box, styled } from "@mui/system";

const MessageRowLeft = styled(Box)(() => ({
    display: "flex",
    justifyContent: "flex-start"
}))

function MessageLeft({ message }) {
    return (
        <MessageRowLeft>
            <Box sx={{ px: 2, py: 1, backgroundColor: '#eee', borderRadius: '20px', m: 1, maxWidth: "60%"}}>
                {message}
            </Box>
        </MessageRowLeft>
    );
}

export default MessageLeft;