import React from "react";

const Wrapper = ({ children }) => {
    return (
        <div
            className={`w-full max-w-[1250px] overflow-hidden px-5 max-md:pl-2 max-md:pr-3  mx-auto   dark:text-gray-50  rounded-2xl `}
        >
            {children}
        </div>
    );
};

export default Wrapper;
