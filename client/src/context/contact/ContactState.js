import React, { useReducer } from 'react';
import axios from 'axios';
import ContactContext from './contactContext';
import contactReducer from './contactReducer';
import {
	GET_CONTACT,
	ADD_CONTACT,
	DELETE_CONTACT,
	SET_CURRENT,
	CLEAR_CURRENT,
	UPDATE_CONTACT,
	FILTER_CONTACT,
	CLEAR_CONTACT,
	CLEAR_FILTER,
	CONTACT_ERROR,
} from '../types';

const ContactState = (props) => {
	const initialState = {
		contacts: null,
		current: null,
		filtered: null,
		error: null,
	};

	const [state, dispatch] = useReducer(contactReducer, initialState);
	// get Contact
	const getContacts = async () => {
		try {
			console.log('going to get the contacts');
			const res = await axios.get('/api/contacts');
			console.log('Getting the contacts from response', res);
			dispatch({ type: GET_CONTACT, payload: res.data });
			console.log('Here are the contacts', res);
		} catch (err) {
			dispatch({
				type: CONTACT_ERROR,
				payload: err.response.msg,
			});
		}
	};

	//   Add Contact
	const addContact = async (contact) => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		try {
			const res = await axios.post('/api/contacts', contact, config);

			dispatch({ type: ADD_CONTACT, payload: res.data });
		} catch (err) {
			dispatch({
				type: CONTACT_ERROR,
				payload: err.response.msg,
			});
		}
	};

	// Delete Contact
	const deleteContact = async (id) => {
		try {
			await axios.delete(`/api/contacts/${id}`);
			dispatch({ type: DELETE_CONTACT, payload: id });
		} catch (err) {
			dispatch({
				type: CONTACT_ERROR,
				payload: err.response.msg,
			});
		}
	};

	// Update Contact
	const updateContact = async (contact) => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		try {
			const res = await axios.put(
				`/api/contacts/${contact._id}`,
				contact,
				config,
			);
			dispatch({ type: UPDATE_CONTACT, payload: res.data });
		} catch (err) {
			dispatch({
				type: CONTACT_ERROR,
				payload: err.response.msg,
			});
		}
	};

	// clear COntacts
	const clearContacts = () => {
		dispatch({ type: CLEAR_CONTACT });
	};

	// Set Current Contact
	const setCurrent = (contact) => {
		dispatch({ type: SET_CURRENT, payload: contact });
	};

	// Clear Current Contact
	const clearCurrent = () => {
		dispatch({ type: CLEAR_CURRENT });
	};

	// Filter Contacts
	const filterContacts = (text) => {
		dispatch({ type: FILTER_CONTACT, payload: text });
	};

	// Clear Filter
	const clearFilter = () => {
		dispatch({ type: CLEAR_FILTER });
	};

	return (
		<ContactContext.Provider
			value={{
				contacts: state.contacts,
				current: state.current,
				filtered: state.filtered,
				error: state.error,
				addContact,
				updateContact,
				deleteContact,
				setCurrent,
				clearCurrent,
				filterContacts,
				clearFilter,
				getContacts,
				clearContacts,
			}}>
			{props.children}
		</ContactContext.Provider>
	);
};

export default ContactState;
