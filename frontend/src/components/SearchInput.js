import React from 'react';

const SearchInput = ({ search, setSearch }) => {
	const handleSubmit = e => {
		e.preventDefault();
	};
	return (
		<form className='search-input' onSubmit={handleSubmit}>
			<label htmlFor='search'>Search book</label>
			<input
				type='text'
				name='search'
				id='searcg'
				className='search-input__input'
				onChange={e => setSearch(e.target.value)}
			/>
		</form>
	);
};

export default SearchInput;
