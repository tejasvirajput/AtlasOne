// //working fine with openai

// import React, { useState } from "react";
// import axios from "axios";

// function TripPlanner() {
//   const [destination, setDestination] = useState("");
//   const [days, setDays] = useState("");
//   const [budget, setBudget] = useState("Mid");
//   const [interests, setInterests] = useState([]);
//   const [result, setResult] = useState(null);

//   const toggleInterest = (value) => {
//     setInterests((prev) =>
//       prev.includes(value)
//         ? prev.filter((i) => i !== value)
//         : [...prev, value]
//     );
//   };

//   const generate = async () => {
//     try {
//       const res = await axios.post(
//         "http://localhost:8000/api/itinerary",
//         { destination, days, budget, interests },
//         { withCredentials: true }
//       );

//       setResult(res.data.itinerary);
//     } catch (err) {
//       console.log(err);
//       alert("Error generating itinerary");
//     }
//   };

//   return (
//     <div className="p-4 max-w-2xl mx-auto">
//       <h1 className="text-3xl font-bold mb-4">AI Trip Planner</h1>

//       <input className="border p-2 w-full mb-3"
//         placeholder="Destination"
//         value={destination}
//         onChange={(e) => setDestination(e.target.value)}
//       />

//       <input className="border p-2 w-full mb-3"
//         placeholder="Days"
//         value={days}
//         onChange={(e) => setDays(e.target.value)}
//       />

//       <select 
//         className="border p-2 w-full mb-3"
//         value={budget}
//         onChange={(e) => setBudget(e.target.value)}
//     >
//         <option value="₹10,000 - ₹20,000">₹10,000 - ₹20,000</option>
//         <option value="₹20,000 - ₹40,000">₹20,000 - ₹40,000</option>
//         <option value="₹40,000 - ₹60,000">₹40,000 - ₹60,000</option>
//         <option value="₹60,000+">₹60,000+</option>
//     </select>

//       {/* INTERESTS */}
//       <div className="grid grid-cols-2 gap-2 mb-3">
//         {["Culture", "Food", "Adventure", "Relaxation"].map((name) => (
//           <label key={name}>
//             <input
//               type="checkbox"
//               checked={interests.includes(name)}
//               onChange={() => toggleInterest(name)}
//             />{" "}
//             {name}
//           </label>
//         ))}
//       </div>

//       <button
//         onClick={generate}
//         className="bg-red-600 text-white px-4 py-2 rounded"
//       >
//         Generate Plan
//       </button>

//       {/* RESULT */}
//       {result && (
//         <div className="mt-6 p-4 border rounded bg-white">
//           <h2 className="text-xl font-bold mb-2">
//             {result.destination} — {result.days} days
//           </h2>

//           {result.dayWise.map((d) => (
//             <div key={d.day} className="mb-3">
//               <h3 className="font-semibold">Day {d.day}</h3>
//               <pre className="whitespace-pre-wrap">
//                 {d.content}
//               </pre>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default TripPlanner;

// // frontend/src/pages/TripPlanner.jsx - with download pdf
// import React, { useState } from "react";
// import axios from "axios";
// import { jsPDF } from "jspdf";

