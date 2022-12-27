import * as React from 'react';
import Box from '@mui/material/Box';
import { Card, FormControlLabel, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { choooseTheme } from 'features/theme/themeSlice';

const ColorBox = ({ bgcolor, title, color }) => (
    <Card sx={{ mb: 3, minWidth: '150px' }}>
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                py: 4.5,
                bgcolor,
                color: color
            }}
        >
            {title && (
                <Typography variant="subtitle1" color={color}>
                    {title}
                </Typography>
            )}
            {!title && <Box sx={{ p: 1.15 }} />}
        </Box>

    </Card>
);

const ChooseTheme = () => {
    const themeName = useSelector(state => state.theme.name)
    const dispatch = useDispatch()
    const handleChange = (event) => {
        dispatch(choooseTheme(event.target.value));
    };

    return (
        <Box
            sx={{
                width: '100%',
                bgcolor: '#f9fafc',
                color: '#000',
                borderRadius: 1,
                p: 3,
                mb: 3,
            }}
        >
            <Typography sx={{ mb: 3 }}>
                Default mode
            </Typography>
            <RadioGroup
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                sx={{ display: 'flex', justifyContent: 'space-around', flexDirection: 'row' }}
                value={themeName}
                onChange={handleChange}
            >
                <div>
                    <ColorBox bgcolor="#ceccf8" color="blue" title="default" />
                    <Stack direction="row" justifyContent="center">
                        <FormControlLabel value="default" control={<Radio />} />
                    </Stack>
                </div>
                <div>
                    <ColorBox bgcolor="#000" color="#fff" title="dark" />
                    <Stack direction="row" justifyContent="center">
                        <FormControlLabel value="dark" control={<Radio />} />
                    </Stack>
                </div>
                <div>
                    <ColorBox bgcolor="#fff" color="#000" title="light" />
                    <Stack direction="row" justifyContent="center">
                        <FormControlLabel value="light" control={<Radio />} />
                    </Stack>
                </div>
            </RadioGroup>
        </Box>
    );
}

export default ChooseTheme;