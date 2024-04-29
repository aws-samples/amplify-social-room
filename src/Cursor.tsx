export function Cursor({ username, x, y, myself }: { username: string, x: number, y: number, myself?: boolean }) {
  return <div className='cursor' style={{
    background: 'rgba(255, 255, 255, 0.7)',
    left: window.innerWidth / 2 - x,
    top: window.innerHeight / 2 - y,
    transition: myself ? '' : 'all .35s ease-out',
  }}>{username}</div>
}
