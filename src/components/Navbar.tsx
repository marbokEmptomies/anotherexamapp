import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CabinIcon from '@mui/icons-material/Cabin';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { clearUserState } from '../features/users/userSlice';
import { postExam } from '../features/exams/examsSlice';
import { useAppDispatch } from '../store/store';
import {Exam} from '../server/types/types'

export default function NavBar() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const isToken = localStorage.getItem('token')

    const handleLogout = () => {
        dispatch(clearUserState());
        navigate("/");
    }
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    {isToken &&<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Button color="inherit" onClick={() => navigate('/')}><CabinIcon /></Button>
                        <Button color="inherit" onClick={() => navigate('/exams')}>Kaikki tentit</Button>
                    </Typography>}
                    {isToken !== null ? (
                        <Button color="inherit" onClick={handleLogout}>Kirjaudu ulos</Button>
                    ) : (
                        <>
                        <Button color="inherit" onClick={() => navigate('/login')}>Kirjaudu sisään</Button>
                        <Button color="inherit" onClick={() => navigate('/register')}>Rekisteröidy</Button>
                        </>
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    );
}
