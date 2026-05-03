# 🚗 AutoCare-Hub

AutoCare-Hub is a comprehensive MERN (MongoDB, Express, React, Node.js) stack application designed to streamline vehicle service management. It provides a unified platform for customers to manage their vehicles and book services, for mechanics to track their assigned jobs, and for managers to oversee the entire operation through data-driven insights.

## 🚀 Key Features

### 👤 Customer Portal
- **Vehicle Garage**: Add and manage multiple vehicles with detailed specifications.
- **Service Booking**: Schedule maintenance or repairs with a few clicks.
- **Service Tracking**: Real-time updates on active service requests.
- **Service History**: Access a complete record of past services and ratings.

### 🛠️ Mechanic Dashboard
- **Job Management**: View and manage assigned service tasks.
- **Status Updates**: Update the progress of services (Pending → In-Progress → Completed).
- **Service Notes**: Add technical notes and observations to service records.

### 📊 Manager Suite
- **Workload Overview**: Monitor mechanic assignments and active service requests.
- **Personnel Management**: Create and manage mechanic accounts.
- **Analytics Dashboard**: Visualize service booking forecasts and business performance metrics using Recharts.
- **Request Assignment**: Delegate service requests to specific mechanics.

---

## 🛠️ Tech Stack

**Frontend:**
- **React (v19)**: Component-based UI development.
- **Redux Toolkit**: Efficient state management.
- **React Router (v7)**: Modern routing with flat structure.
- **Recharts**: Data visualization for dashboards.
- **Lucide React**: Clean and consistent iconography.
- **Vanilla CSS**: Custom, premium styling.

**Backend:**
- **Node.js & Express**: Scalable server-side logic.
- **MongoDB & Mongoose**: Flexible NoSQL database and ODM.
- **JWT (JSON Web Tokens)**: Secure authentication and role-based authorization.
- **Bcrypt.js**: Secure password hashing.
- **Multer**: Handling file uploads for vehicle images.

---

## 📂 Project Structure

```text
AutoCare-Hub/
├── frontend/             # React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── contexts/     # Auth and Theme contexts
│   │   ├── Pages/        # Main route pages (Dashboard, Login, etc.)
│   │   └── Styles/       # Global and component-specific CSS
│   └── package.json
├── backend/              # Express server
│   ├── src/
│   │   ├── controllers/  # API logic
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # API endpoints
│   │   └── middlewares/  # Auth and validation
│   └── server.js         # Entry point
└── README.md             # Project documentation
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/AutoCare-Hub.git
   cd AutoCare-Hub
   ```

2. **Backend Configuration:**
   - Navigate to the `backend` folder: `cd backend`
   - Install dependencies: `npm install`
   - Create a `.env` file and add the following:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     ```
   - Start the backend: `npm run dev`

3. **Frontend Configuration:**
   - Navigate to the `frontend` folder: `cd ../frontend`
   - Install dependencies: `npm install`
   - Start the frontend: `npm start`
   - The app will be available at `http://localhost:3000`

---

## 🛡️ Authentication & Security
The application uses **JWT** for secure communication. Roles are strictly enforced via middleware:
- `isCustomer`: Access to vehicle management and booking.
- `isMechanic`: Access to assigned jobs and service updates.
- `isManager`: Access to full system overview and personnel management.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
