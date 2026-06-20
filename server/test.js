const axios = require("axios");

axios.post(
  "https://emkc.org/api/v2/piston/execute",
  {
    language: "javascript",
    version: "*",
    files: [
      {
        content: 'console.log("Hello PrepForge")'
      }
    ]
  }
)
.then(res => {
  console.log(res.data);
})
.catch(err => {
  console.log(err.message);
});