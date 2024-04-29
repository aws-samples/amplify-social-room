import { useEffect, useState } from 'react'
import './App.css'
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '../amplify/data/resource'
import { ControlPanel } from './ControlPanel'
import { CursorPanel } from './CursorPanel'
import { PictureManager } from './PictureManager'

function generateRandomEmoji() {
  // Array of emojis
  const emojis = ['😀', '😊', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😇', '😈', '🤡', '👿', '😉', '😊', '😋', '😌', '😍', '😎', '🥰', '😘', '😗', '😙', '😚', '☺️', '🙂', '🤗', '🤩', '🤔', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '😇', '🤑', '🤠', '🤡', '🥳', '🥸', '😈', '👿', '👹', '👺', '🤖', '💀', '👻', '👽', '👾', '🤖', '💩', '🙊', '💋', '💘', '💝', '💖', '💗', '💓', '💞', '💕', '💟', '❣️', '💔', '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '💯', '💢', '💥', '💫', '💦', '💨', '🐵', '🐒', '🦍', '🦧', '🐶', '🐕', '🦮', '🐕‍🦺', '🐩', '🐺', '🦊', '🦝', '🐱', '🐈', '🐈‍⬛', '🦁', '🐯', '🐅', '🐆', '🐴', '🐎', '🦄', '🦓', '🦌', '🐮', '🐂', '🐃', '🐄', '🐷', '🐖', '🐗', '🐽', '🐏', '🐑', '🐐', '🐪', '🐫', '🦙', '🦒', '🐘', '🦏', '🦛', '🐭', '🐁', '🐀', '🐹', '🐰', '🐇', '🐿️', '🦔', '🦇', '🐻', '🐨', '🐼', '🦥', '🦦', '🦨', '🦘', '🦡', '🐾', '🦃', '🐔', '🐓', '🐣', '🐤', '🐥', '🐦', '🐧', '🕊️', '🦅', '🦆', '🦢', '🦉', '🦚', '🦜', '🐸', '🐊', '🐢', '🦎', '🐍', '🐲', '🐉', '🦕', '🦖', '🐳', '🐋', '🐬', '🐟', '🐠', '🐡', '🦈', '🐙', '🐚', '🦀', '🦞', '🦐', '🦑', '🐌', '🦋', '🐛', '🐜', '🐝', '🐞', '🦗', '🕷️', '🕸️', '🦂', '💐', '🌸', '💮', '🏵️', '🌹', '🥀', '🌺', '🌻', '🌼', '🌷', '🌱', '🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '☘️', '🍀', '🍁', '🍂', '🍃', '🍇', '🍈', '🍉', '🍊', '🍋', '🍌', '🍍', '🥭', '🍎', '🍏', '🍐', '🍑', '🍒', '🍓', '🥝', '🍅', '🥥', '🥑', '🍆', '🥔', '🥕', '🌽', '🌶️', '🫑', '🥒', '🥬', '🥦', '🧄', '🧅', '🍄', '🥜', '🌰', '🍞', '🥐', '🥖', '🫓', '🥨', '🥯', '🥞', '🧇', '🧀', '🍖', '🍗', '🥩', '🥓', '🍔', '🍟', '🍕', '🌭', '🍿', '🧂', '🥫', '🍱', '🍘', '🍙', '🍚', '🍛', '🍜', '🍝', '🍠', '🍢', '🍣', '🍤', '🍥', '🥮', '🍡', '🥟', '🥠', '🥡', '🦀', '🦞', '🦐', '🦑', '🦪', '🍦', '🍧', '🍨', '🍩', '🍪', '🎂']
  const randomIndex = Math.floor(Math.random() * emojis.length);
  // Return the item at the randomly generated index
  return emojis[randomIndex];
}

const client = generateClient<Schema>()

const defaultRoom: Schema["Room"] = {
  id: "default",
  topic: "default",
  createdAt: "",
  updatedAt: ""
}

function App() {
  const [username, setUsername] = useState<string>(generateRandomEmoji())
  const [currentRoomId, setCurrentRoomId] = useState<string>("default")
  const [rooms, setRooms] = useState<Schema["Room"][]>([defaultRoom])
  
  useEffect(() => {
    const sub = client.models.Room.observeQuery().subscribe({
      next: (data) => {
        setRooms([defaultRoom, ...data.items])
      }
    })
    return () => sub.unsubscribe()
  }, [])

  return (
    <>
      <div className='cursor-panel'>
        <div className='info-panel'>
          <span>
            <PictureManager roomId={currentRoomId} />
            Move cursor around to broadcast cursor position to others in the room.
            <br />
            Built with <a href="https://docs.amplify.aws/gen2">AWS Amplify Gen 2</a>.
          </span>
        </div>
        <CursorPanel myUsername={username} currentRoomId={currentRoomId} />
      </div>
      <ControlPanel
        currentRoomId={currentRoomId}
        rooms={rooms}
        username={username}
        onRoomChange={setCurrentRoomId}
        onUsernameChange={() => setUsername(generateRandomEmoji())}
      />
    </>
  )
}

export default App
