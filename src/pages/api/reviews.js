try {
  // Validate the review data structure (newReview)
  if (!newReview || !newReview.rating || !newReview.comment) {
    throw new Error('Invalid review data');
  }

  // Add review to Firestore
  await db.collection('products').doc(productId).collection('reviews').add(newReview);

  // Return success response to the user
  return res.status(201).json({ message: 'Review added successfully' });
} catch (error) {
  // Log the error for debugging purposes
  console.error('Error adding review:', error);

  // Return error response to the user
  return res.status(500).json({ error: 'Failed to add review' });
}