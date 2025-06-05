class APILibrary {
    constructor(baseURL) {
      this.baseURL = baseURL;
    }
  
    buildURL(endpoint, queryParams) {
      let url = `${this.baseURL}${endpoint}`;
      if (queryParams) {
        url += `?${queryParams}`;
      }
      return url;
    }
  
    async request(method, endpoint, queryParams = '', body = null) {
      const url = this.buildURL(endpoint, queryParams);
      const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
      };
  
      if (body && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
        try {
          options.body = JSON.stringify(JSON.parse(body));
        } catch (e) {
          throw new Error('Invalid JSON in request body');
        }
      }
  
      try {
        const response = await fetch(url, options);
        const contentType = response.headers.get('content-type');
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        if (contentType && contentType.includes('application/json')) {
          return await response.json();
        } else {
          return await response.text();
        }
      } catch (err) {
        throw new Error(`Request failed: ${err.message}`);
      }
    }
  }
  
  // this will point to routes defines in server/routes/tasks.js
  // instantiates the class
  // Sets the base URL to /api/tasks so everything else can just add endpoints after that.
  const api = new APILibrary("/api/tasks");

  
  document.getElementById("send").addEventListener("click", async () => {
    const method = document.getElementById("method").value;
    const endpoint = document.getElementById("endpoint").value.trim();
    const query = document.getElementById("query").value.trim();
    const body = document.getElementById("body").value.trim();
    const responseBox = document.getElementById("response");
  
    responseBox.textContent = "Loading...";
  
    try {
      const result = await api.request(method, endpoint, query, body);
      responseBox.textContent = JSON.stringify(result, null, 2);
    } catch (err) {
      responseBox.textContent = `Error: ${err.message}`;
    }
  });