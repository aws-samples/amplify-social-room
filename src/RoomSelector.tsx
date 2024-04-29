import { generateClient } from "aws-amplify/data"
import { Schema } from "../amplify/data/resource"

const client = generateClient<Schema>()

export function RoomSelector({
  rooms,
  currentRoomId,
  onRoomChange
}: {
  rooms: Schema["Room"]["type"][],
  currentRoomId: string,
  onRoomChange: (roomId: string) => void
}) {
  return <>
    <select
      onChange={e => onRoomChange(e.target.value)}
      value={currentRoomId}>
      {rooms.map(room => <option value={room.id} key={room.id}>{room.topic}</option>)}
    </select>
    <button onClick={async () => {
      const newRoomName = window.prompt("Room name")
      if (!newRoomName) {
        return
      }
      const { data: room } = await client.models.Room.create({
        topic: newRoomName
      })
      
      if (room !== null) {
        onRoomChange(room.id)
      }
    }}>[+ add]</button>
  </>
}