import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [message, setMessage] = useState("");
  const [replyMessage, setReplyMessage] = useState({});
  const [showReplyField, setShowReplyField] = useState({});
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/feedback");
      setFeedbacks(res.data.feedbacks);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      toast.error("Failed to load feedback.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error("Feedback message cannot be empty!");
      return;
    }
    
    try {
      const res = await axios.post(
        "http://localhost:3000/api/feedback",
        { username, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeedbacks([res.data.feedback, ...feedbacks]);
      setMessage("");
      toast.success("Feedback submitted successfully!");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback.");
    }
  };

  const toggleReplyField = (feedbackId) => {
    setShowReplyField({
      ...showReplyField,
      [feedbackId]: !showReplyField[feedbackId]
    });
    
    if (!replyMessage[feedbackId]) {
      setReplyMessage({ ...replyMessage, [feedbackId]: "" });
    }
  };

  const handleReplySubmit = async (id) => {
    if (!replyMessage[id]?.trim()) {
      toast.error("Reply message cannot be empty!");
      return;
    }
    
    try {
      const res = await axios.post(
        `http://localhost:3000/api/feedback/${id}/reply`,
        { username, message: replyMessage[id] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeedbacks(feedbacks.map((f) => (f._id === id ? res.data.feedback : f)));
      setReplyMessage({ ...replyMessage, [id]: "" });
      setShowReplyField({ ...showReplyField, [id]: false });
      toast.success("Reply added successfully!");
    } catch (error) {
      console.error("Error submitting reply:", error);
      toast.error("Failed to add reply.");
    }
  };

  const cancelReply = (feedbackId) => {
    setReplyMessage({ ...replyMessage, [feedbackId]: "" });
    setShowReplyField({ ...showReplyField, [feedbackId]: false });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 shadow-lg rounded-lg transition-colors">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">
        Public Feedback
      </h2>

      {/* Feedback Form */}
      <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">
          Share Your Thoughts
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg
                      bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-24
                      focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 outline-none"
            placeholder="Write your feedback..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 
                      text-white font-medium px-5 py-2 rounded-lg transition-colors
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Submit Feedback
          </button>
        </form>
      </div>

      {/* Feedback List Header */}
      {feedbacks.length > 0 && (
        <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">
          Recent Feedback ({feedbacks.length})
        </h3>
      )}

      {/* Feedback List */}
      <div className="space-y-5">
        {feedbacks.map((fb) => (
          <div 
            key={fb._id} 
            className="p-5 border border-gray-400 dark:border-gray-700 rounded-lg 
                      bg-gray-100 dark:bg-gray-700 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 
                            flex items-center justify-center font-semibold text-sm mr-2">
                {fb.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-white">{fb.username}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(fb.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 mb-3 whitespace-pre-line">{fb.message}</p>

            {/* Replies */}
            {fb.replies.length > 0 && (
              <div className="mt-4 mb-4 pl-4 border-l-2 border-gray-400 dark:border-gray-600 space-y-3">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Replies ({fb.replies.length})
                </h4>
                {fb.replies.map((reply, index) => (
                  <div key={index} className="mb-2">
                    <div className="flex items-center mb-1">
                      <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 
                                    flex items-center justify-center font-semibold text-xs mr-2">
                        {reply.username.charAt(0).toUpperCase()}
                      </div>
                      <p className="font-medium text-sm text-gray-700 dark:text-gray-200">{reply.username}</p>
                      <span className="mx-2 text-xs text-gray-400 dark:text-gray-500">•</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {reply.createdAt ? new Date(reply.createdAt).toLocaleString() : "Just now"}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 pl-8">{reply.message}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Button or Reply Form */}
            {!showReplyField[fb._id] ? (
              <button
                onClick={() => toggleReplyField(fb._id)}
                className="mt-2 text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 bg-transparent dark:bg-gray-900
                          flex items-center focus:outline-none focus:underline"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                Reply
              </button>
            ) : (
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 
                                flex items-center justify-center font-semibold text-xs mt-2">
                    {username ? username.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="flex-1">
                    <textarea
                      className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                                bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-20
                                focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 outline-none"
                      placeholder="Write your reply..."
                      value={replyMessage[fb._id] || ""}
                      onChange={(e) => setReplyMessage({ ...replyMessage, [fb._id]: e.target.value })}
                    />
                    <div className="flex justify-end space-x-2 mt-2">
                      <button
                        className="px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 
                                  rounded-md transition-colors"
                        onClick={() => cancelReply(fb._id)}
                      >
                        Cancel
                      </button>
                      <button
                        className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 
                                  text-white font-medium px-3 py-1 rounded-md text-sm transition-colors
                                  focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                        onClick={() => handleReplySubmit(fb._id)}
                      >
                        Post Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {feedbacks.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="mb-2">No feedback yet. Be the first to share!</p>
        </div>
      )}
    </div>
  );
};

export default Feedback;