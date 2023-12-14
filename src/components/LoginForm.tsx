import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store/store';
import { loginUserAsync, clearUserState } from '../features/users/userSlice';
import { RootState } from "../store/rootReducer";
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userState = useSelector((state: RootState) => state.users);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await dispatch(loginUserAsync(formData));
        navigate("/");
    } catch (error) {
        console.error("Error logging in: ", error)
    }
  };

  // Clear user state when the component unmounts
  /* useEffect(() => {
    return () => {
      dispatch(clearUserState());
    };
  }, [dispatch]); */


  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
      </label>
      <label>
        Password:
        <input type="password" name="password" value={formData.password} onChange={handleInputChange} />
      </label>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
