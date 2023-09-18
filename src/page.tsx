"use client";

import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import axios from "axios";

import GoogleCaptchaWrapper from "./google-captcha-wrapper";

export default function Home() {
  return (
    <GoogleCaptchaWrapper>
      <HomeInside />
    </GoogleCaptchaWrapper>
  );
}

function HomeInside() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [notification, setNotification] = useState("");

  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmitForm = function (e: any) {
    e.preventDefault();
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not available yet");
      setNotification(
        "Execute recaptcha not available yet likely meaning key not recaptcha key not set"
      );
      return;
    }
    executeRecaptcha("enquiryFormSubmit").then((gReCaptchaToken) => {
      submitEnquiryForm(gReCaptchaToken);
    });
  };

  const submitEnquiryForm = (gReCaptchaToken) => {
    async function goAsync() {
      const response = await axios({
        method: "post",
        url: "/api/contactFormSubmit",
        data: {
          name: name,
          email: email,
          message: message,
          gRecaptchaToken: gReCaptchaToken,
        },
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      });

      if (response?.data?.success === true) {
        setNotification(`Success with score: ${response?.data?.score}`);
      } else {
        setNotification(`Failure with score: ${response?.data?.score}`);
      }
    }
    goAsync().then(() => {}); // suppress typescript error
  };

  return (
    <div className="container">
      <main className="mt-5"> {/* Add a top margin for better spacing */}
        <h2>Enquiry Form</h2>
        <form onSubmit={handleSubmitForm}>
          <div className="mb-3">
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e?.target?.value)}
              className="form-control"
              placeholder="Name"
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              name="email"
              value={email}
              onChange={(e) => setEmail(e?.target?.value)}
              className="form-control"
              placeholder="Email"
            />
          </div>
          <div className="mb-3">
        <textarea
          rows={3}
          name="message"
          value={message}
          onChange={(e) => setMessage(e?.target?.value)}
          className="form-control"
          placeholder="Message"
        />
          </div>
          <button type="submit" className="btn btn-light">Submit</button>

          {notification && <p className="mt-3 text-info">{notification}</p>}
        </form>
      </main>
    </div>

  );
}
