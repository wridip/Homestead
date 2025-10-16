# Contributing to the Homestead Management System

Welcome, developer! This guide provides detailed instructions on how to edit and extend the Homestead Management System. Whether you want to change the look and feel of the website or add new backend features, this document will walk you through the process.

For a high-level overview of the project architecture, please see [`ARCHITECTURE.md`](./ARCHITECTURE.md).

## Table of Contents

1.  [Editing the Frontend (Visuals & Components)](#1-editing-the-frontend-visuals--components)
2.  [Editing the Backend (APIs & Database)](#2-editing-the-backend-apis--database)

---

## 1. Editing the Frontend (Visuals & Components)

The frontend is built with **React**, **Vite**, and **Tailwind CSS**. All frontend code is located in the `/frontend` directory.

### How to Change Colors, Fonts, and Styles

Global styles and design tokens are configured in `frontend/tailwind.config.js`. This is the best place to make site-wide changes to the design system.

**Example: Changing the primary brand color**

1.  **Open `frontend/tailwind.config.js`:**
    ```javascript
    /** @type {import('tailwindcss').Config} */
    export default {
      content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
      ],
      theme: {
        extend: {
          // You can add your custom theme settings here
          colors: {
            primary: '#3b82f6', // Current primary color (blue-500)
          }
        },
      },
      plugins: [],
    }
    ```

2.  **Modify the color:** Change the `primary` color to a new hex code. For example, to make it a deep green:
    ```javascript
    // ...
    colors: {
      primary: '#166534', // New primary color (green-800)
    }
    // ...
    ```

3.  **Use the new color in your components:** You can now use `bg-primary`, `text-primary`, etc., in your React components. For instance, in `frontend/src/components/layout/Navbar.jsx`, you could change the "Sign Up" button's color:
    ```jsx
    // Before
    <Link to="/signup" className="bg-blue-500 text-white ...">Sign Up</Link>

    // After
    <Link to="/signup" className="bg-primary text-white ...">Sign Up</Link>
    ```

### How to Edit a React Component

Let's say you want to add a new field to the **Login form**.

1.  **Locate the component:** The login form is in `frontend/src/pages/public/Login.jsx`.

2.  **Add the new UI element:** Add the JSX for the new input field. For example, a "Remember Me" checkbox:
    ```jsx
    // In frontend/src/pages/public/Login.jsx

    // ... inside the <form>
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
          Remember me
        </label>
      </div>
    </div>
    // ...
    ```

3.  **Manage its state:** Add state for the new checkbox using the `useState` hook.
    ```jsx
    // ...
    const [formData, setFormData] = useState({
      email: '',
      password: '',
    });
    const [rememberMe, setRememberMe] = useState(false); // New state
    // ...
    ```

4.  **Handle the change:** Update the state when the checkbox is clicked.
    ```jsx
    // ... inside the <input> for the checkbox
    <input
      id="remember-me"
      // ...
      checked={rememberMe}
      onChange={(e) => setRememberMe(e.target.checked)}
    />
    // ...
    ```

---

## 2. Editing the Backend (APIs & Database)

The backend is built with **Node.js**, **Express**, and **MongoDB (Mongoose)**. It follows a layered architecture to keep code organized and maintainable. All backend code is in the `/backend` directory.

### How to Add a New API Endpoint

Let's add a new endpoint to get a host's public profile.

1.  **Define the Route:** Open the relevant route file. Since this is related to users, we'll use `backend/src/routes/authRoutes.js`. Add a new route definition:
    ```javascript
    // In backend/src/routes/authRoutes.js
    // ...
    router.get('/host/:id', getHostProfile); // Add this line
    // ...
    ```
    *Note: You'll also need to import `getHostProfile` from the controller.*

2.  **Create the Controller Function:** Open the corresponding controller, `backend/src/controllers/authController.js`, and create the new function. This function contains the core logic.
    ```javascript
    // In backend/src/controllers/authController.js

    // ...
    // @desc    Get public profile for a host
    // @route   GET /api/auth/host/:id
    // @access  Public
    exports.getHostProfile = async (req, res, next) => {
      try {
        const host = await User.findOne({ _id: req.params.id, role: 'Host' }).select('name avatar');

        if (!host) {
          return res.status(404).json({ success: false, message: 'Host not found' });
        }

        res.status(200).json({ success: true, data: host });
      } catch (error) {
        next(error);
      }
    };
    ```

3.  **Test it!** You can now run the backend server (`npm run dev`) and make a `GET` request to `http://localhost:5000/api/auth/host/<some_host_id>` to test your new endpoint.

### How to Modify a Database Schema

Let's add a `bio` field to the `User` model so hosts can write a short introduction.

1.  **Update the Mongoose Schema:** Open `backend/src/models/User.js` and add the new field to the schema definition.
    ```javascript
    // In backend/src/models/User.js
    const userSchema = new mongoose.Schema({
      // ... existing fields
      role: {
        type: String,
        enum: ['Traveler', 'Host', 'Admin'],
        default: 'Traveler'
      },
      bio: { // New field
        type: String,
        maxlength: [500, 'Bio cannot be more than 500 characters']
      },
      avatar: {
        type: String,
        default: 'default-avatar.png'
      },
      // ...
    });
    ```

2.  **Update the Controller Logic:** If you want to allow users to update their bio, you need to modify the relevant controller function. For a profile update, this would likely be in a new `userController.js` or an existing one.
    *   For example, in a hypothetical `updateUserProfile` function, you would add `bio` to the fields that can be updated.

3.  **Update the Frontend:** Finally, add a "Bio" textarea to the user's profile page on the frontend to allow them to view and edit this new field.

By following these patterns, you can keep the codebase clean, organized, and easy to maintain as you add new features. Happy coding!