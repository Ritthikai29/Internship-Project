class General {
  static download(url, file) {
    // create a hidden element to simulate a click on the link
    let link = document.createElement("a");
    link.style.display = "none";
    link.href = url + "?file=" + file;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  static redirect(path) {
    window.location.href = path;
  }

  static backward(){
    history.back();
  }
}
