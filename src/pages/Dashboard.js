import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
// filter
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get("http://127.0.0.1:8000/expenses", {
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
      "http://127.0.0.1:8000/expenses",
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

    setShowModal(false);  // close popup
    fetchExpenses();      // refresh list
  } catch (err) {
    console.log(err);
  }
};
const deleteExpense = async (id) => {
  try {
    const token = localStorage.getItem("token");

    await axios.delete(`http://127.0.0.1:8000/expenses/${id}`, {
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

  return (
  <div className="dashboard-container">
    <div className="dashboard-header">
  <h2 className="dashboard-title">My Expenses</h2>
  <button className="add-btn" onClick={() => setShowModal(true)}>
  +
</button>
</div>

     {expenses.length === 0 ? (
      <div className="empty-container">
        <p>No expenses yet. Add one!</p>
      </div>
    ) : (
      <div className="dashboard-grid">
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
       <div className="filter-container">
  
      <div className="filter-group">
        <label>Month</label>
        <select onChange={(e) => setSelectedMonth(e.target.value)}>
          <option value="all">All</option>
          <option value="0">Jan</option>
          <option value="1">Feb</option>
          <option value="2">Mar</option>
          <option value="3">Apr</option>
          <option value="4">May</option>
          <option value="5">Jun</option>
          <option value="6">Jul</option>
          <option value="7">Aug</option>
          <option value="8">Sep</option>
          <option value="9">Oct</option>
          <option value="10">Nov</option>
          <option value="11">Dec</option>
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
);
}

export default Dashboard;