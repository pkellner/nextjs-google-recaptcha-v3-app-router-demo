"use client";

import React, { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import axios from "axios";
import GoogleCaptchaWrapper from "@/app/google-captcha-wrapper";

interface PostData {
  gRecaptchaToken: string;
  firstName: string;
  lastName: string;
  email: string;
  hearFromSponsors: boolean;
}

export default function Home() {
  return (
    <GoogleCaptchaWrapper>
      <HomeInside />
    </GoogleCaptchaWrapper>
  );
}

function HomeInside() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [hearFromSponsors, setHearFromSponsors] = useState(false);
  const [notification, setNotification] = useState('');

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

  const submitEnquiryForm = (gReCaptchaToken : string) => {
    async function goAsync() {
      const response = await axios({
        method: "post",
        url: "/api/contactFormSubmit",
        data: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          hearFromSponsors: hearFromSponsors,
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
        <h2>Interested in Silicon Valley Code Camp</h2>
        <form onSubmit={handleSubmitForm}>
          <div className="mb-3">
            <input
              type="text"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e?.target?.value)}
              className="form-control"
              placeholder="First Name"
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e?.target?.value)}
              className="form-control"
              placeholder="Last Name"
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              name="email"
              value={email}
              onChange={(e) => setEmail(e?.target?.value)}
              className="form-control"
              placeholder="Email Address"
            />
          </div>
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              name="hearFromSponsors"
              checked={hearFromSponsors}
              onChange={(e) => setHearFromSponsors(e?.target?.checked)}
              className="form-check-input"
            />
            <label className="form-check-label">Hear from our sponsors</label>
          </div>
          <button type="submit" className="btn btn-light">Submit</button>
          {notification && <p className="mt-3 text-info">{notification}</p>}
        </form>
      </main>
    </div>
  );
}
