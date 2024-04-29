import { Schema } from "../amplify/data/resource";
import { RoomSelector } from "./RoomSelector";

export function ControlPanel(props: {
  currentRoomId: string,
  rooms: Schema["Room"][],
  onRoomChange: (roomId: string) => void,
  username: string,
  onUsernameChange: React.MouseEventHandler<HTMLButtonElement>,
}) {

  return (
    <div className='control-panel-container'>
      <div className="control-panel">
        Room
        <RoomSelector
          currentRoomId={props.currentRoomId}
          rooms={props.rooms}
          onRoomChange={props.onRoomChange}
        />
        | Cursor: <button onClick={props.onUsernameChange}>{props.username} (click to change)</button>
      </div>
    </div>
  )
}