/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import LogoIcon from '@/components/icons/LogoIcon';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Eye, EyeOff, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const signUpSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  resume: z
    .custom<FileList>((val) => val instanceof FileList, 'Please upload a file')
    .refine((files) => files?.length === 1, 'Resume is required')
    .refine((files) => files?.[0]?.size <= 5000000, 'Max file size is 5MB')
    .refine((files) => files?.[0]?.type === 'application/pdf', 'Only .pdf files are accepted'),
  profilePicture: z.union([
    z.string().min(1, 'Please select a default profile picture or upload a custom one'),
    z
      .custom<FileList>((val) => val instanceof FileList, 'Please upload a file')
      .refine((files) => files?.length === 1, 'Profile picture is required')
      .refine((files) => files?.[0]?.size <= 5000000, 'Max file size is 5MB')
      .refine(
        (files) =>
          ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(files?.[0]?.type || ''),
        'Only .jpg, .jpeg, .png and .webp formats are accepted',
      ),
  ]),
});

type SignInFormValues = z.infer<typeof signInSchema>;
type SignUpFormValues = z.infer<typeof signUpSchema>;

const defaultProfilePictures = [
  '/profile1.png',
  '/profile2.png',
  '/profile3.png',
  '/profile4.png',
  '/profile5.png',
];

