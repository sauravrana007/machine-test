import { useState, useEffect } from 'react';

const fetchCountries = async () => {
  const response = await fetch('/api/countries');
  if (!response.ok) {
    throw new Error('Failed to fetch countries');
  }
  return response.json();
};

const fetchUsers = async () => {
  const response = await fetch('/api/users');
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
};

const HomePage = () => {
  const [countries, setCountries] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ firstname: '', lastname: '', country_id: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const countriesData = await fetchCountries();
        const usersData = await fetchUsers();
        // Remove duplicates from countries data
        const uniqueCountries = Array.from(new Set(countriesData.map(country => country.name)))
          .map(name => {
            return countriesData.find(country => country.name === name);
          });
        setCountries(uniqueCountries);
        setUsers(usersData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await fetch('/api/users', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, id: editingId }),
        });
      } else {
        await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }
      setForm({ firstname: '', lastname: '', country_id: '' });
      setEditingId(null);
      const usersData = await fetchUsers();
      setUsers(usersData);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEdit = (user) => {
    setForm({ firstname: user.firstname, lastname: user.lastname, country_id: user.country_id });
    setEditingId(user.id);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
      const usersData = await fetchUsers();
      setUsers(usersData);
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container">
      <h1>Form with CRUD Operations</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="firstname">First Name:</label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            value={form.firstname}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastname">Last Name:</label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={form.lastname}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="country_id">Country:</label>
          <select
            id="country_id"
            name="country_id"
            value={form.country_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>{country.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="submit-button">
          {editingId ? 'Update' : 'Submit'}
        </button>
      </form>
      <h2>Users List</h2>
      <ul className="user-list">
        {users.map((user) => (
          <li key={user.id} className="user-item">
            {user.firstname} {user.lastname} ({user.country})
            <div className="button-group">
              <button onClick={() => handleEdit(user)} className="edit-button">
                Edit
              </button>
              <button onClick={() => handleDelete(user.id)} className="delete-button">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        h1 {
          text-align: center;
        }
        .form {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-bottom: 20px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
        }
        .form-group label {
          margin-bottom: 5px;
        }
        .form-group input,
        .form-group select {
          padding: 8px;
          font-size: 16px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .submit-button {
          padding: 10px 15px;
          font-size: 16px;
          color: white;
          background-color: #0070f3;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .submit-button:hover {
          background-color: #005bb5;
        }
        .user-list {
          list-style: none;
          padding: 0;
        }
        .user-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          border-bottom: 1px solid #ddd;
        }
        .button-group {
          display: flex;
          gap: 10px;
        }
        .edit-button,
        .delete-button {
          padding: 5px 10px;
          font-size: 14px;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .edit-button {
          background-color: #0070f3;
        }
        .edit-button:hover {
          background-color: #005bb5;
        }
        .delete-button {
          background-color: #e00;
        }
        .delete-button:hover {
          background-color: #b00;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
