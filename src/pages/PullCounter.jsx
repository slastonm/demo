import React, {useState, useEffect} from "react";
import "./PullCounter.css";

import Banner1 from "../assets/pictures/26 event/banners/Liang Yue banner.jpg";
import Banner2 from "../assets/pictures/26 event/banners/Aleph banner.jpg";
import Banner3 from "../assets/pictures/26 event/banners/Tooth Fairy banner.jpg";
import Banner4 from "../assets/pictures/26 event/banners/yearing of the water.png";
import Banner5 from "../assets/pictures/26 event/banners/ripples on the water.jpg";

  const allCharacters = [
    "Druvis III",
    "Lilya",
    "A Knight",
    "Sotheby",
    "Regulus",
    "Centurion",
    "An An Lee",
    "Medicine Pocket",
    "Voyager",
    "Eternity",
    "Ms NewBabel",
    "Melania",
    "Pickles",
    "Tooth Fairy",
    "Jessica",
    "Kaalaa Baunaa",
    "Shamane",
    "37",
    "6",
    "Spathodea",
    "Ezra Theodore",
    "Ge Tian",
    "Isolde",
    "Marcus",
    "Vila",
    "Windsong",
    "Kakania",
    "Semmelweis",
    "Mercuria",
    "J",
    "Tuesday",
    "Argus",
    "Lopera",
    "Willow",
    "Flutterpage",
    "Barcarola",
    "Fatutu",
    "Noire",
    "Recoleta",
    "Aleph",
    "Jiu Niangzi",
    "Lucy",
    "Anjo Nala",
    "Liang Yue",
  ];

const limitedOnly = new Set(["Jiu Niangzi", "Lucy", "Anjo Nala", "Liang Yue"]);
const PullCounter = () => {
  const [banner, setBanner] = useState("");
  const [character, setCharacter] = useState("");
  const [pullNumber, setPullNumber] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [results, setResults] = useState({
    limited: [],
    event: [],
    rerun: [],
    yearing: [],
    ripples: [],
  });

  const getFilteredCharacters = () => {
    if (banner === "limited") return allCharacters;
    if (banner === "") return [];
    return allCharacters.filter((c) => !limitedOnly.has(c));
  };

  const handleAddPull = () => {
    const pull = parseInt(pullNumber);
    if (!banner || !character || isNaN(pull) || pull < 1) {
      return alert("fill all blanks");
    }
    const newEntry = {
      name: character,
      pull,
    };
    setResults((prev) => ({
      ...prev,
      [banner]: [...(prev[banner] || []), newEntry],
    }));

    setCharacter("");
    setPullNumber("");
  };
  const getColor = (pull) => {
    if (pull <= 40) return "green";
    if (pull <= 59) return "orange";
    return "red";
  };

  const bannerImages = {
    limited: Banner1,
    event: Banner2,
    rerun: Banner3,
    yearing: Banner4,
    ripples: Banner5,
  };

  return(
  <div>
      <section className="enter-data">
        <button id="open-form" onClick={() => setShowForm(!showForm)}>
          Enter pull result
        </button>
        {showForm && (
          <div id="pull-form">
            <label for="banner-select">Select Banner:</label>
            <br />
            <select
              id="banner-select"
              value={banner}
              onChange={(e) => setBanner(e.target.value)}
            >
              <option value="">-- Choose Banner --</option>
              <option value="limited">Limited banner</option>
              <option value="event">Event banner</option>
              <option value="rerun">Rerun banner</option>
              <option value="yearing">Yearing of the water</option>
              <option value="ripples">Ripples on the water</option>
            </select>
            <br />
            <br />

            <label for="character-select">Select Character:</label>
            <br />
            <select
              id="character-select"
              value={character}
              onChange={(e) => setCharacter(e.target.value)}
            >
              <option value="">-- Choose Character --</option>
              {getFilteredCharacters().map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <br />
            <br />

            <label for="pull-number">Enter Pull Number:</label>
            <br />
            <input
              type="number"
              id="pull-number"
              min="1"
              max="100"
              value={pullNumber}
              onChange={(e) => setPullNumber(e.target.value)}
            />
            <br />
            <br />

            <button id="add-pull" onClick={handleAddPull}>
              Add
            </button>
          </div>
        )}
      </section>

       <section>
        <ul className="banner-list">
          {Object.keys(bannerImages).map((b) => (
            <li key={b}>
              <h2>{b.charAt(0).toUpperCase() + b.slice(1)} baner</h2>
              <img src={bannerImages[b]} alt={`${b} banner`} />
              <div className="characters">
                {results[b].map((item, i) => (
                  <div key={i} style={{ color: getColor(item.pull) }}>
                    {item.name} - pull {item.pull}
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default PullCounter;