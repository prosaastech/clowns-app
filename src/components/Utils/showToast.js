import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css'; // Import Toastify CSS

const showToast = ({ type = 'success', message = 'Operation completed successfully.' }) => {
  let backgroundStyle;

  switch (type) {
    case 'success':
      backgroundStyle = "linear-gradient(to right, #28a745, #78c800)"; // Bright green shades
      break;
    case 'error':
      backgroundStyle = "linear-gradient(to right, #dc3545, #ff6347)"; // Red shades for error
      break;
    case 'info':
      backgroundStyle = "linear-gradient(to right, #17a2b8, #5bc0de)"; // Blue tones for info
      break;
    default:
      backgroundStyle = "linear-gradient(to right, #6c757d, #adb5bd)"; // Grey shades for unknown type
  }

  Toastify({
    text: message,
    className: type,
    style: {
      background: backgroundStyle,
    },
  }).showToast();
};

export default showToast;
