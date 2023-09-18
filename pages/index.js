import { useState } from "react";
import styles from "../styles/Home.module.css";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import axios from "axios";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [notification, setNotification] = useState("");

  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmitForm = function (e) {
    e.preventDefault();
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not available yet");
      setNotification("Execute recaptcha not available yet likely meaning key not recaptcha key not set");
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
    <div className={styles.container}>
      <main className={styles.main}>
        <h2>Enquiry Form</h2>
        <form onSubmit={handleSubmitForm}>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e?.target?.value)}
            className="form-control mb-3"
            placeholder="Name"
          />
          <input
            type="text"
            name="email"
            value={email}
            onChange={(e) => setEmail(e?.target?.value)}
            className="form-control mb-3"
            placeholder="Email"
          />
          <textarea
            rows={3}
            type="text"
            name="message"
            value={message}
            onChange={(e) => setMessage(e?.target?.value)}
            className="form-control mb-3"
            placeholder="Message"
          />
          <button type="submit" className="btn btn-light">
            Submit
          </button>

          {notification && <p>{notification}</p>}
        </form>
      </main>
    </div>
  );
}
