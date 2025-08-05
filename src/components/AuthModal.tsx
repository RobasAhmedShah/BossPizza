import React, { useState } from 'react';
import { X, Phone, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const { sendOTP, login, isLoading } = useAuth();

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    const success = await sendOTP(phone);
    if (success) {
      setStep('otp');
    } else {
      setError('Failed to send OTP. Please try again.');
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = await login(phone, otp);
    if (success) {
      onClose();
      setStep('phone');
      setPhone('');
      setOtp('');
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  const handleClose = () => {
    onClose();
    setStep('phone');
    setPhone('');
    setOtp('');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative animate-slide-up">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {step === 'phone' ? (
              <Phone className="h-6 w-6 text-primary-600" />
            ) : (
              <Lock className="h-6 w-6 text-primary-600" />
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {step === 'phone' ? 'Enter Phone Number' : 'Verify OTP'}
          </h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            {step === 'phone'
              ? 'We\'ll send you a verification code'
              : `Enter the 4-digit code sent to ${phone}`
            }
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
                required
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary text-white py-3 px-4 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
            >
              {isLoading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                Verification Code
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="1234"
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-center text-2xl font-mono tracking-widest"
                maxLength={4}
                required
                disabled={isLoading}
              />
            </div>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors touch-manipulation"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 btn-primary text-white py-3 px-4 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
              >
                {isLoading ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          </form>
        )}

        <p className="text-xs text-gray-500 text-center mt-4">
          For demo purposes, use any 4-digit code to login
        </p>
      </div>
    </div>
  );
};

export default AuthModal;