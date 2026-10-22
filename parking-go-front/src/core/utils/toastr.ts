import 'toastr/build/toastr.min.css';
import '../../assets/css/toastr-custom.css';

type ToastType = 'success' | 'error' | 'info' | 'warning';

const DEFAULT_TIMEOUT = 4500;

function createToast(type: ToastType, message: string, title?: string, timeoutMs: number = DEFAULT_TIMEOUT): void {
  if (typeof document === 'undefined') return;

  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-top-right';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('aria-live', 'polite');
  toast.style.opacity = '0';
  toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  toast.style.transform = 'translateY(-8px)';
  toast.style.cursor = 'pointer';

  // Botón de cierre
  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'toast-close-button';
  closeBtn.innerHTML = '&times;';
  closeBtn.setAttribute('aria-label', 'Cerrar');

  const removeToast = () => {
    if (!toast.parentElement) return;
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-8px)';
    setTimeout(() => {
      toast.remove();
      const currentContainer = document.getElementById('toast-container');
      if (currentContainer && currentContainer.childElementCount === 0) {
        currentContainer.remove();
      }
    }, 300);
  };

  closeBtn.onclick = (e: MouseEvent) => {
    e.stopPropagation();
    removeToast();
  };
  toast.appendChild(closeBtn);

  // Título si fue proporcionado
  if (title) {
    const titleEl = document.createElement('div');
    titleEl.className = 'toast-title';
    titleEl.textContent = title;
    toast.appendChild(titleEl);
  }

  // Mensaje
  const messageEl = document.createElement('div');
  messageEl.className = 'toast-message';
  messageEl.textContent = message;
  toast.appendChild(messageEl);

  // Barra de progreso
  const progressBar = document.createElement('div');
  progressBar.className = 'toast-progress';
  progressBar.style.width = '100%';
  progressBar.style.transition = `width ${timeoutMs}ms linear`;
  toast.appendChild(progressBar);

  // Cierre al hacer clic sobre el toast
  toast.onclick = () => {
    removeToast();
  };

  // Insertar en la parte superior del contenedor
  container.prepend(toast);

  // Animación de entrada y consumo de barra de progreso
  requestAnimationFrame(() => {
    toast.style.opacity = '0.98';
    toast.style.transform = 'translateY(0)';
    requestAnimationFrame(() => {
      progressBar.style.width = '0%';
    });
  });

  // Temporizador de auto-eliminación
  const autoDismissTimer = setTimeout(() => {
    removeToast();
  }, timeoutMs);

  // Cancelar temporizador si ya se cerró
  toast.addEventListener('click', () => {
    clearTimeout(autoDismissTimer);
  });
}

export const showToast = {
  success: (message: string, title?: string) => createToast('success', message, title),
  error: (message: string, title?: string) => createToast('error', message, title),
  info: (message: string, title?: string) => createToast('info', message, title),
  warning: (message: string, title?: string) => createToast('warning', message, title),
};

export const toastr = {
  success: showToast.success,
  error: showToast.error,
  info: showToast.info,
  warning: showToast.warning,
  clear: () => {
    if (typeof document !== 'undefined') {
      const container = document.getElementById('toast-container');
      if (container) container.remove();
    }
  },
  options: {} as Record<string, unknown>,
};

export default toastr;
