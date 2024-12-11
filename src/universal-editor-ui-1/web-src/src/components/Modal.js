import React, { useState, useEffect } from "react";
import { attach } from "@adobe/uix-guest";
import {
  Provider,
  Content,
  defaultTheme,
  Button,
  Text
} from "@adobe/react-spectrum";
import { extensionId } from "./Constants";
import Copy from "@spectrum-icons/workflow/Copy";

const Modal = () => {
  const [guestConnection, setGuestConnection] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    (async () => {
      const guestConnection = await attach({ id: extensionId });

      setGuestConnection(guestConnection);
      setLoading(false)
    })();
  }, []);

  const onCloseHandler = () => {
    guestConnection.host.modal.close();
  };
  const onCopyHandler = () => {
    console.log("copy logic pending")
  };
    return (
        !loading ? <Provider theme={defaultTheme} colorScheme="light">
            <Content width="100%">
            Some content of mine
                <Button variant="accent" onPress={onCopyHandler} position="fixed" bottom="0px" right="100px" >
                  <Copy />
                  <Text>Copy to Clipboard</Text>
                 </Button>
                <Button variant="primary" onPress={onCloseHandler} position="fixed" bottom="0px" right="8px">
                    Close
                 </Button>
            </Content>
        </Provider> : <Content>Loading....</Content>
    );
}


export default Modal;
