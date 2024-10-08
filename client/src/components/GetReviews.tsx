import axios from 'axios';
import React, { useEffect, useState } from 'react';
import link from "../assets/link.json";
import Rating from '@mui/material/Rating';
import { GenerateURL } from './GenerateURL';
import { useNavigate, useParams } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface revData {
  username: string;
  rating: number;
  review: string;
  approved: boolean;
  compId: string;
}

const GetReviews: React.FC = () => {
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const compId = params.get("id");
  const { compName } = useParams<{ compName: string }>();
  const [reviews, setReviews] = useState<revData[]>([]);
  const [expandedReviews, setExpandedReviews] = useState<number[]>([]);
  const [compURL, setCompURL] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  // Snackbar state
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");

  useEffect(() => {
    const validCompID = compId || "";
    const validCompName = compName || "";
    setCompURL(GenerateURL({ compId: validCompID, compName: validCompName }));
    const getRev = async () => {
      try {
        const res = await axios.post(`${link.url}/get-review`, 
          { compId: compId }        );
        console.log(res);
        setReviews(res.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    getRev();
  }, [compId]);

  const toggleShowMore = (index: number) => {
    setExpandedReviews((prev) => 
      prev.includes(index) 
        ? prev.filter((i) => i !== index) 
        : [...prev, index]
    );
  };

  const truncateReview = (review: string, index: number) => {
    const words = review.split(" ");
    if (words.length <= 10 || expandedReviews.includes(index)) {
      return review;
    }
    return words.slice(0, 10).join(" ") + "...";
  };

  const handleCopyURL = () => {
    navigator.clipboard.writeText(compURL)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); 
      })
      .catch((err) => console.error("Error copying URL: ", err));
  };

  const handleApprove = async (ind: number, compId: string) => {
    try {
      const token: string | null = localStorage.getItem("token");
      const res = await axios.post(`${link.url}/approve`, {
        compId: compId,
        ind: ind,
      }, {headers: {Authorization: `Bearer ${token}`}})
      
      // Show snackbar with success message
      setSnackbarMessage("Review approved successfully!");
      setOpenSnackbar(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);

      console.log(res);
    } catch (error) {
      console.error("Error approving review:", error);
    }
  };

  
const handleRemove = async (ind: number, compId: string) => {
  try {
    const token: string | null = localStorage.getItem("token");

    const res = await axios.delete(`${link.url}/remove`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { compId: compId, ind: ind } 
    });
    console.log(res);
    window.location.reload();
  } catch (error) {
    console.error("Error removing review: ", error);
  }
};

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-4">
        <div className="flex items-center bg-gray-200 px-4 py-2 rounded-lg shadow-md">
          <span className="text-gray-700 mr-2">Review URL:</span>
          <input
            type="text"
            value={compURL}
            readOnly
            className="bg-transparent outline-none text-blue-500 font-semibold w-full md:w-auto"
          />
        </div>
        <button
          onClick={handleCopyURL}
          className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Copy URL
        </button>
        <button
          onClick={() => navigate(`/approved-reviews?id=${compId}`)}
          className="px-3 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition duration-300"
        >
          Show Approved Reviews
        </button>
      </div>

      {copied && <p className="text-center text-green-500 font-semibold mb-4">URL copied to clipboard!</p>}

      <h1 className="text-3xl font-bold mb-6 text-gray-600 text-center">Company Reviews</h1>
      
      {reviews.length > 0 ? (
        reviews.map((rev, index) => (
          <div
            key={index}
            className="bg-gray-800 p-6 rounded-lg mb-6 shadow-md text-white transition-transform transform hover:scale-105 duration-300"
          >
            <h2 className="text-xl font-semibold text-gray-100 mb-2">{rev.username}</h2>
            <Rating name="read-only" value={rev.rating} readOnly className="mb-4" />
            <p className="text-white">
              {truncateReview(rev.review, index)}
              {rev.review.split(" ").length > 10 && (
                <button
                  onClick={() => toggleShowMore(index)}
                  className="text-blue-500 ml-5 hover:text-blue-400 transition duration-200"
                >
                  {expandedReviews.includes(index) ? "Show Less" : "Show More"}
                </button>
              )}
            </p>
            {!rev.approved && (
              <button 
                onClick={() => handleApprove(index, rev.compId)}
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
              >
                Approve
              </button>
            )}
            {rev.approved && (
              <button 
                onClick={() => handleRemove(index, rev.compId)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
              >
                Remove
              </button>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-800 text-center">No reviews available</p>
      )}
 
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default GetReviews;
