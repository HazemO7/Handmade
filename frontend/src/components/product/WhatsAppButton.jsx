import React, { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { settingsApi } from '../../services/api';
import { generateWhatsAppUrl } from '../../utils/whatsapp';

let cachedSettings = null;

const WhatsAppButton = ({
  product,
  phone = null,
  className = '',
  size = 'lg',
  disabled = false,
  text = 'Order via WhatsApp',
}) => {
  const [storePhone, setStorePhone] = useState(phone || cachedSettings?.whatsappNumber || '');
  const [isLoading, setIsLoading] = useState(!phone && !cachedSettings);

  useEffect(() => {
    if (phone) {
      setStorePhone(phone);
      setIsLoading(false);
      return;
    }

    if (cachedSettings) {
      setStorePhone(cachedSettings.whatsappNumber || '');
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    settingsApi
      .getSettings()
      .then((res) => {
        if (isMounted && res.data) {
          cachedSettings = res.data;
          setStorePhone(res.data.whatsappNumber || '');
        }
      })
      .catch((err) => {
        console.warn('Failed to load store settings for WhatsApp button:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [phone]);

  const activePhone = phone || storePhone || import.meta.env.VITE_WHATSAPP_NUMBER || '';
  const url = product ? generateWhatsAppUrl({ phone: activePhone, product }) : '#';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base',
  };

  const isOutOfStock = product?.stock === 0 || disabled;

  if (isOutOfStock) {
    return (
      <button
        disabled
        className={`w-full inline-flex items-center justify-center font-medium rounded-lg opacity-50 cursor-not-allowed bg-warm-200 text-warm-500 shadow-none ${sizeClasses[size] || sizeClasses.lg} ${className}`}
      >
        <FaWhatsapp className="w-5 h-5 mr-2" />
        {product?.stock === 0 ? 'Out of Stock' : text}
      </button>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-full inline-flex items-center justify-center font-medium rounded-lg text-white bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.99] shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366] ${sizeClasses[size] || sizeClasses.lg} ${className}`}
      title="Contact on WhatsApp to order"
    >
      <FaWhatsapp className="w-5 h-5 mr-2.5 flex-shrink-0" />
      <span>{text}</span>
    </a>
  );
};

export default WhatsAppButton;
