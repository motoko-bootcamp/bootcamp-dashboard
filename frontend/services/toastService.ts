import _toast from 'react-hot-toast';
import colors from '../constants/colors';

export enum ToastType {
  Plain,
  Success,
  Error,
  Loading,
}

export const toastError = (err: any, preText: string = ''): void => {
  const frostedGlassStyle = {
    backdropFilter: 'blur(5px)',
    backgroundColor: 'rgba(245, 87, 22, 0.1)', // Tinted orange for error
    borderRadius: '5px',
    boxShadow: `0 2px 4px ${colors.shadowColor}`,
  };

  if (err.message) {
    _toast.error(preText + err.message, {
      style: {
        ...frostedGlassStyle,
        color: colors.textColor,
      },
      duration: 10000,
    });
  } else {
    _toast.error(preText + err, {
      style: {
        ...frostedGlassStyle,
        color: colors.textColor,
      },
      duration: 10000,
    });
  }
};
export const toastPromise = (
  promise: Promise<any>,
  messages: {
    loading: string;
    success: string;
    error: string;
  },
  toastType: ToastType
): void => {
  const frostedGlassStyle = {
    backdropFilter: 'blur(5px)',
    borderRadius: '5px',
    boxShadow: `0 2px 4px ${colors.shadowColor}`,
  };

  const successStyle = {
    ...frostedGlassStyle,
    backgroundColor: 'rgba(67, 138, 196, 0.1)', // Tinted blue for success
    color: colors.textColor,
  };

  const errorStyle = {
    ...frostedGlassStyle,
    backgroundColor: 'rgba(245, 87, 22, 0.1)', // Tinted orange for error
    color: colors.textColor,
  };

  const plainStyle = {
    ...frostedGlassStyle,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Default tint
    color: colors.textColor,
  };

  const loadingToast = _toast.loading(messages.loading, {
    style: plainStyle,
  }) ;

  promise
    .then((result) => {
      _toast.dismiss(loadingToast);
      if (result.hasOwnProperty("ok")) { // Check if the 'ok' property exists in the result
        _toast.success(messages.success, {
          style: successStyle,
          duration: toastType === ToastType.Success || toastType === ToastType.Error ? 10000 : 8000,
        });
      } else {
        _toast.error(messages.error, {
          style: errorStyle,
          duration: toastType === ToastType.Success || toastType === ToastType.Error ? 10000 : 8000,
        });
      }
    })
    .catch((error) => {
      _toast.dismiss(loadingToast);
      _toast.error(messages.error, {
        style: errorStyle,
        duration: toastType === ToastType.Success || toastType === ToastType.Error ? 10000 : 8000,
      });
    });
};


export const toast = (message: string, toastType: ToastType): void => {
  const frostedGlassStyle = {
    backdropFilter: 'blur(5px)',
    borderRadius: '5px',
    boxShadow: `0 2px 4px ${colors.shadowColor}`,
  };

  

  switch (toastType) {

     
    case ToastType.Success:
      _toast.success(message, {
        style: {
          ...frostedGlassStyle,
          backgroundColor: 'rgba(67, 138, 196, 0.1)', // Tinted blue for success
          color: colors.textColor,
        },
        duration: 10000,
      });
      break;
    case ToastType.Error:
      _toast.error(message, {
        style: {
          ...frostedGlassStyle,
          backgroundColor: 'rgba(245, 87, 22, 0.1)', // Tinted orange for error
          color: colors.textColor,
        
        },
        duration: 10000,
      });
      break;
    default:
      _toast(message, {
        style: {
          ...frostedGlassStyle,
          backgroundColor: 'rgba(255, 255, 255, 0.1)', // Default tint
          color: colors.textColor,
        },
        duration: 8000,
      });
      break;
  }
};
