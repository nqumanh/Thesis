import { Tooltip } from "@mui/material";
import { Box, styled } from "@mui/system";

const MessageRowRight = styled(Box)(() => ({
    display: "flex",
    justifyContent: "flex-end",
}))

function MessageRight({ message, createdTime }) {
    return (
        <MessageRowRight>
            <Tooltip title={createdTime} placement="left">
                <Box bgcolor="primary.main" sx={{ px: 2, py: 1, borderRadius: '20px', m: 1, maxWidth: "60%", color: '#fff' }}>
                    {message}
                </Box>
            </Tooltip>
        </MessageRowRight>
    );
}

export default MessageRight;