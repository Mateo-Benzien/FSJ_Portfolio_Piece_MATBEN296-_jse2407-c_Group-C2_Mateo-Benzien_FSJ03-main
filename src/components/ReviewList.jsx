import { useState } from 'react';

const ReviewList = ({ reviews, onReviewUpdate, onReviewDelete }) => {
  const [confirmationMessage, setConfirmationMessage] = useState(null);
  const [deletionMessage, setDeletionMessage] = useState(null);
  const [reviewList, setReviewList] = useState(reviews); // New state variable to store the review list

  const handleReviewUpdate = async (reviewId, updatedReview) => {
    try {
      // Call the API to update the review
      const response = await fetch(`/api/reviews/edit/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedReview),
      });

      if (response.ok) {
        // Update the review in the component's state
        const updatedReviews = reviewList.map((review) => {
          if (review.id === reviewId) {
            return updatedReview;
          }
          return review;
        });
        setReviewList(updatedReviews);
        // Display the confirmation message
        setConfirmationMessage('Review updated successfully!');
        // Hide the confirmation message after 2 seconds
        setTimeout(() => setConfirmationMessage(null), 2000);
      } else {
        throw new Error('Failed to update review');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleReviewDelete = async (reviewId) => {
    try {
      // Call the API to delete the review
      const response = await fetch(`/api/reviews/delete/${reviewId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the deleted review from the component's state
        const updatedReviews = reviewList.filter((review) => review.id !== reviewId);
        setReviewList(updatedReviews);
        // Display the deletion confirmation message
        setDeletionMessage('Review deleted successfully!');
        // Hide the deletion confirmation message after 2 seconds
        setTimeout(() => setDeletionMessage(null), 2000);
      } else {
        throw new Error('Failed to delete review');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {reviewList.length > 0 ? (
        reviewList.map((review) => (
          <div key={review.id || review._id} className="review">
            <p>
              <strong>{review.reviewerName}</strong> ({new Date(review.date).toLocaleDateString()})
            </p>
            <p>Rating: {review.rating}/5</p>
            <p>{review.comment}</p>
            <button onClick={() => handleReviewUpdate(review.id || review._id, { ...review, comment: 'Updated comment' })}>
              Update Review
            </button>
            <button onClick={() => handleReviewDelete(review.id || review._id)}>
              Delete Review
            </button>
          </div>
        ))
      ) : (
        <p>No reviews yet</p>
      )}
      {confirmationMessage && <p style={{ color: 'green' }}>{confirmationMessage}</p>}
      {deletionMessage && <p style={{ color: 'green' }}>{deletionMessage}</p>}
      <style jsx>{`
        .review {
          border-top: 1px solid #e1e1e1;
          padding-top: 10px;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default ReviewList;