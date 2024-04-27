import React, { useState, useEffect } from 'react';
import SocialShare from './SocialShare'; 
import './App.css';

function App() {
  const dogImages = {
    'Border Collie': '/Dogs/Collie.jpg',
    'Bulldog': '/Dogs/Ebulldog.jpg',
    'Papillon': '/Dogs/Papillon.jpg',
    'Labrador Retriever': '/Dogs/Lretriever.jpg',
    'Siberian Husky': '/Dogs/Husky.jpg',
    'German Shepherd': '/Dogs/Shepherd.jpg',
    'Cavalier Spaniel': '/Dogs/Spaniel.jpg',
    'Doberman': '/Dogs/Doberman.jpg',
    'Australian Shepherd': '/Dogs/Ashepherd.jpg',
    'Saint Bernard': '/Dogs/Bernard.jpg',
    'Dalmatian': '/Dogs/Dalmatian.jpg',
    'Golden Retriever': '/Dogs/Gretriever.jpg',
  };
  
  const zodiacSigns = [
    { label: "Aries (3/21-4/19)", value: "Aries" },
    { label: "Taurus (4/20-5/20)", value: "Taurus" },
    { label: "Gemini (5/21-6/21)", value: "Gemini" },
    { label: "Cancer (6/22-7/22)", value: "Cancer" },
    { label: "Leo (7/23-8/22)", value: "Leo" },
    { label: "Virgo (8/23-9/22)", value: "Virgo" },
    { label: "Libra (9/23-10/23)", value: "Libra" },
    { label: "Scorpio (10/24-11/22)", value: "Scorpio" },
    { label: "Sagittarius (11/23-12/21)", value: "Sagittarius" },
    { label: "Capricorn (12/22-1/19)", value: "Capricorn" },
    { label: "Aquarius (1/20-2/18)", value: "Aquarius" },
    { label: "Pisces (2/19-3/20)", value: "Pisces" }
  ];

  const handleReload = () => {
    window.location.reload();
  };
  
  const [mySign, setMySign] = useState('');
  const [partnerSign, setPartnerSign] = useState('');
  const [childSign, setChildSign] = useState('');
  const [compatibility, setCompatibility] = useState(null);
  const [advisory, setAdvisory] = useState('');
  const [dogType1, setDogType1] = useState('');
  const [dogType2, setDogType2] = useState('');
  const [dogType3, setDogType3] = useState('');
  const [dogCharacter1, setDogCharacter1] = useState('');
  const [dogCharacter2, setDogCharacter2] = useState('');
  const [dogCharacter3, setDogCharacter3] = useState('');
  const [weakness, setWeakness] = useState(''); 
  const [traits, setTraits] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (mySign) {
      fetchDogInfo(mySign, setDogType1, setDogCharacter1);
    }
    if (partnerSign) {
      fetchDogInfo(partnerSign, setDogType2, setDogCharacter2);
    }
  }, [mySign, partnerSign]); 
  
  useEffect(() => {
    if (childSign) {
        fetchDogInfoChild(childSign, setDogType3, setDogCharacter3, setWeakness, setTraits);
    }
  }, [childSign]);

  const handleSignChange = (event, setter) => {
    setter(event.target.value);
    setError(''); // Reset error state when changing sign
    setCompatibility(null); // Reset compatibility when changing signs
  };

  const fetchDogInfo = async (sign, setDogType, setDogCharacter) => {
    try {
      const apiKey = process.env.REACT_APP_API_KEY;
      const spreadsheetId = process.env.REACT_APP_SHEET_ID;
      const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet4!A2:E13?key=${apiKey}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const matchingRow = data.values.find(row => row[0] === sign);
      if (matchingRow) {
        setDogType(matchingRow[1]);
        setDogCharacter(matchingRow[2]);
        }
       else {
        setDogType('');
        setDogCharacter('');
        }
      } catch (error) {
      console.error('Error fetching dog data:', error);
      setError('Failed to load dog data.');
    }
  };

  const fetchDogInfoChild = async (sign, setDogType3, setDogCharacter3, setWeakness) => {
    try {
      const apiKey = process.env.REACT_APP_API_KEY;
      const spreadsheetId = process.env.REACT_APP_SHEET_ID;
      const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet4!A2:E13?key=${apiKey}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const matchingRow = data.values.find(row => row[0] === sign);
      if (matchingRow) {
        setDogType3(matchingRow[1]);
        setWeakness(matchingRow[3]);
        setDogCharacter3(matchingRow[4]);

        }
       else {
        setDogType3('');
        setWeakness('');
        setDogCharacter3('');
        }
      } catch (error) {
      console.error('Error fetching dog data:', error);
      setError('Failed to load dog data.');
    }
  };

  const calculateCompatibility = async () => {
    setError('');

    if (!mySign || !partnerSign) {
      setError("Both signs need to be selected.");
      return;
    }
    try {
      const apiKey = process.env.REACT_APP_API_KEY;
      const spreadsheetId = process.env.REACT_APP_SHEET_ID;
      const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet3!A2:H145?key=${apiKey}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const values = data.values;
      const matchingRow = values.find(row => row[0] === mySign && row[1] === partnerSign);
      if (matchingRow) {
        setTraits(matchingRow[7]);
        const percentage = parseInt(matchingRow[2], 10); 
        setCompatibility(percentage);
        setAdvisory(getCompatibilityAdvisory(percentage)); 
      } else {
        setCompatibility('??');
        setAdvisory('Compatibility could not be determined.');
        console.log('Received data:', data);
        console.log('Matching row:', matchingRow);
        console.log('Traits value:', matchingRow[7]);
      }
    } catch (error) {
      console.error('Error fetching compatibility data:', error);
      setError('Failed to load compatibility data.');
    }
  };

  const [thirdImage, setThirdImage] = useState('');

  useEffect(() => {
    if (mySign && partnerSign) {
        calculateCompatibility();
      fetchAdditionalDogImage();
    }
  }, [mySign, partnerSign]); 
  const fetchAdditionalDogImage = async () => {
    try {
      const apiKey = process.env.REACT_APP_API_KEY;
      const spreadsheetId = process.env.REACT_APP_SHEET_ID;
      const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet3!A2:H145?key=${apiKey}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const matchingRow = data.values.find(row => row[0] === mySign && row[1] === partnerSign);
      if (matchingRow) {
        const imageName = matchingRow[4]; 
        setThirdImage(`/Dogs/Hybrid/${imageName}.jpg`);
      } else {
        setThirdImage(''); 
      }
    } catch (error) {
      console.error('Error fetching third image:', error);
      setError('Failed to load third image.');
    }
  };

  const getCompatibilityAdvisory = (percentage) => {
    if (percentage >= 90) {
      return "Your compatibility is excellent!";
    } else if (percentage >= 80) {
      return "Your compatibility is outstanding!";
    } else if (percentage >= 70) {
      return "Your compatibility is fair";
    } else if (percentage >= 60) {
      return "Your compatibility is above average";
    } else if (percentage >= 50) {
      return "Compatibility is not so strong, but it depends on the effort!";
    } else {
      return "Compatibility might not be very good";
    }
  };
  
  return ( 
    <div className="App">
      <div className="banner">FarScope by zScope</div>  
      <p>Welcome! Please select your parents' zodiacs</p>
      
      <div className="signs-section">
      <div className="sign-section">
        <label>Father's Zodiac</label>
        <select value={mySign} onChange={(e) => handleSignChange(e, setMySign)}>
          <option value="">Select Zodiac</option>
          {zodiacSigns.map((sign, index) => (
            <option key={index} value={sign.value}>{sign.label}</option>
          ))}
        </select>

      {dogType1 && (
        <p><br /><b>Your Dad is like a</b><br></br> {dogType1}</p>
      )}
      {dogCharacter1 && (
          <>
        <p><b>His Character:</b><br></br> {dogCharacter1}</p>
        <img src={dogImages[dogType1]} alt={`image：${dogType1}`} className="dog-image" />
        </>
      )}
      {error && (<p className="error">Error: {error}</p> )}
      </div>      
      <div className="sign-section">
      <label>Mother's Zodiac</label>
        <select value={partnerSign} onChange={(e) => handleSignChange(e, setPartnerSign)}>
          <option value="">Select Zodiac</option>
          {zodiacSigns.map((sign, index) => (
            <option key={index} value={sign.value}>{sign.label}</option>
          ))}
        </select>
        {dogType2 && (<p><br /><b>Your Mom is like a</b><br></br> {dogType2}</p>)}
      {dogCharacter2 && (
          <>
        <p><b>Her Character:</b><br></br> {dogCharacter2}</p>
        <img src={dogImages[dogType2]} alt={`image：${dogType2}`} className="dog-image" />
        </>
      )}
      {error && (<p className="error">Error: {error}</p> )}
  </div>
</div>
      {/*<button onClick={calculateCompatibility}>Check your parents compatibility</button> */}
      {
      compatibility && (
      <>
       <p><b>Their Compatibility is {compatibility}%</b></p>
        {/* <p>{advisory}</p> This line displays the advisory message */}
      </>
      )} 
<div className="child-section">
      {thirdImage && (
        <div>
          <img src={thirdImage} alt="own image" className="child-image" />
          <p style={{ color: 'red' }}><b>Your Image</b></p>
          <p>Select your zodiac to reveal your internal type</p>
          <label>Your Zodiac </label>
              <select value={childSign} onChange={(e) => handleSignChange(e, setChildSign)}>
              <option value="">Select Zodiac</option>
              {zodiacSigns.map((sign, index) => (
            <option key={index} value={sign.value}>{sign.label}</option>
          ))}
        </select>
              <br />
      {childSign && dogCharacter3 && weakness &&(
        <>
        <p><b>【zScope Type】 </b><br></br>{traits || 'No trait'}<br /><b>{dogType3}</b></p>
        <p><b>Your Character: </b><br></br> {dogCharacter3}</p>
        <p><b>Your Weekness: </b><br></br> {weakness}</p>
        </>
      )}
      {childSign && error && <p className="error">Error: {error}</p>} 
        </div>
      )}
    </div>
    <SocialShare />
      <button onClick={handleReload} className="reload-button">TOP</button>
      <a href="https://zscopeapi.vercel.app/" class="english-button">日本語</a>
      <p>FarScope 2024. All Rights Reserved.</p>
  </div>
  );
}

export default App;
