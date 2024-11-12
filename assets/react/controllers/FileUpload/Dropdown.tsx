import react from 'react'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import React from 'react'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Dropdown(props: {guikey: string, onViewOCR?, onReplace, onDelete, onInsertFront, onInsertBehind}) {
    const handleClick = (e, action) => {
        e.stopPropagation();
        action(props.guikey);
    };
    return (
        <Menu as="div" className="relative inline-block text-left cursor-pointer">
            <div>
                <Menu.Button
                    className="inline-flex w-full justify-center rounded-full bg-gray-200 p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                         stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"/>
                    </svg>
                </Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={() => (props.onViewOCR(props.guikey))}
                                    className={classNames(
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                        'block px-4 py-2 text-sm w-full text-left'
                                    )}
                                >
                                    View OCR
                                </button>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <button onClick={() => ((e) => handleClick(e, props.onDelete))}
                                    className={classNames(
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                        'block px-4 py-2 text-sm w-full text-left'
                                    )}
                                >
                                    View Log
                                </button>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={() => ((e) => handleClick(e, props.onReplace))}
                                    className={classNames(
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                        'block px-4 py-2 text-sm w-full text-left'
                                    )}
                                >
                                    Replace
                                </button>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={() => ((e) => handleClick(e, props.onInsertFront))}
                                    className={classNames(
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                        'block px-4 py-2 text-sm w-full text-left'
                                    )}
                                >
                                    Insert Ahead
                                </button>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={() => ((e) => handleClick(e, props.onInsertBehind))}
                                    className={classNames(
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                        'block px-4 py-2 text-sm w-full text-left'
                                    )}
                                >
                                    Insert Behind
                                </button>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={() => ((e) => handleClick(e, props.onDelete))}
                                    className={classNames(
                                        active ? 'bg-gray-100 text-red-500' : 'text-red-600',
                                        'block px-4 py-2 text-sm w-full text-left'
                                    )}
                                >
                                    Delete
                                </button>
                            )}
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}