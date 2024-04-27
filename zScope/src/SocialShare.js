// SocialShare.js
import React, { useState } from 'react';
import { TwitterShareButton, TwitterIcon } from 'react-share';
import './SocialShare.css'; 

function SocialShare() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText("FarScope Which dog type are you for your Horoscope? Result is ⇒ https://https://farscope.vercel.app//").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }, () => {
      console.error('Copy failed!');
    });
  };

  return (
    <div className="social-share-container">
      <TwitterShareButton
        url={"https://farscope.vercel.app//"}
        title={"Find your zScope here!"}
        hashtags={["Example", "React"]}
      >
        <TwitterIcon size={50} round />
      </TwitterShareButton>
      <button onClick={copyToClipboard} className="copy-link-button">
        <b>{copied ? 'Copied!' : 'Sharing Link made'}</b>
      </button>

      <a href="https://line.me/R/msg/text/? FarScope Which dog type are you for your Horoscope? Result is ⇒ https://https://farscope.vercel.app//"
         className="line-share-button">
        <img src="/line-512.webp" alt="share via LINE" className="line-icon" />
      </a>
    </div>
  );
}

export default SocialShare;
