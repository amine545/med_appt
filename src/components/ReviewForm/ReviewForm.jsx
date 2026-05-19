import { useState } from 'react';
import './ReviewForm.css';

const INITIAL_ROWS = [
  { id: 1, doctorName: 'Dr. John Doe', speciality: 'Cardiology', review: null },
  { id: 2, doctorName: 'Dr. Jane Smith', speciality: 'Dermatology', review: null },
];

const ReviewForm = () => {
  const [rows, setRows] = useState(INITIAL_ROWS);
  const [activeRowId, setActiveRowId] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    review: '',
    rating: 0,
  });

  const activeDoctor = rows.find((row) => row.id === activeRowId);

  const handleReviewClick = (id) => {
    setActiveRowId(id);
    setShowWarning(false);
    setFormData({
      name: '',
      review: '',
      rating: 0,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRating = (rating) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid =
      formData.name.trim() &&
      formData.review.trim() &&
      Number(formData.rating) > 0;
    if (!isValid) {
      setShowWarning(true);
      return;
    }
    setRows((prev) =>
      prev.map((row) =>
        row.id === activeRowId
          ? {
              ...row,
              review: {
                name: formData.name.trim(),
                message: formData.review.trim(),
                rating: Number(formData.rating),
              },
            }
          : row
      )
    );
    setActiveRowId(null);
    setShowWarning(false);
  };

  return (
    <div className="reviews-page">
      <header className="reviews-page__header">
        <h1>Reviews</h1>
        <p className="reviews-page__lede">
          Share feedback on your visit—ratings help others find the right care.
        </p>
      </header>
      <div className="reviews-table-wrap">
        <table className="reviews-table">
          <thead>
            <tr>
              <th>Serial Number</th>
              <th>Doctor Name</th>
              <th>Doctor Speciality</th>
              <th>Provide feedback</th>
              <th>Review Given</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.doctorName}</td>
                <td>{row.speciality}</td>
                <td>
                  <button
                    type="button"
                    className="review-btn"
                    onClick={() => handleReviewClick(row.id)}
                    disabled={Boolean(row.review)}
                  >
                    {row.review ? 'Submitted' : 'Click Here'}
                  </button>
                </td>
                <td>
                  {row.review ? (
                    <div className="review-given">
                      <div className="review-given__name">{row.review.name}</div>
                      <div className="review-given__message">{row.review.message}</div>
                      <div className="review-stars">
                        {'★'.repeat(row.review.rating)}
                        {'☆'.repeat(5 - row.review.rating)}
                      </div>
                    </div>
                  ) : (
                    ''
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {activeDoctor ? (
        <form className="review-form-card" onSubmit={handleSubmit}>
          <h2>Give Your Review</h2>
          <p className="review-form-doctor">
            {activeDoctor.doctorName} - {activeDoctor.speciality}
          </p>
          {showWarning ? (
            <p className="review-warning">Please fill all fields and choose rating.</p>
          ) : null}
          <label htmlFor="reviewer-name">Name:</label>
          <input
            id="reviewer-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            type="text"
          />
          <label htmlFor="review-message">Review:</label>
          <textarea
            id="review-message"
            name="review"
            value={formData.review}
            onChange={handleChange}
            rows={4}
          />
          <label>Rating:</label>
          <div className="rating-selector">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                className={`star-btn ${star <= formData.rating ? 'active' : ''}`}
                onClick={() => handleRating(star)}
                aria-label={`Rate ${star}`}
              >
                ★
              </button>
            ))}
          </div>
          <button type="submit" className="review-submit-btn">
            Submit
          </button>
        </form>
      ) : null}
    </div>
  );
};

export default ReviewForm;
