import { useEffect, useLayoutEffect, useState } from "react";
import { Cursor } from "./Cursor";
import { throttle } from "throttle-debounce";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../amplify/data/resource";

type CursorPanelProps = {
  myUsername: string
  currentRoomId: string
}

const client = generateClient<Schema>()

export function CursorPanel({ myUsername, currentRoomId }: CursorPanelProps) {
  const [cursors, setCursors] = useState<Record<string, { x: number, y: number }>>({})
  const [myPosition, setMyPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 })


  useEffect(() => {
    // Add cursor subscriptions here
  }, [myUsername, currentRoomId])

  useEffect(() => { setCursors({}) }, [currentRoomId])

  useLayoutEffect(() => {
    const debouncedPublish = throttle(150, (username: string, x: number, y: number) => {
      // Add cursor publishing here
    }, {
      noLeading: true
    })

    function handleMouseMove(e: MouseEvent) {
      const x = Math.round(window.innerWidth / 2 - e.clientX)
      const y = Math.round(window.innerHeight / 2 - e.clientY)
      setMyPosition({ x, y })
      debouncedPublish(myUsername, x, y)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [myUsername, currentRoomId])
  return <>
    {Object.keys(cursors)
      .map(username =>
        <Cursor username={username} x={cursors[username].x} y={cursors[username].y} key={username} />)}
    <Cursor username={myUsername} x={myPosition.x} y={myPosition.y} myself key={myUsername} />
  </>
}