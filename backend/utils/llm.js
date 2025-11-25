// import https from "https";

// export async function callLLM(prompt) {
//   if (!process.env.OPENAI_API_KEY) {
//     throw new Error("Missing OPENAI_API_KEY");
//   }

//   const body = JSON.stringify({
//     model: "gpt-4o-mini",
//     messages: [{ role: "user", content: prompt }],
//   });

//   const options = {
//     method: "POST",
//     hostname: "api.openai.com",
//     path: "/v1/chat/completions",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//       "Content-Length": Buffer.byteLength(body),
//     },
//   };

//   const responseText = await new Promise((resolve, reject) => {
//     const req = https.request(options, (res) => {
//       let data = "";
//       res.on("data", (chunk) => (data += chunk));
//       res.on("end", () => resolve(data));
//     });

//     req.on("error", reject);
//     req.write(body);
//     req.end();
//   });

//   const json = JSON.parse(responseText);
//   if (!json.choices || !json.choices[0]) {
//     console.log("Full LLM Response:", json);
//     throw new Error("LLM response malformed");
//   }

//   return json.choices[0].message.content;
// }

import https from "https";

export async function callLLM(
  prompt,
  model = process.env.OPENAI_MODEL || "gpt-4o-mini"
) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY in .env");
  }

  const body = JSON.stringify({
    model,
    messages: [{ role: "user", content: prompt }],
  });

  const options = {
    method: "POST",
    hostname: "api.openai.com",
    path: "/v1/chat/completions",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Length": Buffer.byteLength(body),
    },
  };

  const responseText = await new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });

  // Debug raw output (helps fix rate-limit / formatting issues)
  console.log("RAW LLM RESPONSE:", responseText);

  const json = JSON.parse(responseText);

  if (json.error) {
    console.error("LLM Error:", json.error);
    throw new Error(json.error.message);
  }

  if (!json.choices || !json.choices[0]) {
    throw new Error("LLM response malformed");
  }

  return json.choices[0].message.content;
}