const AuthForm = ({ type: initialType }: { type: 'sign-in' | 'sign-up' }) => {
  const [type, setType] = useState(initialType);
  const [selectedDefaultPicture, setSelectedDefaultPicture] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedProfileFileName, setUploadedProfileFileName] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    number: false,
    uppercase: false,
    lowercase: false,
    specialChar: false,
  });
  const isSignIn = type === 'sign-in';

  const form = useForm<SignInFormValues | SignUpFormValues>({
    resolver: zodResolver(isSignIn ? signInSchema : signUpSchema),
    defaultValues: isSignIn
      ? {
          email: '',
          password: '',
        }
      : {
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          profilePicture: '',
        },
  });

  // Watch password field for changes
  const password = useWatch({
    control: form.control,
    name: 'password',
    defaultValue: '',
  });

  // Update password strength when password changes - Fixed useEffect instead of useState
  useEffect(() => {
    if (!isSignIn && password) {
      const strength = {
        length: password.length >= 8,
        number: /\d/.test(password),
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        specialChar: /[^a-zA-Z0-9]/.test(password),
      };
      setPasswordStrength(strength);
    } else if (!password) {
      setPasswordStrength({
        length: false,
        number: false,
        uppercase: false,
        lowercase: false,
        specialChar: false,
      });
    }
  }, [password, isSignIn]);

  const onSubmit = (values: SignInFormValues | SignUpFormValues) => {
    try {
      // Handle profile picture logic for sign up
      if (!isSignIn) {
        const signUpValues = values as SignUpFormValues;
        if (selectedDefaultPicture) {
          signUpValues.profilePicture = selectedDefaultPicture;
        }
      }
      console.log('Form submitted:', values);
      // Handle form submission
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const toggleType = () => {
    setType(isSignIn ? 'sign-up' : 'sign-in');
    form.reset();
    setPasswordStrength({
      length: false,
      number: false,
      uppercase: false,
      lowercase: false,
      specialChar: false,
    });
    setSelectedDefaultPicture('');
    setUploadedFileName('');
    setUploadedProfileFileName('');
    setShowPassword(false);
  };

  const handleDefaultPictureSelect = (picture: string) => {
    setSelectedDefaultPicture(picture);
    setUploadedProfileFileName('');
    form.setValue('profilePicture', picture);
    form.clearErrors('profilePicture');
  };

  const handleProfilePictureUpload = (files: FileList | null) => {
    if (files && files.length > 0) {
      setUploadedProfileFileName(files[0].name);
      setSelectedDefaultPicture('');
      form.setValue('profilePicture', files);
      form.clearErrors('profilePicture');
    }
  };

  const handleResumeUpload = (files: FileList | null) => {
    if (files && files.length > 0) {
      setUploadedFileName(files[0].name);
      form.setValue('resume', files);
      form.clearErrors('resume');
    }
  };

  const removeUploadedFile = (type: 'resume' | 'profile') => {
    if (type === 'resume') {
      setUploadedFileName('');
      form.setValue('resume', undefined as any);
    } else {
      setUploadedProfileFileName('');
      setSelectedDefaultPicture('');
      form.setValue('profilePicture', '');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 overflow-y-auto">
      <div className="w-full max-w-md space-y-6">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-4">
            <LogoIcon className="h-8 w-auto" />
            <span className="text-xl font-semibold">Malsi</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            {isSignIn ? 'Welcome back!' : 'Create your account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isSignIn
              ? 'Sign in to prepare for your mock interview'
              : 'Start your journey to better interview preparation'}
          </p>
        </div>

        {/* Form Section */}
        <div className="">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Sign Up Fields */}
              {!isSignIn && (
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="First Name" {...field} className="h-11 rounded-md" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Last Name" {...field} className="h-11 rounded-md" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email address"
                        {...field}
                        className="h-11 rounded-md"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field with Toggle */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Password"
                          {...field}
                          className="h-11 rounded-md pr-10"
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>

                    {/* Password Strength Indicator for Sign Up */}
                    {!isSignIn && (
                      <>
                        <FormDescription className="text-xs text-gray-600 mt-1">
                          Must contain 8+ characters with uppercase, lowercase, number, and special
                          character
                        </FormDescription>
                        {password && (
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center gap-2 text-xs">
                              {passwordStrength.length ? (
                                <Check className="h-3 w-3 text-green-500" />
                              ) : (
                                <X className="h-3 w-3 text-red-500" />
                              )}
                              <span
                                className={
                                  passwordStrength.length ? 'text-green-600' : 'text-red-600'
                                }
                              >
                                At least 8 characters
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              {passwordStrength.uppercase ? (
                                <Check className="h-3 w-3 text-green-500" />
                              ) : (
                                <X className="h-3 w-3 text-red-500" />
                              )}
                              <span
                                className={
                                  passwordStrength.uppercase ? 'text-green-600' : 'text-red-600'
                                }
                              >
                                At least 1 uppercase letter
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              {passwordStrength.lowercase ? (
                                <Check className="h-3 w-3 text-green-500" />
                              ) : (
                                <X className="h-3 w-3 text-red-500" />
                              )}
                              <span
                                className={
                                  passwordStrength.lowercase ? 'text-green-600' : 'text-red-600'
                                }
                              >
                                At least 1 lowercase letter
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              {passwordStrength.number ? (
                                <Check className="h-3 w-3 text-green-500" />
                              ) : (
                                <X className="h-3 w-3 text-red-500" />
                              )}
                              <span
                                className={
                                  passwordStrength.number ? 'text-green-600' : 'text-red-600'
                                }
                              >
                                At least 1 number
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              {passwordStrength.specialChar ? (
                                <Check className="h-3 w-3 text-green-500" />
                              ) : (
                                <X className="h-3 w-3 text-red-500" />
                              )}
                              <span
                                className={
                                  passwordStrength.specialChar ? 'text-green-600' : 'text-red-600'
                                }
                              >
                                At least 1 special character
                              </span>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Sign Up Additional Fields */}
              {!isSignIn && (
                <>
                  {/* Resume Upload */}
                  <FormField
                    control={form.control}
                    name="resume"
                    render={({ field: { onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Resume (PDF)</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <div className="relative">
                              <Input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => {
                                  handleResumeUpload(e.target.files);
                                  onChange(e.target.files);
                                }}
                                className="h-11 rounded-md"
                              />
                              {uploadedFileName && (
                                <div className="flex items-center justify-between mt-2 p-2 bg-gray-50 rounded-md">
                                  <span className="text-sm text-gray-700 truncate">
                                    {uploadedFileName}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => removeUploadedFile('resume')}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Upload your resume in PDF format (max 5MB)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Profile Picture Section */}
                  <FormField
                    control={form.control}
                    name="profilePicture"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profile Picture</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            {/* Default Pictures */}
                            <div>
                              <p className="text-sm text-gray-600 mb-2">
                                Choose a default picture:
                              </p>
                              <div className="flex gap-2 flex-wrap">
                                {defaultProfilePictures.map((picture, index) => (
                                  <button
                                    key={index}
                                    type="button"
                                    onClick={() => handleDefaultPictureSelect(picture)}
                                    className={`w-12 h-12 rounded-full border-2 overflow-hidden ${
                                      selectedDefaultPicture === picture
                                        ? 'border-blue-500 ring-2 ring-blue-200'
                                        : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                  >
                                    <img
                                      src={picture}
                                      alt={`Profile ${index + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Or Upload Custom */}
                            <div>
                              <p className="text-sm text-gray-600 mb-2">Or upload your own:</p>
                              <Input
                                type="file"
                                accept=".jpg,.jpeg,.png,.webp"
                                onChange={(e) => {
                                  handleProfilePictureUpload(e.target.files);
                                  field.onChange(e.target.files);
                                }}
                                className="h-11 rounded-md"
                              />
                              {uploadedProfileFileName && (
                                <div className="flex items-center justify-between mt-2 p-2 bg-gray-50 rounded-md">
                                  <span className="text-sm text-gray-700 truncate">
                                    {uploadedProfileFileName}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => removeUploadedFile('profile')}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Select a default picture or upload your own (max 5MB,
                          .jpg/.jpeg/.png/.webp)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Submit Button */}
              <Button type="submit" className="w-full h-11 text-base mt-6">
                {isSignIn ? 'Sign In' : 'Sign Up'}
              </Button>
            </form>
          </Form>

          {/* Toggle Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            {isSignIn ? (
              <>
                Don't have an account?{' '}
                <button
                  onClick={toggleType}
                  className="font-medium text-primary hover:text-primary/80 underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={toggleType}
                  className="font-medium text-primary hover:text-primary/80 underline"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
