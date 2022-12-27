import { Box, styled } from "@mui/system";

const MessageRowRight = styled(Box)(() => ({
    display: "flex",
    justifyContent: "flex-end",
}))

function MessageRight({ message }) {
    return (
        <MessageRowRight>
            <Box bgcolor="primary.main" sx={{ px: 2, py: 1, borderRadius: '20px', m: 1, maxWidth: "60%", color: '#fff' }}>
                {message}
            </Box>
        </MessageRowRight>
    );
}

export default MessageRight;