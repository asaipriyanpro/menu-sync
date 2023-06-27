import axios from "axios";

export async function post(url, data, options) {
  const axiosOptions: { headers?: [] } = {};
  if (options && options.headers) {
    axiosOptions.headers = options.headers;
  }
  const result = await axios.post(url, data, axiosOptions as any);

  const abstractResult = {
    statusCode: result.status,
    payloadAsJson: result.data,
  };

  return abstractResult;
}

export async function get(url, options) {
  const axiosOptions: { headers?: []; decompress: boolean } = {
    decompress: true,
  };
  if (options && options.headers) {
    axiosOptions.headers = options.headers;
  }

  try {
    const result = await axios.get(url, axiosOptions as any);

    const abstractResult = {
      statusCode: result.status,
      data: result.data,
    };

    return abstractResult;
  } catch (e) {
    //TODO we're assuming its axois error here
    const response = e.response;
    return Promise.resolve({
      statusCode: response.status,
      data: response,
    });
  }
}
