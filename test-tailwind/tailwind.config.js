/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Colors
    'bg-indigo-500', 'bg-indigo-600', 'bg-indigo-700',
    'bg-purple-500', 'bg-purple-600', 'bg-purple-700',
    'bg-green-400', 'bg-green-50', 'bg-green-100', 'bg-green-800',
    'bg-gray-50', 'bg-gray-100', 'bg-gray-200', 'bg-gray-600', 'bg-gray-700', 'bg-gray-800',
    'text-white', 'text-gray-600', 'text-gray-700', 'text-gray-800',
    'text-indigo-800', 'text-green-800',
    'border-gray-200', 'border-indigo-300', 'border-green-400',
    // Spacing
    'p-5', 'p-6', 'px-3', 'px-4', 'px-6', 'py-1', 'py-2', 'py-3',
    'mb-3', 'mb-4', 'mb-8', 'mt-8', 'pt-4',
    'gap-3', 'gap-4', 'gap-5',
    // Sizing
    'max-w-6xl', 'w-full', 'h-1',
    // Layout
    'mx-auto', 'flex', 'grid', 'items-center', 'justify-between',
    'grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3', 'xl:grid-cols-4',
    // Typography
    'text-sm', 'text-lg', 'text-xl', 'text-2xl', 'font-medium', 'font-semibold', 'font-mono',
    'truncate',
    // Effects
    'rounded-xl', 'rounded-lg', 'rounded-full', 'shadow-lg',
    'hover:shadow-lg', 'hover:-translate-y-1', 'hover:bg-gray-200', 'hover:bg-indigo-700', 'hover:bg-opacity-30',
    'hover:border-indigo-300', 'hover:scale-x-100',
    'transition-all', 'duration-200', 'duration-300', 'transition-transform',
    'overflow-hidden', 'relative', 'absolute', 'top-0', 'left-0', 'right-0',
    'border-2', 'border-t',
    // Gradients
    'bg-gradient-to-r', 'from-indigo-500', 'to-purple-600',
    // States
    'disabled:opacity-60', 'disabled:cursor-not-allowed',
    'cursor-pointer',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
