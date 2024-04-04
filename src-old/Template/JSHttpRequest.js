class HttpRequest {
  static validateUrl(url) {
    if (!/^https?:\/\//i.test(url)) {
      throw new Error("Invalid URL: " + url);
    }
  }

  static async Get(url) {
    // this.validateUrl(url);
    try {
      const res = await fetch(url);
      const ret = await res.json();
      if (!res.ok) {
        console.error("Error: ", res);
      }
      return ret;
    } catch (e) {
      console.error("Error: ", e);
    }
  }

  static async Post(url, $data = null) {
    // this.validateUrl(url);
    try {
      const res = await fetch(url, {
        method: "POST",
        body: $data,
      });
      const ret = await res.json();
      if (!res.ok) {
        console.error("Error: ", res);
      }
      return ret;
    } catch (e) {
      console.error("Error: ", e);
    }
  }

  static async Delete(url) {
    // this.validateUrl(url);
    try {
      const res = await fetch(url, {
        method: "DELETE",
        body: $data,
      });
      const ret = await res.json();
      if (!res.ok) {
        console.error("Error: ", res);
      }
      return ret;
    } catch (e) {
      console.error("Error: ", e);
    }
  }

  static async Put(url) {
    // this.validateUrl(url);
    try {
      const res = await fetch(url, {
        method: "PUT",
        body: $data,
      });
      const ret = await res.json();
      if (!res.ok) {
        console.error("Error: ", res);
      }
      return ret;
    } catch (e) {
      console.error("Error: ", e);
    }
  }
  
}
