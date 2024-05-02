import { generateClient } from "aws-amplify/data"
import { Schema } from "../amplify/data/resource"
import { defaultRoom } from "./utils";
import { useEffect, useState } from "react";

const client = generateClient<Schema>()

export function RoomSelector({
  currentRoomId,
  onRoomChange
}: {
  currentRoomId: string,
  onRoomChange: (roomId: string) => void
}) {

  const [rooms, setRooms] = useState<Schema["Room"]["type"][]>([defaultRoom])
  
  useEffect(() => {
    const sub = client.models.Room.observeQuery().subscribe({
      next: (data) => {
        setRooms([defaultRoom, ...data.items])
      }
    })
    return () => sub.unsubscribe()
  }, [])

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