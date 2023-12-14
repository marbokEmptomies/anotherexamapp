import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/store';
import { registerUserAsync, clearUserState } from '../features/users/userSlice';
import { User } from '../server/types/types';
import { RootState } from '../store/rootReducer';

const RegisterForm: React.FC = () => {
    const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userState = useSelector((state: RootState) => state.users);

  const [formData, setFormData] = useState<User>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'user',
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
        dispatch(registerUserAsync(formData));
        navigate("/");
    } catch (error) {
        
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Etunimi:
        <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} />
      </label>
      <label>
        Sukunimi:
        <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} />
      </label>
      <label>
        Sähköposti:
        <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
      </label>
      <label>
        Salasana:
        <input type="password" name="password" value={formData.password} onChange={handleInputChange} />
      </label>
      <button type="submit" disabled={userState.status === 'loading'}>Rekisteröidy</button>
    </form>
  );
};

export default RegisterForm;
