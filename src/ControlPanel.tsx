import { RoomSelector } from "./RoomSelector";

export function ControlPanel(props: {
  currentRoomId: string,
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
          onRoomChange={props.onRoomChange}
        />
        | Cursor: <button onClick={props.onUsernameChange}>{props.username} (click to change)</button>
      </div>
    </div>
  )
}