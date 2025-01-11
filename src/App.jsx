import './App.css'
import GamePage from './components/GamePage'

function App() {
  return (
    <>
    <div className='main'>
    <GamePage></GamePage></div>
    <div className='Mainbackground'>
    <div id="controls">
        <span className="control-item">
          <span className="key">Space</span> Jugar/Restart
        </span>
        <span className="control-item">
          <span className="key">M</span> Silencio
        </span>
        <span className="control-item">
          <span className="key pixel-icon"><i className='bx bx-chevron-left'></i></span>
          <span className="key pixel-icon"><i className='bx bx-chevron-right'></i></span> Mover
        </span>
        <span className="control-item">
          <span className="key pixel-icon"><i className='bx bx-chevron-up'></i></span>
          <span className="key pixel-icon"><i className='bx bx-chevron-down'></i></span> Mover
        </span>
      </div>

      </div></>
  )
}

export default App
