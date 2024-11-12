import { CheckIcon } from '@heroicons/react/20/solid'
import React from 'react'

const includedFeaturesBase: string[] = [
    'Full',
    'Digitalized maintenance log creation',
    'Uploaded document saving',
    'OCR capabilities',
]

const includedFeaturesStandard: string[] = [
    'Base access',
    'Advanced AI powered scanning',
    'Document segmentation',
    'Maintenance notifications'
]

const includedFeaturesPremium: string[] = [
    'Standard access',
    'AI powered recommendations',
    'Dedicated support line',
    '10 free human-scanned documents per month'
]

export default function Pricing() {
    return (
        <div className="bg-white py-12 sm:py-24">
            <div className="mx-auto max-w-4xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl sm:text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">BoundlessFlight Pricing</h2>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        What Choice is Best For You?
                    </p>
                </div>
                <div className={"flex flex-row gap-5"}>
                    <div
                        className="w-80 mx-auto mt-12 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
                        <div className="p-8 sm:p-10 lg:flex-auto flex flex-col">
                            <h3 className="text-2xl font-bold tracking-tight text-gray-900 my-auto">Free</h3>
                            <p className="mt-6 text-base leading-7 text-gray-600 mb-auto">
                                Diverse array of functions for keeping a digitalized aircraft maintenance log
                            </p>
                            <div className="mt-10 flex items-center gap-x-4">
                                <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">What’s
                                    included</h4>
                                <div className="h-px flex-auto bg-gray-100"/>
                            </div>
                            <ul
                                role="list"
                                className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6 my-auto"
                            >
                                {includedFeaturesBase.map((feature) => (
                                    <li key={feature} className="flex gap-x-3">
                                        <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true"/>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <a
                                href="#"
                                className="my-auto mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Get access
                            </a>
                        </div>
                    </div>
                    <div
                        className="w-80 mx-auto mt-12 max-w-2xl rounded-3xl ring-1 ring-blue-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
                        <div className="p-8 sm:p-10 lg:flex-auto flex flex-col">
                            <h3 className="text-2xl font-bold tracking-tight text-gray-900 my-auto">Standard</h3>
                            <p className="mt-6 text-base leading-7 text-gray-600 mb-auto">
                                AI powered document scanning and notifcations on maintenance intervals
                            </p>
                            <div className="mt-10 flex items-center gap-x-4">
                                <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">What’s
                                    included</h4>
                                <div className="h-px flex-auto bg-gray-100"/>
                            </div>
                            <ul
                                role="list"
                                className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6 my-auto"
                            >
                                {includedFeaturesStandard.map((feature) => (
                                    <li key={feature} className="flex gap-x-3">
                                        <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true"/>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <a
                                href="#"
                                className="my-auto mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Get access
                            </a>
                        </div>
                    </div>
                    <div
                        className="w-80 mx-auto mt-12 max-w-2xl rounded-3xl ring-1 ring-blue-400 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
                        <div className="p-8 sm:p-10 lg:flex-auto flex flex-col">
                            <h3 className="text-2xl font-bold tracking-tight text-gray-900 my-auto">Premium</h3>
                            <p className="mt-6 text-base leading-7 text-gray-600 mb-auto">
                                The complete package. AI powered workflow and a dedicated support line. Additional 10 human-parsed documents per month.
                            </p>
                            <div className="mt-10 flex items-center gap-x-4">
                                <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">What’s
                                    included</h4>
                                <div className="h-px flex-auto bg-gray-100"/>
                            </div>
                            <ul
                                role="list"
                                className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6 my-auto"
                            >
                                {includedFeaturesPremium.map((feature) => (
                                    <li key={feature} className="flex gap-x-3">
                                        <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true"/>
                                        {feature}
                                    </li>
                                ))}sy
                            </ul>
                            <a
                                href="#"
                                className="my-auto mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Get access
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
