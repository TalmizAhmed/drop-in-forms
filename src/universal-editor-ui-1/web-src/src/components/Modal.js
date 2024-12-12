import React, {useState, useEffect, useRef} from "react";
import { attach } from "@adobe/uix-guest";
import {
  Provider,
  Content,
  defaultTheme,
  Button,
  Text,
    TextArea
} from "@adobe/react-spectrum";
import { extensionId } from "./Constants";
import Copy from "@spectrum-icons/workflow/Copy";
import actionWebInvoke from '../utils';
import allActions from '../config.json'
import fetch from "node-fetch";

const Modal = () => {
  const [guestConnection, setGuestConnection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [codeSnippet, setCodeSnippet] = useState("");
  const codeSnippetArea = useRef(null);


  useEffect(() => {
    (async () => {
      const guestConnection = await attach({ id: extensionId });
      setGuestConnection(guestConnection);
    })();
  }, []);

  useEffect(() => {
      if(!guestConnection) {
          return;
      }
      if (loading) {
          fetchData().catch((e) => console.error("Extension error, ", e));
      }
  }, [guestConnection]);

  const fetchData = async () => {
      const editorState = await guestConnection.host.editorState.get();
      var { connections, selected, editables, location, customTokens } = editorState;
      try {

          // Set the HTTP headers to access the Adobe I/O runtime action
          const headers = {
              'Authorization': 'Bearer ' + guestConnection.sharedContext.get('token'),
              'x-gw-ims-org-id': guestConnection.sharedContext.get('orgId'),
              'Access-Control-Allow-Origin': 'http://localhost:9080'
          };

          const form = editables.filter(item => item.model === "form");

          const tempEndpointName = Object.keys(connections).filter((key) =>
              connections[key].startsWith("xwalk:")
          )[0];

            let token;
          if (customTokens && customTokens[tempEndpointName]) {
              token = customTokens[tempEndpointName];
          } else {
              token = "Bearer " + guestConnection.sharedContext.get('token');
          }

          const params = {
              "endpoint": connections[tempEndpointName].replace("xwalk:", ""),
              "token": token,
              "formPath": form[0].resource.replace("urn:aemconnection:", ""),
              "x-gw-ims-org-id": guestConnection.sharedContext.get('orgId')
          };

          const res = await actionWebInvoke(allActions['fetch-conf'], headers, params);
          console.log(res)
          const {owner, repo}  = res;
          const branch = 'no-worker';
          const url = `https://${branch}--${repo}--${owner.toLowerCase()}.hlx.live`
          setCodeSnippet(`
  <main>
    <div class="form">
      <a href=\`https://${branch}--${repo}--${owner}.hlx.live${params.formPath}\` style="all: unset">Loading Form...</a>
    </div>
  </main>
  <script type="module">
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href',\`${url}/blocks/form/form.css\`);
    document.head.appendChild(link);
    const formBlock = document.querySelector('.form');
    const module = await import(\`${url}/blocks/form/form.js\`);
    const formDecorate = module.default;
    formDecorate(formBlock)
  </script>`)
          if(res.error) {
              console.error("Error fetching EDS conf info", res.error)
          }

          // const formName = params.formPath.split("/")[4];
          // const formName = params.formPath.split("/content/forms/af/")[1].split("/jcr:content/root/section/form")[0]
          //   try {
          //       const edsInfo = await fetch(params.endpoint+`/conf/forms/${formName}/settings/cloudconfigs/edge-delivery-service-configuration/jcr:content.-1.json`, {
          //           method: "GET"
          //       });
          //       console.log(edsInfo)
          //       const confNode = await edsInfo.json();
          //       console.log(confNode)
          //       const obj = {}
          //       obj.owner = confNode.owner;
          //       obj.repo = confNode.repo;
          //       setEdsInfo(obj)
          //   } catch (e) {
          //       console.error("Error fetching EDS conf info", e)
          //   }
      } finally {
          setLoading(false);
      }
  }

  const onCloseHandler = () => {
    guestConnection.host.modal.close();
  };
  const onCopyHandler = async () => {
      codeSnippetArea.current.select();
      document.execCommand('copy');
      console.log('Content copied to clipboard', codeSnippet);
  };
    return (
        !loading ? <Provider theme={defaultTheme} colorScheme="light">
            <Content width="100%">
                <TextArea label="Code Snippet" width="size-4600" height="size-1700" maxWidth="100%" ref={codeSnippetArea} onChange={setCodeSnippet} value={codeSnippet}></TextArea>
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
