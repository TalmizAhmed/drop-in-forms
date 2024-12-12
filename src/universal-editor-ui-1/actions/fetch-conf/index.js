const fetch = require("node-fetch")
async function main(params) {
    const edsInfo = {};
    const aemRequestOptions = {
        method: "GET",
        headers: {"Authorization": params.token}
    };

    const formName = params.formPath.split("/")[4];
    try {
        const formConfResponse = await fetch(params.endpoint+ `/conf/forms/${formName}/settings/cloudconfigs/edge-delivery-service-configuration/jcr:content.-1.json`, aemRequestOptions);
        const confNode = await formConfResponse.json();
        edsInfo.owner = confNode.owner;
        edsInfo.repo = confNode.repo;
    } catch (e) {
        console.error("Error fetching EDS conf info: ", e);
        return {
            status: 500,
            body: JSON.stringify({error: "Error fetching EDS conf info"})
        };
    }


    return {
        status: 200,
        body: JSON.stringify(edsInfo)
    };
}

exports.main = main;
