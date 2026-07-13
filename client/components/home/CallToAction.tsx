"use client";

import { RootState } from '@/lib/redux/store';
import { useSelector } from 'react-redux';

const CallToAction = () => {
    const { user }: { user: any } = useSelector((state: RootState) => state.authReducer,);

    return (
        <div
            id="cta"
            className="border-y border-dashed border-slate-200 w-full max-w-5xl mx-auto px-10 sm:px-16 mt-28"
        >
            <div className="flex flex-col md:flex-row text-center md:text-left items-center justify-between gap-8 px-3 md:px-10 border-x border-dashed border-slate-200 py-16 sm:py-20 -mt-10 -mb-10 w-full">

                <div>
                    <h2 className="text-2xl font-semibold text-slate-800">
                        Have questions?
                    </h2>

                    <p className="mt-3 max-w-md text-slate-600">
                        We'd love to hear from you. Reach out anytime and we'll get back to you as soon as possible.
                    </p>
                </div>

                <a
                    href="mailto:contact@nextume.com?subject=Nextume%20Inquiry"
                    className="flex items-center gap-2 rounded-lg bg-violet-600 hover:bg-violet-700 transition text-white px-8 py-3 font-medium"
                >
                    <span>Contact Us</span>

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="size-4.5"
                    >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                    </svg>
                </a>

            </div>
        </div>
    )
}

export default CallToAction