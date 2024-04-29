import { getUrl, remove, uploadData } from "aws-amplify/storage"
import { useEffect, useState } from "react"
import { Schema } from "../amplify/data/resource"
import { generateClient } from "aws-amplify/api"

type PictureManagerProps = {
  roomId: string
}

const client = generateClient<Schema>()

export function PictureManager({ roomId }: PictureManagerProps) {
  const [pictures, setPictures] = useState<Schema["Picture"][]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [haiku, setHaiku] = useState<string>()

  useEffect(() => {
    const sub = client.models.Picture.observeQuery({
      filter: {
        roomId: {
          eq: roomId
        }
      }
    }).subscribe(({
      next: async ({ items }) => { setPictures([...items]) }
    }))

    return () => sub.unsubscribe()
  }, [roomId])

  useEffect(() => {
    async function fetchUrls() {
        const imageUrls = (await Promise
          .all(pictures
            .map(async (item) => await getUrl({ path: item.path }))
          )).map(item => item.url.toString())
        setImageUrls(imageUrls)
    }
    fetchUrls() 
  }, [pictures])

  return <>
    {haiku && <div className="haiku-panel">
      {haiku}
    </div>}
    <div className="picture-gallery">
      {imageUrls.map(url => <img key={url} className='picture-img' src={url} />)}
    </div>
    <div>
      <button><label htmlFor="picture-uploader">+ Add Picture</label></button>
      <input style={{ display: 'none' }} type="file" accept="image/png" id="picture-uploader" onInput={async (e) => {
        const file = e.currentTarget.files?.[0]
        if (!file) { return }

        const result = await uploadData({
          path: `room/${roomId}/${file.name}`,
          data: file
        }).result

        client.models.Picture.create({
          roomId,
          path: result.path
        })

      }} />

      <button onClick={async () => {
        await Promise.all(pictures.map((item) => remove({ path: item.path })))
        await Promise.all(pictures.map((item) => client.models.Picture.delete(item)))
      }}>Clear files</button>

      <button onClick={async () => {
        const { data } = await client.queries.generateHaiku({ roomId })
        setHaiku(data)
      }}>Generate Haiku</button>
    </div>
  </>
}