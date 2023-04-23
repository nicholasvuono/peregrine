import http from "../src/http.js";

async function test() {
  http.options({
    vus: 5,
    duration: 30,
    ips: 2,
  });

  http.requests([
    {
      url: "http://httpbin.org/get",
      method: "GET",
    },
    {
      url: "http://httpbin.org/post",
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: {
        name: "Test API Guy",
        email: "testapiguy@email.com",
      },
    },
  ]);
  await http.send();
}

(async () => {
  await test();
})();