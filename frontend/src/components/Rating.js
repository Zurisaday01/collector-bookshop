import StarsRating from 'react-star-rate';

const Rating = ({ ratingsAverage }) => {
	return <StarsRating value={ratingsAverage} disabled={true} />;
};

export default Rating;
