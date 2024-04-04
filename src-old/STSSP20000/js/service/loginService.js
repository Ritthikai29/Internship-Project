const apiUrl = "/STSBidding/service/";

async function Login(dataJson) {
    
  const reqOpt = {
    method: "POST",
    body: JSON.stringify(dataJson),
  };
  const res = await fetch(apiUrl + "STSSP20000/login.php", reqOpt)
    .then((response) => response.json())
    .then((res) => {
      return res;
    });
  return res;
}

export { Login };
