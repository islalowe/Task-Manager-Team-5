// KEEP DOM out of this file. It is for API logic, only.


class APILibrary {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  buildURL(endpoint = "", queryParams = "") {
    let url = `${this.baseURL}${endpoint}`;
    if (queryParams) {
      url += `?${queryParams}`;
    }
    return url;
  }

  async request(method, endpoint = "", queryParams = "", body = null) {
    const url = this.buildURL(endpoint, queryParams);
    const options = {
      method,
      headers: { "Content-Type": "application/json" },
    };

    if (body && ["POST", "PUT", "PATCH"].includes(method.toUpperCase())) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const contentType = response.headers.get("content-type");
      return contentType?.includes("application/json")
        ? await response.json()
        : await response.text();
    } catch (err) {
      throw new Error(`Request failed: ${err.message}`);
    }
  }

  
  getAll() {
    return this.request("GET");
  }

  create(task) {
    return this.request("POST", "", "", task);
  }

  delete(id) {
    return this.request("DELETE", `/${id}`);
  }
  
  toggleComplete(id, completed) {
    return this.request("PATCH", `/${id}`, "", { completed });
  }
  
}

