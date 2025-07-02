// components/AddReviewModal.js
import React, { useState } from 'react';
import Modal from './Modal';
import MessageModal from './MessageModal';
import { Star } from 'lucide-react';

const AddReviewModal = ({ isOpen, onClose, onSubmitReview }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [showMessageModal, setShowMessageModal] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) {
      setMessage("กรุณาให้คะแนนสถานที่");
      setMessageType("error");
      setShowMessageModal(true);
      return;
    }
    if (reviewText.trim() === '') {
      setMessage("กรุณาเขียนรีวิว");
      setMessageType("error");
      setShowMessageModal(true);
      return;
    }
    onSubmitReview(rating, reviewText);
    // Message will be shown by parent component after submission
    onClose(); // Close the review modal
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="เพิ่มรีวิวและให้คะแนน">
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-slate-200 text-sm font-bold mb-2">คะแนน:</label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={32}
                  className={`cursor-pointer ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-slate-600'}`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="reviewText" className="block text-gray-700 dark:text-slate-200 text-sm font-bold mb-2">รีวิวของคุณ:</label>
            <textarea
              id="reviewText"
              className="shadow appearance-none border dark:border-slate-600 rounded-lg w-full py-2 px-3 text-gray-700 dark:text-slate-200 dark:bg-slate-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 dark:focus:border-blue-500 resize-none h-32 transition-colors duration-300"
              placeholder="เขียนรีวิวเกี่ยวกับสถานที่นี้..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            ></textarea>
          </div>
          <button
            onClick={handleSubmit}
            className="w-full px-4 py-3 bg-emerald-600 dark:bg-emerald-500 text-white font-semibold rounded-full shadow-md hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors duration-300"
          >
            ส่งรีวิว
          </button>
        </div>
      </Modal>
      <MessageModal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        message={message}
        type={messageType}
      />
    </>
  );
};

export default AddReviewModal;
