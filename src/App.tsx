import { useState } from 'react'
import './App.css'
import { ControlPanel } from './ControlPanel'
import { CursorPanel } from './CursorPanel'
import { defaultRoom, generateRandomEmoji } from './utils'

function App() {
  const [username, setUsername] = useState<string>(generateRandomEmoji())
  const [currentRoomId, setCurrentRoomId] = useState<string>(defaultRoom.id)
  
  return (
    <>
      <div className='cursor-panel'>
        <div className='info-panel'>
          <span>
            Move cursor around to broadcast cursor position to others in the room.
            <br />
            Built with <a href="https://docs.amplify.aws/gen2">AWS Amplify Gen 2</a>.
          </span>
        </div>
        <CursorPanel myUsername={username} currentRoomId={currentRoomId} />
      </div>
      <ControlPanel
        currentRoomId={currentRoomId}
        username={username}
        onRoomChange={setCurrentRoomId}
        onUsernameChange={() => setUsername(generateRandomEmoji())}
      />
    </>
  )
}

export default App
