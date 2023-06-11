import { useState } from 'react';
import Btn from './Btn';
import axios from 'axios';

import { updateStart, updateFailure, updatePhoto } from '../features/userSlice';
import { useDispatch } from 'react-redux';

import { GrFormUpload } from 'react-icons/gr';
import { MdDeleteForever } from 'react-icons/md';

const ManagePhoto = ({ setSuccess, setFailure, setIsPhotoUpdated }) => {
	const dispatch = useDispatch();

	const [image, setImage] = useState(null);
	const [fileName, setFileName] = useState('No selected file');
	const [file, setFile] = useState('');

	const handleFilesChange = ({ target: { files } }) => {
		// if the file exists get the file name
		files[0] && setFileName(files[0].name);

		if (files) {
			// saving file to create a FormData
			setFile(files[0]);
			setImage(URL.createObjectURL(files[0]));
		}
	};

	// const refresh = () => window.location.reload(true);

	const updateUserPhoto = async formData => {
		try {
			const { data } = await axios.patch('/api/users/updateProfile', formData, {
				withCredentials: true,
			});

			dispatch(updatePhoto(data.data.user.photo));

			setSuccess(true);
			setTimeout(() => setSuccess(false), 3000);

			// refetch user photo
			setIsPhotoUpdated(true);
		} catch (error) {
			dispatch(updateFailure());
			setFailure(true);
			setTimeout(() => setFailure(false), 3000);
		}
	};

	const handleDelete = () => {
		setFileName('No Selected File');
		setImage(null);
	};

	const handleSubmit = e => {
		e.preventDefault();

		const formData = new FormData();
		formData.append('photo', file);

		dispatch(updateStart());
		updateUserPhoto(formData);
	};

	return (
		<form className='upload-form' onSubmit={handleSubmit}>
			<div
				className='upload-form__main'
				onClick={() => document.getElementById('input-file').click()}>
				<input
					type='file'
					accept='image/*'
					id='input-file'
					onChange={handleFilesChange}
					hidden
				/>

				{image ? (
					<div className='upload-form__box-photo'>
						<img src={image} className='upload-form__photo' alt={fileName} />
					</div>
				) : (
					<p className='upload-form__label'>
						<GrFormUpload className='upload-form__upload-icon' />
						<span>Browse Files to Upload</span>
					</p>
				)}
			</div>

			<div className='upload-form__feedback' onClick={handleDelete}>
				{fileName}
				<MdDeleteForever />
			</div>

			<p className='form__group form__group--mt u-align-start'>
				<Btn type='Submit' utility='width-full'>
					Save
				</Btn>
			</p>
		</form>
	);
};

export default ManagePhoto;
