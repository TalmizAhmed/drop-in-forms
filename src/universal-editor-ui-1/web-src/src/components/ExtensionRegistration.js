/*
Copyright 2024 Adobe
All Rights Reserved.
NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import {Text} from "@adobe/react-spectrum";
import {register} from "@adobe/uix-guest";
import {extensionId} from "./Constants";
import React, { useEffect, useState } from 'react';
function ExtensionRegistration() {
  useEffect(() => {
      const init = async () => {
          const registrationConfig = {
              id: extensionId,
              methods: {
                headerMenu: {
                  getButtons() {
                    return [
                      {
                        id: `${extensionId}-button`,
                        label: "Export form",
                        icon: 'ExperienceExport', // Spectrum workflow icon code from https://spectrum.adobe.com/page/icons/
                        onClick: async () => {
                          console.log('Button has been pressed.');
                          const url = '/#/modal/drop'; // absolute or relative path
                          guestConnection.host.modal.showUrl({
                            title: 'Export and Drop In Anywhere: ',
                            url,
                            width: '1200px',
                            height: '200px',
                          });
                        },
                      }
                    ]
                  }
                }
              }
          };
          const guestConnection = await register(registrationConfig);
      }
      init().catch(console.error)
  }, []);

return <Text>IFrame for integration with Host...</Text>

}

export default ExtensionRegistration;
