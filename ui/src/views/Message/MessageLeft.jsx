import { Tooltip } from "@mui/material";
import { Box, styled } from "@mui/system";

const MessageRowLeft = styled(Box)(() => ({
    display: "flex",
    justifyContent: "flex-start"
}))

function MessageLeft({ message, createdTime }) {
    return (
        <MessageRowLeft>
            <Tooltip title={createdTime} placement="left">
                <Box sx={{ px: 2, py: 1, backgroundColor: '#eee', borderRadius: '20px', m: 1, maxWidth: "60%" }}>
                    {message}
                </Box>
            </Tooltip>
        </MessageRowLeft>
    );
}

export default MessageLeft;