// function TripPlanner() {
//   const [destination, setDestination] = useState("");
//   const [days, setDays] = useState("");
//   // budgetMin & budgetMax are rupee numbers (strings while typing)
//   const [budgetMin, setBudgetMin] = useState("");
//   const [budgetMax, setBudgetMax] = useState("");
//   const [interests, setInterests] = useState([]);
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const toggleInterest = (value) => {
//     setInterests((prev) =>
//       prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]
//     );
//   };

//   const generate = async () => {
//     if (!destination || !days) {
//       alert("Please enter destination and days");
//       return;
//     }

//     // Build budget string to send to backend (keeps backend-compatible).
//     // Example: "40000-50000" or fallback to "Mid"
//     let budgetString = "Mid";
//     const minNum = parseInt(budgetMin?.replace(/[^0-9]/g, ""), 10);
//     const maxNum = parseInt(budgetMax?.replace(/[^0-9]/g, ""), 10);
//     if (!Number.isNaN(minNum) && !Number.isNaN(maxNum)) {
//       budgetString = `${minNum}-${maxNum}`;
//     } else if (!Number.isNaN(minNum)) {
//       budgetString = `${minNum}-`;
//     } else if (!Number.isNaN(maxNum)) {
//       budgetString = `-${maxNum}`;
//     }

//     try {
//       setLoading(true);
//       const res = await axios.post(
//         "/api/itinerary",
//         { destination, days, budget: budgetString, interests },
//         { withCredentials: true }
//       );
//       setResult(res.data.itinerary);
//       // Scroll to result
//       setTimeout(() => {
//         const el = document.getElementById("itineraryResult");
//         if (el) el.scrollIntoView({ behavior: "smooth" });
//       }, 80);
//     } catch (err) {
//       console.error(err);
//       alert("Error generating itinerary — check backend logs / rate limits");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Download the currently displayed itinerary as PDF
//   const downloadPdf = () => {
//     if (!result) return;
//     const doc = new jsPDF({ unit: "pt", format: "a4" });
//     const margin = 40;
//     const maxWidth = 520;
//     let y = 40;

//     doc.setFontSize(18);
//     doc.text(`${result.destination} — ${result.days} Days`, margin, y);
//     y += 28;

//     // Display budget, interests
//     doc.setFontSize(11);
//     const budgetText =
//       budgetMin || budgetMax
//         ? `Budget: ₹${budgetMin || "0"} - ₹${budgetMax || "∞"}`
//         : `Budget: ${result.budget || "Mid"}`;
//     doc.text(budgetText, margin, y);
//     y += 18;
//     if (result.interests && result.interests.length) {
//       doc.text(`Interests: ${result.interests.join(", ")}`, margin, y);
//       y += 18;
//     }

//     y += 6;
//     doc.setFontSize(12);

//     result.dayWise.forEach((d) => {
//       const title = `Day ${d.day}`;
//       const linesTitle = doc.splitTextToSize(title, maxWidth);
//       if (y + 30 > 800) {
//         doc.addPage();
//         y = 40;
//       }
//       doc.setFont(undefined, "bold");
//       linesTitle.forEach((line) => {
//         doc.text(line, margin, y);
//         y += 16;
//       });
//       doc.setFont(undefined, "normal");

//       // Split content to size and print
//       const text = (d.content || "").replace(/\r/g, "");
//       const lines = doc.splitTextToSize(text, maxWidth);
//       lines.forEach((ln) => {
//         if (y + 16 > 800) {
//           doc.addPage();
//           y = 40;
//         }
//         doc.text(ln, margin, y);
//         y += 14;
//       });

//       y += 10;
//     });

//     const fileName = `${(result.destination || "itinerary").replace(
//       /[^a-z0-9\-]/gi,
//       "_"
//     )}.pdf`;
//     doc.save(fileName);
//   };

//   return (
//     <div className="p-6 max-w-3xl mx-auto">
//       <h1 className="text-3xl font-bold mb-6">AI Trip Planner</h1>

//       <div className="bg-white shadow rounded p-6 mb-6">
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Destination
//         </label>
//         <input
//           className="border p-3 w-full mb-4 rounded"
//           placeholder="e.g. Haridwar"
//           value={destination}
//           onChange={(e) => setDestination(e.target.value)}
//         />

//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Days
//         </label>
//         <input
//           className="border p-3 w-full mb-4 rounded"
//           placeholder="Number of days"
//           type="number"
//           min="1"
//           max="30"
//           value={days}
//           onChange={(e) => setDays(e.target.value)}
//         />

//         <div className="grid grid-cols-2 gap-4 mb-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Budget Min (₹)
//             </label>
//             <input
//               className="border p-2 w-full rounded"
//               placeholder="e.g. 40000"
//               value={budgetMin}
//               onChange={(e) => setBudgetMin(e.target.value)}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Budget Max (₹)
//             </label>
//             <input
//               className="border p-2 w-full rounded"
//               placeholder="e.g. 50000"
//               value={budgetMax}
//               onChange={(e) => setBudgetMax(e.target.value)}
//             />
//           </div>
//         </div>

//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Interests
//         </label>
//         <div className="grid grid-cols-2 gap-3 mb-4">
//           {["Culture", "Food", "Adventure", "Relaxation"].map((name) => (
//             <label key={name} className="inline-flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 checked={interests.includes(name)}
//                 onChange={() => toggleInterest(name)}
//                 className="form-checkbox h-5 w-5"
//               />
//               <span className="text-sm">{name}</span>
//             </label>
//           ))}
//         </div>

//         <div className="flex gap-3 items-center">
//           <button
//             onClick={generate}
//             disabled={loading}
//             className="bg-red-600 text-white px-4 py-2 rounded shadow"
//           >
//             {loading ? "Generating..." : "Generate Itinerary"}
//           </button>
//           {result && (
//             <button
//               onClick={downloadPdf}
//               className="bg-green-600 text-white px-3 py-2 rounded shadow"
//             >
//               Download PDF
//             </button>
//           )}
//         </div>
//       </div>

//       {/* RESULT */}
//       {result ? (
//         <div id="itineraryResult" className="bg-white p-6 rounded shadow">
//           <div className="flex items-start justify-between">
//             <div>
//               <h2 className="text-2xl font-bold mb-1">
//                 {result.destination} — {result.days} Days
//               </h2>
//               <p className="text-gray-600 mb-3">
//                 {budgetMin || budgetMax
//                   ? `Budget: ₹${budgetMin || "0"} - ₹${budgetMax || "∞"}`
//                   : `Budget: ${result.budget || "Mid"}`}
//               </p>
//               {result.interests && result.interests.length > 0 && (
//                 <p className="text-gray-600 mb-4">
//                   Interests: {result.interests.join(", ")}
//                 </p>
//               )}
//             </div>
//           </div>

//           <div className="space-y-5 mt-4">
//             {result.dayWise.map((d) => (
//               <article
//                 key={d.day}
//                 className="border rounded p-4 bg-gray-50 text-gray-800"
//               >
//                 <h3 className="text-lg font-semibold mb-2">Day {d.day}</h3>
//                 {/* split into paragraphs at blank lines to make it readable */}
//                 {d.content
//                   .split(/\n\s*\n/) // paragraphs
//                   .map((para, idx) => (
//                     <p key={idx} className="mb-2 leading-7 whitespace-pre-wrap">
//                       {para}
//                     </p>
//                   ))}
//               </article>
//             ))}
//           </div>
//         </div>
//       ) : (
//         <div className="text-gray-500">Fill the form and click Generate Itinerary.</div>
//       )}
//     </div>
//   );
// }

// export default TripPlanner;


//final
import React, { useState } from "react";
import axios from "axios";

function TripPlanner() {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [interests, setInterests] = useState([]);
  const [result, setResult] = useState(null);

  const toggleInterest = (value) => {
    setInterests((prev) =>
      prev.includes(value)
        ? prev.filter((i) => i !== value)
        : [...prev, value]
    );
  };

  const generate = async () => {
    if (!destination || !days) {
      alert("Enter destination and days");
      return;
    }

    // Budget format -> "4000-50000"
    let budget = "Mid";
    if (budgetMin || budgetMax) {
      budget = `${budgetMin || ""}-${budgetMax || ""}`;
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/api/itinerary",
        { destination, days, budget, interests },
        { withCredentials: true }
      );

      setResult(res.data.itinerary);
    } catch (err) {
      console.log(err);
      alert("Error generating itinerary");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">AI Trip Planner</h1>

      <div className="bg-white shadow rounded p-6">
        {/* Destination */}
        <label className="block text-sm font-medium mb-1">Destination</label>
        <input
          className="border p-3 w-full mb-4 rounded"
          placeholder="e.g. Goa"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />

        {/* Days */}
        <label className="block text-sm font-medium mb-1">Days</label>
        <input
          className="border p-3 w-full mb-4 rounded"
          placeholder="Number of days"
          type="number"
          value={days}
          onChange={(e) => setDays(e.target.value)}
        />

        {/* Budget */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm mb-1">Budget Min (₹)</label>
            <input
              className="border p-3 w-full rounded"
              placeholder="e.g. 4000"
              value={budgetMin}
              onChange={(e) => setBudgetMin(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Budget Max (₹)</label>
            <input
              className="border p-3 w-full rounded"
              placeholder="e.g. 50000"
              value={budgetMax}
              onChange={(e) => setBudgetMax(e.target.value)}
            />
          </div>
        </div>

        {/* Interests */}
        <label className="block text-sm font-medium mb-2">Interests</label>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {["Culture", "Food", "Adventure", "Relaxation"].map((name) => (
            <label key={name} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={interests.includes(name)}
                onChange={() => toggleInterest(name)}
              />
              {name}
            </label>
          ))}
        </div>

        <button
          onClick={generate}
          className="bg-red-600 text-white px-5 py-2 rounded text-lg"
        >
          Generate Itinerary
        </button>
      </div>

      {/* RESULT */}
      {result && (
        <div className="mt-6 p-6 bg-white shadow rounded">
          <h2 className="text-2xl font-bold mb-2">
            {result.destination} — {result.days} days
          </h2>

          {(budgetMin || budgetMax) && (
            <p className="text-gray-700 mb-3">
              Budget: ₹{budgetMin || "0"} – ₹{budgetMax || "∞"}
            </p>
          )}

          {result.dayWise.map((d) => (
            <div key={d.day} className="mb-4">
              <h3 className="font-bold text-lg">Day {d.day}</h3>
              <pre className="whitespace-pre-wrap text-gray-800">
                {d.content}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TripPlanner;
