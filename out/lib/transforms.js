import * as zlib from "zlib";
const zlib_base64_preamble = "eJz";
export function identify(input) {
    if (input.startsWith(zlib_base64_preamble)) {
        return [{ type: "base64_zlib" }];
    }
    return [];
}
export function resolve(input) {
    const types = identify(input);
    if (types.length == 0) {
        return null;
    }
    for (const type of types) {
        if (type.type === "base64_zlib") {
            let ilen = input.length;
            const gzippedDataBuffer = base64ToBuffer(input);
            let unzippedData = zlib.unzipSync(gzippedDataBuffer).toString();
            // if we got here - it was a valid zip archive
            const unzipedResult = {
                type: "base64_zlib",
                data: unzippedData,
            };
            if (/^{.*}$/.test(unzippedData) || /^\[.*\]$/.test(unzippedData)) {
                // looks like json
                // console.log(unzippedData);
                const object = JSON.parse(unzippedData);
                const result = {
                    type: "json-data",
                    prev: { type: unzipedResult.type },
                    data: object,
                };
                return result;
            }
        }
    }
    return null;
}
function base64ToBuffer(input) {
    return Buffer.from(input, "base64");
}
//# sourceMappingURL=transforms.js.map