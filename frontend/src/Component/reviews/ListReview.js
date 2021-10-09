import React, { Fragment } from 'react';
const ListReview = ({ reviews }) => {
  return (
    <Fragment>
      <div className="reviews w-75">
        <h3>Customer reviews:</h3>
        {reviews.map((review) => (
          <Fragment key={review._id}>
            <hr />
            <div className="review-card my-3">
              <div className="rating-outer">
                <div className="rating-inner" style={{ width: `${(review.rating / 5) * 100}%` }}></div>
              </div>
              <p className="review_user">by {review.user.name.split(' ')[0]}</p>
              {/* <p className="review_user">by {review.user}</p> */}
              <p className="review_comment">{review.comment}</p>
              <hr />
            </div>
          </Fragment>
        ))}
      </div>
    </Fragment>
  );
};
export default ListReview;
