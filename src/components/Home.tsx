import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/store';
import { clearUserState } from '../features/users/userSlice';

function Home() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isToken = localStorage.getItem('token')
  console.log("token: ", isToken)

  const handleLogout = () => {
    dispatch(clearUserState());
    navigate("/");
  }

  const renderButtons = () => {
    if (isToken !== null) {
      return (
        <>
          <button onClick={() => navigate(`/create-exam`)}>Luo uusi tentti</button>
          <button onClick={() => navigate(`/exams`)}>Kaikki tentit</button>
          <button onClick={handleLogout}>Kirjaudu ulos</button>
        </>
      );
    } else {
      return (
        <>
          <button onClick={() => navigate(`/register`)}>Rekisteröidy</button>
          <button onClick={() => navigate(`/login`)}>Kirjaudu sisään</button>
        </>
      );
    }
  };

  return (
    <div>
      {renderButtons()}
    </div>
  );
}

export default Home;
