"use client";

import { useEffect, useState } from "react";

const ZONES = [
  ["Asia/Kolkata", "India · IST", "Bengaluru · Mumbai · Delhi"],
  ["America/New_York", "US · Eastern", "New York · Boston · Miami"],
  ["America/Chicago", "US · Central", "Chicago · Dallas · Austin"],
  ["America/Denver", "US · Mountain", "Denver · Salt Lake City"],
  ["America/Los_Angeles", "US · Pacific", "Los Angeles · Seattle"],
  ["Europe/London", "UK · London", "London · Manchester"],
  ["Europe/Berlin", "Europe · Central", "Berlin · Paris · Amsterdam"],
  ["Asia/Dubai", "UAE · Dubai", "Dubai · Abu Dhabi"],
  ["Asia/Singapore", "Singapore", "Singapore"],
  ["Asia/Tokyo", "Japan · Tokyo", "Tokyo · Osaka"],
  ["Australia/Sydney", "Australia · Sydney", "Sydney · Melbourne"],
] as const;
const IST = "Asia/Kolkata";
const EASTERN = "America/New_York";
const zoneInfo = (id: string) => ZONES.find((z) => z[0] === id) ?? [id, id, id];

function parts(date: Date, zone: string) {
  return Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZoneName: "short",
    }).formatToParts(date).map((p) => [p.type, p.value]),
  );
}

function zonedToDate(value: string, zone: string) {
  const [date, time] = value.split("T");
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  let guess = new Date(Date.UTC(year, month - 1, day, hour, minute));
  for (let i = 0; i < 3; i++) {
    const p = parts(guess, zone);
    const shown = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute);
    const wanted = Date.UTC(year, month - 1, day, hour, minute);
    guess = new Date(guess.getTime() + wanted - shown);
  }
  return guess;
}

function clock(date: Date, zone: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: zone, hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true,
  }).format(date);
}

function fullDate(date: Date, zone: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: zone, weekday: "long", month: "long", day: "numeric", year: "numeric",
  }).format(date);
}

function meetingLabel(date: Date, zone: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: zone, weekday: "short", month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true, timeZoneName: "short",
  }).format(date);
}

export default function Home() {
  const [now, setNow] = useState(new Date());
  const [homeZone, setHomeZone] = useState(IST);
  const [awayZone, setAwayZone] = useState(EASTERN);
  const [source, setSource] = useState<"home" | "away">("home");
  const [meeting, setMeeting] = useState("");

  useEffect(() => {
    const initialMeeting = window.setTimeout(() => {
      const p = parts(new Date(Date.now() + 3600000), IST);
      setMeeting(`${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`);
    }, 0);
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => {
      window.clearTimeout(initialMeeting);
      window.clearInterval(id);
    };
  }, []);

  const instant = meeting ? zonedToDate(meeting, source === "home" ? homeZone : awayZone) : now;
  const homeHour = +parts(instant, homeZone).hour;
  const awayHour = +parts(instant, awayZone).hour;
  const comfortable = homeHour >= 8 && homeHour < 22 && awayHour >= 8 && awayHour < 18;

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Timebridge home"><span>TB</span> Timebridge</a>
        <div className="live"><i /> LIVE · TWO TIME ZONES</div>
      </header>

      <section className="hero" id="top">
        <p className="eyebrow">{zoneInfo(homeZone)[1].toUpperCase()} ↔ {zoneInfo(awayZone)[1].toUpperCase()}</p>
        <h1>Meet across oceans.<br /><em>Not across sleep.</em></h1>
        <p className="lede">A clear, daylight-saving-aware way to find the overlap between your day and theirs.</p>
      </section>

      <section className="clocks" aria-label="Live clocks">
        <article className="clock-card india">
          <div className="card-head"><select aria-label="Home timezone" value={homeZone} onChange={(e) => setHomeZone(e.target.value)}>{ZONES.map(z => <option key={z[0]} value={z[0]}>{z[1]}</option>)}</select><span className="pill">{parts(now, homeZone).timeZoneName}</span></div>
          <strong>{clock(now, homeZone)}</strong>
          <p>{fullDate(now, homeZone)}</p>
          <div className="horizon">{zoneInfo(homeZone)[2]}</div>
        </article>
        <article className="clock-card usa">
          <div className="card-head"><select aria-label="Offshore timezone" value={awayZone} onChange={(e) => setAwayZone(e.target.value)}>{ZONES.map(z => <option key={z[0]} value={z[0]}>{z[1]}</option>)}</select><span className="pill">{parts(now, awayZone).timeZoneName}</span></div>
          <strong>{clock(now, awayZone)}</strong>
          <p>{fullDate(now, awayZone)}</p>
          <div className="horizon">{zoneInfo(awayZone)[2]}</div>
        </article>
      </section>

      <section className="planner">
        <div className="planner-copy">
          <p className="eyebrow">MEETING PLANNER</p>
          <h2>Pick a time.<br />See both worlds.</h2>
          <p>Choose the timezone you’re scheduling from. We’ll convert the exact date, including EDT/EST changes.</p>
          <div className="tip"><b>Best overlap</b><span>8:30–10:30 PM IST<br />11:00 AM–1:00 PM Eastern</span></div>
        </div>

        <div className="planner-card">
          <label>Scheduling from</label>
          <div className="segmented">
            <button className={source === "home" ? "active" : ""} onClick={() => setSource("home")}>{zoneInfo(homeZone)[1]}</button>
            <button className={source === "away" ? "active" : ""} onClick={() => setSource("away")}>{zoneInfo(awayZone)[1]}</button>
          </div>
          <label htmlFor="meeting">Meeting date & time</label>
          <input id="meeting" type="datetime-local" value={meeting} onChange={(e) => setMeeting(e.target.value)} />

          <div className="conversion">
            <div><span>{zoneInfo(homeZone)[1]}</span><b>{meetingLabel(instant, homeZone)}</b></div>
            <div className="swap">↔</div>
            <div><span>{zoneInfo(awayZone)[1]}</span><b>{meetingLabel(instant, awayZone)}</b></div>
          </div>
          <div className={`verdict ${comfortable ? "good" : "late"}`}>
            <span>{comfortable ? "✓" : "!"}</span>
            <div><b>{comfortable ? "Good overlap for both teams" : "This may be outside working hours"}</b><p>Both zones use their correct date-specific offset, including daylight saving.</p></div>
          </div>
        </div>
      </section>

      <footer><span>TIMEBRIDGE</span><p>Built for teams working across India and the US.</p><a href="#top">BACK TO TOP ↑</a></footer>
    </main>
  );
}
