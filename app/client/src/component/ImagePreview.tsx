import { Button, Image } from "antd";
import { useState } from "react";
import { randomID } from "../helper/util";

export function ImagePreview({ src }: { src: string }) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Image
        key={Date.now()}
        style={{ display: "none" }}
        src={src + "?" + randomID()}
        preview={{
          visible: visible,
          src: src + "?" + randomID(),
          onVisibleChange: () => {
            setVisible(false);
          },
        }}
      />
      <Button
        color="primary"
        variant="link"
        size="small"
        onClick={() => {
          setVisible(true);
        }}
      >
        [Lampiran]
      </Button>
    </>
  );
}
