var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from "axios";
export function post(url, data, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const axiosOptions = {};
        if (options && options.headers) {
            axiosOptions.headers = options.headers;
        }
        const result = yield axios.post(url, data, axiosOptions);
        const abstractResult = {
            statusCode: result.status,
            payloadAsJson: result.data,
        };
        return abstractResult;
    });
}
export function get(url, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const axiosOptions = {
            decompress: true,
        };
        if (options && options.headers) {
            axiosOptions.headers = options.headers;
        }
        try {
            const result = yield axios.get(url, axiosOptions);
            const abstractResult = {
                statusCode: result.status,
                data: result.data,
            };
            return abstractResult;
        }
        catch (e) {
            //TODO we're assuming its axois error here
            const response = e.response;
            return Promise.resolve({
                statusCode: response.status,
                data: response,
            });
        }
    });
}
//# sourceMappingURL=AbstractHttpClient.js.map