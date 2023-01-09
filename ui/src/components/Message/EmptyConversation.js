import { Box, Typography } from "@mui/material";

function EmptyConversation() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', height: '100%', pb: 10, alignItems: 'center' }}>
            <Typography
                sx={{ m: 1 }}
                variant="h5"
            >
                Select a chat
            </Typography>
        </Box>
    );
}

export default EmptyConversation;