// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

function handler(req, res) {
  const secretKey = process?.env?.RECAPTCHA_SECRET_KEY;
  console.log("secretKey",secretKey);
  if (req.method === "POST") {
    try {
      fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        //body: `secret=6LeFZTIoAAAAAPjxpHNK9_3pCTwvK6j31bBD7Pn-&response=${req.body.gRecaptchaToken}`,
        body: `secret=${secretKey}&response=${req.body.gRecaptchaToken}`,
      })
        .then((reCaptchaRes) => reCaptchaRes.json())
        .then((reCaptchaRes) => {
          console.log(
            reCaptchaRes,
            "Response from Google reCatpcha verification API"
          );
          if (reCaptchaRes?.score > 0.5) {
            // Save data to the database from here
            res.status(200).json({
              status: "success",
              message: "Enquiry submitted successfully " + reCaptchaRes?.score,
            });
          } else {
            res.status(200).json({
              status: "failure",
              message: "Google ReCaptcha Failure",
            });
          }
        });
    } catch (err) {
      res.status(405).json({
        status: "failure",
        message: "Error submitting the enquiry form",
      });
    }
  } else {
    res.status(405);
    res.end();
  }
}

export default handler;
