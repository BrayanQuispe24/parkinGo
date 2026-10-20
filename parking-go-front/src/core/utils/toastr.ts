import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import '../../assets/css/toastr-custom.css';

// Configuración global predeterminada de Toastr para ParkinGo
toastr.options = {
  closeButton: true,
  debug: false,
  newestOnTop: true,
  progressBar: true,
  positionClass: 'toast-top-right',
  preventDuplicates: true,
  showDuration: 300,
  hideDuration: 800,
  timeOut: 4500,
  extendedTimeOut: 1500,
  showEasing: 'swing',
  hideEasing: 'linear',
  showMethod: 'fadeIn',
  hideMethod: 'fadeOut',
};

export const showToast = {
  success: (message: string, title?: string) => toastr.success(message, title),
  error: (message: string, title?: string) => toastr.error(message, title),
  info: (message: string, title?: string) => toastr.info(message, title),
  warning: (message: string, title?: string) => toastr.warning(message, title),
};

export default toastr;
