// components/AddReviewModal.js
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
// import MessageModal from './MessageModal'; // Replaced by inline error messages for now
import { Star } from 'lucide-react';

const AddReviewModal = ({ isOpen, onClose, onSubmitReview }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [ratingError, setRatingError] = useState('');
  const [reviewError, setReviewError] = useState('');

  // Reset errors when modal opens or closes
  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setReviewText('');
      setRatingError('');
      setReviewError('');
    }
  }, [isOpen]);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    if (newRating > 0) {
      setRatingError('');
    }
  };

  const handleReviewTextChange = (e) => {
    setReviewText(e.target.value);
    if (e.target.value.trim() !== '') {
      setReviewError('');
    }
  };

  const handleSubmit = () => {
    let isValid = true;
    if (rating === 0) {
      setRatingError("กรุณาให้คะแนนสถานที่");
      isValid = false;
    }
    if (reviewText.trim() === '') {
      setReviewError("กรุณาเขียนรีวิว");
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    onSubmitReview(rating, reviewText);
    onClose(); // Close the review modal
  };

  const ratingGroupId = "rating-group";
  const ratingErrorId = "rating-error";
  const reviewErrorId = "review-error";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="เพิ่มรีวิวและให้คะแนน">
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
        <div>
          <label id={ratingGroupId} className="block text-gray-700 dark:text-slate-200 text-sm font-bold mb-2">คะแนน:</label>
          <div
            role="group"
            aria-labelledby={ratingGroupId}
            aria-describedby={ratingError ? ratingErrorId : undefined}
            className="flex"
          >
            {[1, 2, 3, 4, 5].map((starValue) => (
              <button
                type="button" // Important to prevent form submission
                key={starValue}
                onClick={() => handleRatingChange(starValue)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleRatingChange(starValue); }}
                aria-label={`ให้ ${starValue} ดาว`}
                aria-pressed={rating === starValue}
                className={`p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${rating >= starValue ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-slate-600'}`}
              >
                <Star
                  size={32}
                  className={`cursor-pointer ${rating >= starValue ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-slate-600'}`}
                />
              </button>
            ))}
          </div>
          {ratingError && <p id={ratingErrorId} className="text-red-500 text-xs mt-1" aria-live="polite">{ratingError}</p>}
        </div>
        <div>
          <label htmlFor="reviewText" className="block text-gray-700 dark:text-slate-200 text-sm font-bold mb-2">รีวิวของคุณ:</label>
          <textarea
            id="reviewText"
            className={`shadow appearance-none border dark:border-slate-600 rounded-lg w-full py-2 px-3 text-gray-700 dark:text-slate-200 dark:bg-slate-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 dark:focus:border-blue-500 resize-none h-32 transition-colors duration-300 ${reviewError ? 'border-red-500 dark:border-red-500' : ''}`}
            placeholder="เขียนรีวิวเกี่ยวกับสถานที่นี้..."
            value={reviewText}
            onChange={handleReviewTextChange}
            aria-invalid={!!reviewError}
            aria-describedby={reviewError ? reviewErrorId : undefined}
            required // Basic HTML5 validation
          ></textarea>
          {reviewError && <p id={reviewErrorId} className="text-red-500 text-xs mt-1" aria-live="polite">{reviewError}</p>}
        </div>
        <button
          type="submit"
          className="w-full px-4 py-3 bg-emerald-600 dark:bg-emerald-500 text-white font-semibold rounded-full shadow-md hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors duration-300"
        >
          ส่งรีวิว
        </button>
      </form>
      {/* MessageModal for general messages can be re-added if parent needs to show success/failure after submission
      <MessageModal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        message={message}
        type={messageType}
      />
      */}
    </Modal>
  );
};

export default AddReviewModal;
