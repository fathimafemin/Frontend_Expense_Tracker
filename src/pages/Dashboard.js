import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { useNavigate } from "react-router-dom";
import profileImg from "../assets/image.png";

function Dashboard() {
  const API_URL = import.meta.env.VITE_API_URL;
  const baseUrl = API_URL || "https://backend-expense-tracker-6.onrender.com";
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState("expenses");
// expences
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  // logout
  const [showProfile, setShowProfile] = useState(false); 

  useEffect(() => {
  fetchExpenses();  
}, []);
const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7f50",
  "#00c49f",
  "#ffbb28",
  "#ff4d4f",
];
const getColor = (index) => {
  return COLORS[index % COLORS.length];
};
const currentYear = new Date().getFullYear();
const years = [currentYear, currentYear - 1, currentYear - 2];

// filter
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");

  const fetchExpenses = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(`${baseUrl}/expenses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setExpenses(res.data);
  } catch (err) {
    console.log(err);
  }
};
const addExpense = async () => {
  try {
    const token = localStorage.getItem("token");

    await axios.post(
      `${baseUrl}/expenses`,
      {
        amount,
        category,
        date,
        notes,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setShowModal(false);  
    fetchExpenses();      
  } catch (err) {
    console.log(err);
  }
};
const deleteExpense = async (id) => {
  try {
    const token = localStorage.getItem("token");

    await axios.delete(`${baseUrl}/expenses/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchExpenses(); // refresh list
  } catch (err) {
    console.log(err);
  }
};

const filteredExpenses = expenses.filter((item) => {
  const date = new Date(item.date);

  const monthMatch =
    selectedMonth === "all" ||
    date.getMonth() === Number(selectedMonth);

  const yearMatch =
    selectedYear === "all" ||
    date.getFullYear() === Number(selectedYear);

  return monthMatch && yearMatch;
});


// 🔹 ANALYTICS BASED ON FILTER
const filteredAnalytics = filteredExpenses;

// 🔹 CATEGORY DATA
const categoryMap = {};

filteredAnalytics.forEach((item) => {
  if (!categoryMap[item.category]) {
    categoryMap[item.category] = 0;
  }
  categoryMap[item.category] += item.amount;
});

const categoryData = Object.keys(categoryMap).map((key) => ({
  category: key,
  total: categoryMap[key],
}));

// 🔹 TOTAL EXPENSE
const totalExpense = filteredAnalytics.reduce(
  (sum, item) => sum + item.amount,
  0
);

// 🔹 TOP CATEGORY
let topCategory = null;

if (categoryData.length > 0) {
  topCategory = categoryData.reduce((max, item) =>
    item.total > max.total ? item : max
  );
}


const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/");
};
  return (
    
  <div className="dashboard-container">
     {/* LEFT SIDEBAR */}
  <div className="sidebar">
    <h2 className="dashboard-header">Expense Tracker</h2>

    <button
      className={`nav-btn ${view === "expenses" ? "active" : ""}`}
      onClick={() => setView("expenses")}
    >
      Expenses
    </button>

    <button
      className={`nav-btn ${view === "analytics" ? "active" : ""}`}
      onClick={() => setView("analytics")}
    >
      Analytics
    </button>
  </div>
  <div className="main-content">
    <div className="dashboard-header">

  <h2 className="dashboard-title">
    {view === "expenses" ? "My Expenses" : "Analytics"}
  </h2>

  <div className="header-right">

    {/* Add Button (only for expenses) */}
    {view === "expenses" && (
  <div className="add-expenses">
    <button className="add-pill-container" onClick={() => setShowModal(true)}>
      
      <span className="add-text">Add</span>

      <span className="add-icon-box">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="black"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
</span>

    </button>
  </div>
)}
    </div>
    </div>

    {/* Profile */}
    <div className="profile-container">
      <button
  className="profile-btn"
  onClick={() => setShowProfile(!showProfile)}
>
  <img src={profileImg} alt="profile" className="profile-img" />
  <span className="profile-label">Profile</span>
</button>

      {showProfile && (
        <div className="profile-dropdown">
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>

     {view === "expenses" && (
  expenses.length === 0 ? (
    <div className="empty-container">
      <p>No expenses yet. Add one!</p>
    </div>
  ) : (
    <div className="dashboard-grid">

      {/* FILTER */}
      <div className="filter-container">
        <div className="filter-group">
          <label>Month</label>
          <select onChange={(e) => setSelectedMonth(e.target.value)}>
  <option value="all">All</option>

  {months.map((month, index) => (
    <option key={index} value={index}>
      {month}
    </option>
  ))}

</select>
        </div>

        <div className="filter-group">
          <label>Year</label>
          <select onChange={(e) => setSelectedYear(e.target.value)}>
            <option value="all">All</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
        </div>
      </div>

      {/* EXPENSES LIST */}
      {filteredExpenses.map((item) => (
        <div className="dashboard-card" key={item.id}>
          <div>
            <h3>{item.category}</h3>
            <p>{item.notes}</p>
          </div>
          <div>
            <p>₹ {item.amount}</p>
            <p>{item.date}</p>
            <button
              className="delete-btn"
              onClick={() => deleteExpense(item.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

    </div>
  )
)}

{view === "analytics" && (
  
  <div className="dashboard-analytics">

    {/* FILTER */}
    <div className="filter-container">
      <div className="filter-group">
        <label>Month</label>
        <select onChange={(e) => setSelectedMonth(e.target.value)}>
          <option value="all">All</option>
          {months.map((m, i) => (
            <option key={i} value={i}>{m}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Year</label>
        <select onChange={(e) => setSelectedYear(e.target.value)}>
          <option value="all">All</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
    </div>

    {/* TOTAL */}
    <div className="dashboard-header">
    
  </div>
 <div className="dashboard-cards">
  {categoryData.length === 0 ? (
    <div className="empty-container">
      <p>No expenses</p>
    </div>
  ) : (
    <div>
      {/* GRAPH */}
      <BarChart width={250} height={300} data={categoryData}>
  <XAxis dataKey="category" />
  <YAxis />
  <Tooltip />
  <Bar
    dataKey="total"
    shape={(props) => {
      const { x, y, width, height, index } = props;

      return (
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={getColor(index)}
        />
      );
    }}
  />
</BarChart>
    </div>
  )}
    {/* SUMMARY */}
  <div className="analytics-summary">
    
    <div>
      <p className="label">Total Expense</p>
      <h4>₹ {totalExpense}</h4>
    </div>

    <div>
      <p className="label">Top Category</p>
      {topCategory ? (
        <h4>{topCategory.category} (₹ {topCategory.total})</h4>
      ) : (
        <h4>No data</h4>
      )}
    </div>

  </div>
  </div>
  </div>


)}
    {showModal && (
  <div className="modal">
    <div className="modal-content">
      <h3>Add Expense</h3>

      <input
        placeholder="Amount"
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        placeholder="Category"
        onChange={(e) => setCategory(e.target.value)}
      />

      <input
        type="date"
        onChange={(e) => setDate(e.target.value)}
      />

      <input
        placeholder="Notes"
        onChange={(e) => setNotes(e.target.value)}
      />

      <button onClick={addExpense}>Save</button>
      <button onClick={() => setShowModal(false)}>Cancel</button>
    </div>
  </div>
)}
</div>
  </div>  
);
}

export default Dashboard;