import idJSON from './id.js';

const MockAPI = {
  "/id": idJSON,
}

self.fetch = (url, config) => {
    let json = MockAPI[url] || {"Id": "url doesn't match"}
    const resp = new Response(JSON.stringify(json), { "status" : 200 })
    return new Promise((resolve, reject) => {
      resolve(resp);
    });
  };


  export default MockAPI