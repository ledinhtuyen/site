"use client";

import React from "react";

const Note = React.forwardRef(({ className, children, ...props } : any, ref) => {
  return (
    <div
      className="bg-blue-50 border-l-4 border-blue-300 text-blue-800 p-4 rounded-md shadow-md"
      ref={ref}
      {...props}
    >
      <div className="flex items-start">
        <svg
          className="w-5 h-5 mr-2 flex-shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-9-4a1 1 0 00-.894.553L6.382 9H4a1 1 0 100 2h2a1 1 0 00.894-.553L9.618 7H12a1 1 0 100-2H9zm3.618 6H12a1 1 0 100-2h-.618l-.894-.553A1 1 0 0010.618 9H10a1 1 0 000 2h.618l.894.553A1 1 0 0012.618 13z"
            clipRule="evenodd"
          />
        </svg>
        <p>
          {children}
        </p>
      </div>
    </div>
  );
});
Note.displayName = "Note";

export { Note };
