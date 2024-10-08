import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/Login.tsx'
import Register from './components/Register.tsx'
import Home from "./components/Home.tsx"
import GetReviews from './components/GetReviews.tsx'
import AddCompany from './components/AddCompany.tsx'
import AddReview from"./components/AddReview.tsx"
import ApprovedReviews from './components/ApprovedReviews.tsx'
import EmbeddedReviews from './components/EmbeddedReviews.tsx'
const route = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        path: "/",
        element: <Login/>
      },
      {
        path: "/register",
        element: <Register/>
      },
      {
        path:"/home",
        element: <Home/>
      },
      {
        path: "/reviews/:compName",
        element: <GetReviews/>
      },
      {
        path: "/add-company",
        element: <AddCompany/>
      },
      {
        path: "/add-review/:compName/:id",
        element: <AddReview/>
      },
      {
        path: "/approved-reviews",
        element: <ApprovedReviews/>
      },
      {
        path: "/embed-reviews",
        element: <EmbeddedReviews/>
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
    <RouterProvider router={route}/>
)
