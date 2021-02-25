const baseUrl = "https://api.thecatapi.com/v1/";
const apiKey = "9daa1266-85a5-4600-bef2-9e4fd71dcfa8";

interface ResponseObj {
  error?: string;
  message?: string;
  id?: string;
}

const handleResponse = async (response: {
  status: number;
  json: () => any;
}) => {
  if (response.status >= 400) {
    const error = await response.json();
    throw new Error(error.message);
  }
  return await response.json();
};

const DEFAULT_REQUEST_INIT: RequestInit = {
  method: "GET",
  mode: "cors",
  credentials: "same-origin",
  headers: {
    "x-api-key": apiKey,
  },
};

export const post = async (
  url: string,
  data?: Record<string, any>
): Promise<ResponseObj> => {
  const requestObj = {
    ...DEFAULT_REQUEST_INIT,
    method: "POST",
    headers: {
      ...DEFAULT_REQUEST_INIT["headers"],
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  const response = await fetch(`${baseUrl}${url}`, requestObj);
  return handleResponse(response);
};

export const get = async (url: string): Promise<unknown> => {
  const requestObj = {
    ...DEFAULT_REQUEST_INIT,
    method: "GET",
  };
  const response = await fetch(`${baseUrl}${url}`, requestObj);
  return handleResponse(response);
};

export const upload = async (
  url: string,
  data?: Record<string, any>
): Promise<ResponseObj> => {
  let formData = new FormData();
  if (data) {
    formData.append("file", data.file);
    formData.append("sub_id", data.sub_id);
  }

  const requestOj = {
    ...DEFAULT_REQUEST_INIT,
    method: "POST",
    body: formData,
  };
  const response = await fetch(`${baseUrl}${url}`, requestOj);
  return handleResponse(response);
};

export const remove = async (url: string): Promise<ResponseObj> => {
  const requestObj = {
    ...DEFAULT_REQUEST_INIT,
    method: "DELETE",
  };
  const response = await fetch(`${baseUrl}${url}`, requestObj);
  return handleResponse(response);
};
