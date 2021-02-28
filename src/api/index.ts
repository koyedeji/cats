interface Config {
  baseUrl?: string;
  headers?: HeadersInit;
}

enum HTTPMethods {
  POST = "POST",
  GET = "GET",
  DELETE = "DELETE",
}

const attachUrlParameters = (params: Record<string, any>) => {
  const urlParams = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return `?${urlParams}`;
};

const handleResponse = async (response: Response) => {
  if (response.status >= 400) {
    throw await response.json();
  }
  return await response.json();
};

class Api {
  constructor(public config: Config) {}

  static create(config: Config = {}) {
    return new Api(config);
  }

  async get(url: string, params: Record<string, any> = {}) {
    const { baseUrl, ...defaultConfig } = this.config;
    let completeUrl = `${baseUrl || ""}${url}`;

    if (Object.keys(params).length > 0) {
      completeUrl += attachUrlParameters(params);
    }

    const response = await fetch(completeUrl, {
      method: HTTPMethods.GET,
      ...defaultConfig,
    });

    return handleResponse(response);
  }

  async post(
    url: string,
    data: FormData | Record<string, any>,
    headers?: HeadersInit
  ) {
    const { baseUrl, ...defaultConfig } = this.config;
    let completeUrl = `${baseUrl || ""}${url}`;
    const body = data instanceof FormData ? data : JSON.stringify(data);

    const response = await fetch(completeUrl, {
      method: HTTPMethods.POST,
      headers: {
        ...defaultConfig["headers"],
        ...headers,
      },
      body,
    });

    return handleResponse(response);
  }
  async delete(url: string) {
    const { baseUrl, ...defaultConfig } = this.config;
    let completeUrl = `${baseUrl || ""}${url}`;
    const response = await fetch(completeUrl, {
      method: HTTPMethods.DELETE,
      ...defaultConfig,
    });
    return handleResponse(response);
  }
}

export default Api;
