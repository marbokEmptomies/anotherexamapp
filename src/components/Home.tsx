import {useNavigate} from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

  return (
    <div>
        <h1>Tenttikokoelma</h1>
        <p>Kulkuset, jne.</p>
        <button onClick={() => navigate(`/create-exam`)}>Luo uusi tentti</button>
        <button onClick={() => navigate(`/exams`)}>Kaikki tentit</button>
    </div>
  )
}

export default Home