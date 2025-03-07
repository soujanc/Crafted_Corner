export default function Button({
  text,
  icon,
  variant = "filledWhite",
  size = "default",
  className = "",
  href = "#_",
  display = "flex",
  disabled = false,
  onClick,
  loading = false,
  loadingwithText = false,
  fullWidth = false,
  loadingText,
}) {
  // Base styles always applied
  const disabledStyles = disabled
    ? "opacity-50 cursor-not-allowed pointer-events-none"
    : "";
  const baseStyles = `
     transition-all duration-500 ease-in-out
    whitespace-nowrap flex-shrink-0 min-w-[100px]
    font-poppins font-[300]  tracking-[0.5px]
    lg:flex w-fit items-center justify-center
    rounded-full focus:outline-none 
    ${
      fullWidth
        ? "w-full"
        : `
      min-w-[100px] 
      w-[120px] 
      sm:w-[130px] 
      md:w-[140px] 
      lg:w-[150px] 
      xl:w-[160px]
    `
    }
  `;
  const hiddenStyles = {
    hidden: "hidden lg:flex",
    flex: "flex",
  };
  // Size variations
  const sizes = {
    small: "text-[8px] px-[10px] py-[6px]",
    default: "text-[10px] px-[20px] py-[8px] tracking-wider",
    compact:
      "text-[10px] md:text-[10px] lg:text-[10px] xl:text-[10px] " +
      "px-[22px] md:px-[24px] lg:px-[25px] xl:px-[26px] " +
      "py-[6px] md:py-[7px] lg:py-[7px] xl:py-[7px]",
    large: "text-[12px] px-[40px] py-[10px]",
    variable:
      "text-[8px] sm:text-[9px] md:text-[10px] lg:text-[11px] xl:text-[12px] px-[20px] sm:px-[25px] md:px-[28px] lg:px-[20px] py-[8px] tracking-wider ",
    product: "text-[10px] lg:text-[11px] xl:text-[12px] px-[30px] py-[10px]",
    fixed: "text-[12px] px-3 py-2 font-normal",
  };

  // Style variants
  const variants = {
    filledWhite: `
      bg-chalkwhite text-[#4d4d4d] 
      border border-transparent
      hover:bg-transparent hover:text-white hover:border-white
    `,
    filledWhiteNoHover: `
      bg-white text-[#4d4d4d] 
      border border-transparent
     
    `,
    filledBlack: `
      bg-deepgray text-white
      border border-transparent
      hover:bg-transparent hover:text-deepgray hover:border-deepgray
    `,
    filledBlackNoHover: `
      bg-deepgray text-white
      border border-transparent
      
    `,
    outlined: `
      bg-transparent text-white 
      border border-white
      hover:bg-chalkwhite hover:text-[#4d4d4d] hover:border-transparent
    `,
    outlinedWhite: `
      bg-transparent text-chalkwhite 
      border border-chalkwhite
      hover:bg-chalkwhite hover:text-[#4d4d4d] hover:border-transparent
    `,
    outlinedBlack: `
      bg-transparent text-deepgray 
      border border-deepgray
      hover:bg-deepgray hover:text-chalkwhite hover:border-transparent
    `,
    outlinedBlackNoHover: `
      bg-transparent text-deepgray 
      border border-deepgray
   
    `,
  };

  return (
    /**
     * Customizable Button Component
     *
     * @param {Object} props - Button component properties
     * @param {string} [props.text] - Text to display on the button
     * @param {string} [props.variant='filledBlack'] - Visual style of the button (e.g., 'filledBlack', 'outlined')
     * @param {string} [props.size='default'] - Size of the button (e.g., 'compact', 'default', 'large')
     * @param {function} [props.onClick] - Click event handler for the button
     * @param {boolean} [props.disabled=false] - Disables the button if true
     * @param {boolean} [props.loading=false] - Shows loading state if true
     * @param {string} [props.className] - Additional CSS classes to apply
     * @param {string} [props.href] - Optional href for link-like buttons
     * @param {string} [props.type='button'] - Button type (e.g., 'button', 'submit')
     * @param {string} [props.display='block'] - Display property of the button
     * @returns {JSX.Element} Rendered button component
     */
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${hiddenStyles[display]} ${disabledStyles} ${className} gap-2`.trim()}
    >
      {loading ? (
        <svg
          aria-hidden="true"
          class="h-3 w-3 animate-spin fill-gray-200 text-gray-100/50 dark:text-gray-600 md:h-4 md:w-4"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      ) : (
        <>
          {icon && icon}
          {loadingwithText ? loadingText : text}
        </>
      )}
    </button>
  );
}
