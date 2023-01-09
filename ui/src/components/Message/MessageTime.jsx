import { Box } from "@mui/material";
import { GetDateDMY } from "utils";

function GetTimeHM(timeStr) {
    let time = new Date(timeStr)
    let hour = time.getHours()
    let minute = time.getHours()
    if (minute < 10) 
        minute = '0' + minute
    if (hour>=12){
        return `${hour-12}:${minute} PM`
    } else {
        return `${hour}:${minute} AM`
    }
}

function MessageTime({ createdTime }) {
    const time = GetDateDMY(createdTime) + ", " + GetTimeHM(createdTime)

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {time}
        </Box>
    );
}

export default MessageTime;