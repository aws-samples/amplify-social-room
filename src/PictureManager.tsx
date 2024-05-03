import { getUrl, remove, uploadData } from "aws-amplify/storage";
import { useEffect, useState } from "react";
import { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import { Button, Flex, Heading } from "@aws-amplify/ui-react";

type PictureManagerProps = {
  roomId: string;
};

const client = generateClient<Schema>();

export function PictureManager({ roomId }: PictureManagerProps) {
  const [pictures, setPictures] = useState<Schema["Picture"]["type"][]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [haiku, setHaiku] = useState<string>();

  useEffect(() => {
    const roomSub = client.models.Picture.observeQuery({
      filter: {
        roomId: {
          eq: roomId,
        },
      },
    }).subscribe({
      next: async ({ items }) => {
        setPictures([...items]);
      },
    });

    const haikuSub = client.subscriptions.onGenerateHaiku({
      roomId
    }).subscribe({
      next: (value) => value && setHaiku(value.content)
    })

    return () => {
      roomSub.unsubscribe();
      haikuSub.unsubscribe()
    }
  }, [roomId]);

  useEffect(() => {
    async function fetchUrls() {
      const imageUrls = (
        await Promise.all(
          pictures.map(async (item) => await getUrl({ path: item.path }))
        )
      ).map((item) => item.url.toString());
      setImageUrls(imageUrls);
    }
    fetchUrls();
  }, [pictures]);

  return (
    <>
      {imageUrls.length > 0 ? (
        <div className="picture-gallery">
          <div>Uploaded pictures</div>
          <Flex justifyContent={"space-evenly"}>
            {imageUrls.map((url) => (
              <img key={url} className="picture-img" src={url} />
            ))}
          </Flex>
          {haiku && (
            <Heading level={4} margin={"1rem"} textAlign={'start'}>
              {haiku
                .split(/([,.])/)
                .map(value => value === ',' || value === '.' ? [value, <br />] : [value])}
            </Heading>
          )}
        </div>
      ) : null}

      <div className="picture-layout">
        <Button variation="primary" backgroundColor="white" color="black">
          <label htmlFor="picture-uploader">+ Add Picture</label>
        </Button>
        <input
          style={{ display: "none" }}
          type="file"
          accept="image/png"
          id="picture-uploader"
          onInput={async (e) => {
            const file = e.currentTarget.files?.[0];
            if (!file) {
              return;
            }

            const result = await uploadData({
              path: `room/${roomId}/${file.name}`,
              data: file,
            }).result;

            client.models.Picture.create({
              roomId,
              path: result.path,
            });
          }}
        />

        <Button
          variation="primary"
          backgroundColor="white"
          color="black"
          onClick={async () => {
            await Promise.all(
              pictures.map((item) => remove({ path: item.path }))
            );
            await Promise.all(
              pictures.map((item) => client.models.Picture.delete(item))
            );
            setHaiku("");
          }}
        >
          Clear files
        </Button>

        <Button
          variation="primary"
          backgroundColor="white"
          color="black"
          onClick={async () => {
            const { data, errors } = await client.mutations.generateHaiku({
              roomId,
            });
            console.log("errors", errors);
            if (data !== null) {
              setHaiku(data.content);
            }
          }}
        >
          Generate Haiku
        </Button>
      </div>
    </>
  );
}
