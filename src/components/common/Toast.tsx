import React from 'react';
import clsx from 'clsx';
import type { Toast as ToastType } from '../../types';
import {
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { useToastStore } from '../../stores/toastStore';

interface ToastProps {
  toast: ToastType;
}

const icons = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  info: InformationCircleIcon,
  warning: ExclamationTriangleIcon,
};

const colors = {
  success: 'bg-green-50 text-green-800 border-green-200',
  error: 'bg-red-50 text-red-800 border-red-200',
  info: 'bg-blue-50 text-blue-800 border-blue-200',
  warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
};

const iconColors = {
  success: 'text-green-500',
  error: 'text-red-500',
  info: 'text-blue-500',
  warning: 'text-yellow-500',
};

export const Toast: React.FC<ToastProps> = ({ toast }) => {
  const removeToast = useToastStore((state) => state.removeToast);
  const Icon = icons[toast.type];

  return (
    <div
      className={clsx(
        'flex items-start gap-3 p-4 rounded-lg border shadow-lg',
        'animate-in slide-in-from-left duration-300',
        'min-w-[320px] max-w-md',
        colors[toast.type]
      )}
    >
      <Icon className={clsx('w-6 h-6 flex-shrink-0', iconColors[toast.type])} />

      <p className="flex-1 text-sm font-medium">{toast.message}</p>

      <button
        onClick={() => removeToast(toast.id)}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
      >
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
};
