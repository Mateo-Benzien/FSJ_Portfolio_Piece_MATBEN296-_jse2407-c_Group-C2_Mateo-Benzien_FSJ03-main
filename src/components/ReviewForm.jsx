import { useState } from 'react';

const ReviewForm = ({ productId, onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!comment.trim()) {
      setError('Comment is required');
      return;
    }

    try {
      const response = await fetch('/api/reviews/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Adjust according to your auth setup
        },
        body: JSON.stringify({ rating, comment, productId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add review');
      }

      const newReview = {
        id: Date.now().toString(), // Temporary ID for local state
        rating,
        comment,
        date: new Date().toISOString(),
        reviewerEmail: 'you@example.com', // Replace with actual data
        reviewerName: 'Your Name', // Replace with actual data
      };

      onReviewAdded(newReview);
      setRating(5);
      setComment('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add a Review</h3>
      <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
        {[5, 4, 3, 2, 1].map((star) => (
          <option key={star} value={star}>{star} Star{star > 1 ? 's' : ''}</option>
        ))}
      </select>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your review here"
        required
      />
      <button type="submit">Submit Review</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default ReviewForm;
