import React from 'react';
import {useState} from 'react';

function CreateEvents() {

    const [formData, setFormData] = useState();

    const onSubmit = () => {

    }
    return (<>
            <div>
                <h4>Hello Stanky</h4>
            </div>

            <div>
                <form onSubmit={onSubmit} className='max-w-sm mx-auto'>
                    <div className='mb-5'>


                        <label>Title
                            <input name='event-title'
                                   className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'/>
                        </label>
                        <label>Description
                            <input name='event-description'
                                   className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'/>
                        </label>

                        <label>Start Date
                            <input
                                type='date'
                                name='event-start-date'
                                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'/>
                        </label>
                        <label>End Date
                            <input
                                type='date'
                                name='event-end-date'
                                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'/>
                        </label>

                        <label>Start Time
                            <input
                                type='time'
                                name='event-start-time'
                                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'/>
                        </label>

                        <label>End Time
                            <input
                                type='time'
                                name='event-end-time'
                                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'/>
                        </label>

                        <label>Event Category
                            <input name='event-category'
                                   className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'/>
                        </label>

                        <label>Venue
                            <input name='event-venue'
                                   className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'/>
                        </label>

                        <label>Event Interests?
                            Interest 1
                            <input type='checkbox' value='Interest 1' name='event-interests'
                                   className='block mb-2 text-sm font-medium text-gray-900 dark:text-blue-950'/>
                            Interest 2
                            <input type='checkbox' value='Interest 2' name='event-interests'
                                   className='block mb-2 text-sm font-medium text-gray-900 dark:text-blue-950'/>
                            Interest 3
                            <input type='checkbox' value='Interest 3' name='event-interests'
                                   className='block mb-2 text-sm font-medium text-gray-900 dark:text-blue-950'/>
                            Interest 4
                            <input type='checkbox' value='Interest 4 ERROR' name='event-interests'
                                   className='block mb-2 text-sm font-medium text-gray-900 dark:text-blue-950'/>
                        </label>


                    </div>


                    <button type='submit'
                            className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>Submit
                    </button>
                </form>
            </div>


        </>
    )
};

export default CreateEvents;
