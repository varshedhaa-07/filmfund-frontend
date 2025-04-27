import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';
import { useAuth } from "./AuthContext"; // ✅ If you're using AuthContext to get user token

function FundPage() {
  const { id } = useParams(); // Get the film ID from URL
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user from context
  const [film, setFilm] = useState(null);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const fetchFilm = async () => {
      try {
        const res = await axios.get(`https://filmfund.onrender.com/api/films/${id}`);
        setFilm(res.data);
      } catch (error) {
        console.error("Error fetching film:", error.message);
      }
    };

    fetchFilm();
  }, [id]);

  const handleFundNow = async () => {
    if (!amount) {
      toast.error("Please select a contribution amount!");
      return;
    }

    try {
      await axios.post(
        `https://filmfund.onrender.com/api/films/${id}/contribute`,
        { amount },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`, // Send token for protected route
          },
        }
      );

      toast.success("Thank you for your support!!");
      navigate("/projects"); 
    } catch (error) {
      console.error("Funding error:", error.response?.data || error.message);
      toast.error(error.response?.data?.msg || "Funding failed");
    }
  };

  if (!film) {
    return <div>Loading film details...</div>;
  }

  return (
    <div className="fund-container">
      <button className="back-button" onClick={() => navigate("/projects")}>
        ← 
      </button>

      <div className="fund-content">
        <h1>Support "{film.title}"</h1>
        <p>{film.description}</p>
        <img src={film.image} alt={film.title} style={{ width: "40%", borderRadius: "10px", marginBottom: "20px" }} />

        <div className="fund-options">
          <label>Select Your Contribution Amount:</label>
          <select value={amount} onChange={(e) => setAmount(e.target.value)}>
            <option value="">-- Select Amount --</option>
            <option value="10">$10 - Supporter</option>
            <option value="25">$25 - Special Thanks</option>
            <option value="50">$50 - Early Access</option>
            <option value="100">$100 - Executive Producer Credit</option>
          </select>
        </div>

        <button className="fund-button" onClick={handleFundNow}>
          Confirm & Fund Now
        </button>
      </div>
    </div>
  );
}

export default FundPage;
