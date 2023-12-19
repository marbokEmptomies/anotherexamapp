import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/store';
import { clearUserState } from '../features/users/userSlice';

function Home() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isToken = localStorage.getItem('token')

  const handleLogout = () => {
    dispatch(clearUserState());
    navigate("/");
  }

  const renderButtons = () => {
    if (isToken !== null) {
      return (
        <>
          <h1>Tervetuloa!</h1>
        </>
      );
    } else {
      return (
        <>
          <h2>Kirjaudu sisään tai rekisteröidy</h2>
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
