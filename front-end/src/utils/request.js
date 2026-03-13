import Cookies from "js-cookie";

const API_BE = `http://localhost:8080/api/v2`;

const getAuthHeaders = () => {
    const token = Cookies.get("accessToken"); 
    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
};

const tryParseJSON = async (response) => {
  const text = await response.text();
  return text ? JSON.parse(text) : {}; 
};

export const get = async (path) => {
  const response = await fetch(`${API_BE}/${path}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
 return await tryParseJSON(response);
};

export const post = async (options, path) => {
  const response = await fetch(`${API_BE}/${path}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(options),
  });
  return await tryParseJSON(response);
};

export const put = async (options, path) => {
  const response = await fetch(`${API_BE}/${path}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(options),
  });
  return await tryParseJSON(response);
};

export const patch = async (options, path) => {
  const response = await fetch(`${API_BE}/${path}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(options),
  });
  return await tryParseJSON(response);
};

export const del = async (path) => {
  const response = await fetch(`${API_BE}/${path}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return await tryParseJSON(response);
};