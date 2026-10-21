import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from '../components/Footer';
import {
    FiMapPin, FiBriefcase, FiHeart, FiUser, FiCalendar, FiPhone, FiBookOpen, FiDollarSign,
    FiPlus, FiTrash2, FiImage, FiEdit2, FiCheck, FiChevronDown, FiArrowRight, FiArrowLeft, FiAlertCircle,
} from 'react-icons/fi';

/* ------------------------------ SHARED STYLES ------------------------------ */

const baseInput =
    'block w-full pr-3 py-2.5 bg-slate-50 border rounded-xl text-slate-800 placeholder-slate-400 ' +
    'transition focus:outline-none focus:ring-2 focus:bg-white';
const okInput = 'border-slate-200 focus:ring-rose-400 focus:border-rose-400';
const badInput = 'border-red-400 bg-red-50/40 focus:ring-red-400 focus:border-red-400';

/* ------------------------------ FORM FIELD ------------------------------ */

// Helper component for each form field
const FormField = ({ icon, name, label, value, onChange, error, placeholder, type = 'text', options = [] }) => {
    const stateClass = error ? badInput : okInput;
    const iconPos = type === 'textarea' ? 'top-3' : 'inset-y-0 items-center';

    return (
        <div>
            <label htmlFor={name} className="block text-sm font-semibold text-red-900 mb-1.5">
                {label} <span className="text-pink-500">*</span>
            </label>
            <div className="relative">
                <span className={`absolute left-0 flex pl-3.5 text-slate-400 text-lg pointer-events-none ${iconPos}`}>
                    {icon}
                </span>

                {type === 'select' ? (
                    <>
                        <select
                            id={name}
                            name={name}
                            value={value}
                            onChange={onChange}
                            className={`${baseInput} ${stateClass} pl-11 pr-10 appearance-none ${value ? 'text-slate-800' : 'text-slate-400'}`}
                        >
                            <option value="" disabled>{placeholder || `Select ${label}`}</option>
                            {options.map((opt) => <option key={opt} value={opt} className="text-slate-800">{opt}</option>)}
                        </select>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 pointer-events-none">
                            <FiChevronDown />
                        </span>
                    </>
                ) : type === 'textarea' ? (
                    <textarea
                        id={name}
                        name={name}
                        value={value}
                        onChange={onChange}
                        rows="4"
                        placeholder={placeholder}
                        className={`${baseInput} ${stateClass} pl-11 resize-none`}
                    />
                ) : (
                    <input
                        id={name}
                        name={name}
                        type={type}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        maxLength={name === 'mobileNo' ? 10 : undefined}
                        inputMode={name === 'mobileNo' ? 'numeric' : undefined}
                        className={`${baseInput} ${stateClass} pl-11`}
                    />
                )}
            </div>
            {error && (
                <p className="flex items-center gap-1 text-red-500 text-xs mt-1.5">
                    <FiAlertCircle className="shrink-0" /> {error}
                </p>
            )}
        </div>
    );
};

/* ------------------------------ PHOTO SLOT ------------------------------ */

const PhotoSlot = ({ photo, index, canRemove, hasError, onChange, onRemove }) => {
    const [preview, setPreview] = useState('');

    useEffect(() => {
        if (!photo) {
            setPreview('');
            return undefined;
        }
        const url = URL.createObjectURL(photo);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [photo]);

    return (
        <div className="relative">
            <label
                className={`group block aspect-square rounded-2xl overflow-hidden cursor-pointer transition ${
                    preview
                        ? 'shadow-md'
                        : `border-2 border-dashed ${hasError ? 'border-red-400 bg-red-50/50' : 'border-slate-300 bg-slate-50 hover:border-rose-400 hover:bg-rose-50/50'}`
                }`}
            >
                {preview ? (
                    <>
                        <img src={preview} alt={`Selected ${index + 1}`} className="h-full w-full object-cover" />
                        <span className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition pb-3 text-xs font-semibold text-white">
                            Click to change
                        </span>
                    </>
                ) : (
                    <span className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-400 group-hover:text-rose-500 transition">
                        <FiImage className="text-3xl" />
                        <span className="text-xs font-medium px-2 text-center">Click to select a photo</span>
                    </span>
                )}
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) onChange(index, file);
                    }}
                />
            </label>

            {index === 0 && preview && (
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-red-900/90 text-white text-[11px] font-semibold">
                    Main photo
                </span>
            )}

            {canRemove && (
                <button
                    type="button"
                    onClick={() => onRemove(index)}
                    aria-label={`Remove photo ${index + 1}`}
                    className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-red-600 shadow hover:bg-red-600 hover:text-white transition"
                >
                    <FiTrash2 />
                </button>
            )}
        </div>
    );
};

/* ------------------------------ PAGE ------------------------------ */

const Car = () => {
    const navigate = useNavigate();
    const { state: prevState = {} } = useLocation();
    const cardRef = useRef(null);
    const firstRender = useRef(true);

    /* ----------- State Management ----------- */
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        country: '', state: '', city: '', currentAddress: '', permanentAddress: '', mobileNo: '', dob: '', birthPlace: '',
        degree: '', employedIn: '', occupation: '', income: '',
        height: '', weight: '', faceColor: '', bodyShape: '', rashifal: '', bloodGroup: '', manglik: '', diet: '',
        photos: [null], hobby: '', about: '', favoriteColor: '', favoriteSong: '', favoriteMovies: '',
    });
    const [errors, setErrors] = useState({});

    /* ----------- Field Definitions for Each Step ----------- */
    const steps = {
        1: {
            title: 'Basic Information',
            fields: ['country', 'state', 'city', 'currentAddress', 'permanentAddress', 'mobileNo', 'dob', 'birthPlace']
        },
        2: {
            title: 'Professional & Education',
            fields: ['degree', 'employedIn', 'occupation', 'income']
        },
        3: {
            title: 'Personal Details',
            fields: ['height', 'weight', 'faceColor', 'bodyShape', 'rashifal', 'bloodGroup', 'manglik', 'diet']
        },
        4: {
            title: 'About & Photos',
            fields: ['hobby', 'about', 'favoriteColor', 'favoriteSong', 'favoriteMovies', 'photos']
        }
    };
    const stepKeys = Object.keys(steps);
    const totalSteps = stepKeys.length;

    // Har step badalne par card ke top pe scroll (mobile pe zaroori)
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [currentStep]);

    /* ----------- Input Handlers ----------- */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handlePhotoChange = (idx, file) => {
        const newPhotos = [...formData.photos];
        newPhotos[idx] = file;
        setFormData(prev => ({ ...prev, photos: newPhotos }));
        if (errors.photos && newPhotos.some(p => p)) {
            setErrors(prev => ({ ...prev, photos: null }));
        }
    };

    const addPhotoField = () => setFormData(prev => ({ ...prev, photos: [...prev.photos, null] }));
    const removePhotoField = (idx) => {
        const newPhotos = formData.photos.filter((_, i) => i !== idx);
        setFormData(prev => ({ ...prev, photos: newPhotos.length ? newPhotos : [null] }));
    };

    /* ----------- Navigation & Validation ----------- */
    const validateStep = () => {
        const newErrors = {};
        const currentFields = steps[currentStep].fields;

        currentFields.forEach(key => {
            if (key === 'photos') {
                if (!formData.photos.some(p => p)) {
                    newErrors.photos = 'Please upload at least one photo.';
                }
            } else if (!formData[key] || (typeof formData[key] === 'string' && formData[key].trim() === '')) {
                const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                newErrors[key] = `${label} is required.`;
            }
        });

        if (currentFields.includes('mobileNo') && formData.mobileNo && !/^[0-9]{10}$/.test(formData.mobileNo)) {
            newErrors.mobileNo = 'Please enter a valid 10-digit mobile number.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep()) {
            if (currentStep < totalSteps) {
                setCurrentStep(prev => prev + 1);
            } else {
                // Final submission on the last step
                handleSubmit();
            }
        } else {
            // alert ki jagah inline banner dikhta hai; bas card ke top pe le jao
            cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        } else {
            navigate(-1); // Go back to previous route if on first step
        }
    };

    const handleSubmit = () => {
        // Re-validate all fields on final submit just in case
        if (validateStep()) {
            console.log('Form Submitted Successfully:', { ...prevState, ...formData });
            navigate('/fmprof', { state: { ...prevState, ...formData } });
        }
    };

    /* ----------- Dropdown Options ----------- */
    const options = {
        country: ['India', 'USA', 'Canada', 'Australia'],
        state: ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'],
        city: ['Mumbai','Delhi','Bengaluru','Hyderabad','Chennai','Kolkata','Pune','Ahmedabad','Jaipur','Lucknow','Bhubaneswar','Cuttack', 'Gaya'],
        degree: ['PhD','Postgraduate','MCom','MA','MBA','MBBS','CA','Journalism','LLB','LLM','BTech','BSc','BCom','BBA','BA','B.Ed','MPharma','BPharma','Pharmacy','Dentist','Agriculture','Hospitality','Undergraduate','Diploma','ITI','Higher Secondary (12th)','Secondary (10th)'],
        employedIn: ['Private Sector','Government','Business','Not Working', 'Student'],
        occupation: ['Software Engineer','Civil Engineer','Data Scientist','Doctor','Teacher','Accountant','Lawyer','Banker','Professor','Designer','Pharmacist','Police Officer','Army Personnel','Sales Executive','Marketing Manager','HR Specialist','Pilot','Journalist','Architect','None'],
        income: ['Rs. 0 – 1 Lakh','Rs. 1 – 2 Lakh','Rs. 2 – 5 Lakh','Rs. 5 – 10 Lakh','Rs. 10 – 20 Lakh','Rs. 20 Lakh & Above'],
        height: ['4’6”', '4’8”', '5’0”', '5’2”', '5’4”', '5’6”', '5’8”', '6’0”', '6’2”', '6’4”'],
        weight: ['40-45 kg','46-50 kg','51-55 kg','56-60 kg','61-65 kg','66-70 kg','71-75 kg','76-80 kg','81-85 kg','86-90 kg','90kg+'],
        faceColor: ['Fair', 'Medium', 'Dark', 'Wheatish'],
        bodyShape: ['Slim', 'Athletic', 'Average', 'Heavy', 'Curvy', 'Muscular'],
        rashifal: ['Mesh (Aries)', 'Vrishabh (Taurus)', 'Mithun (Gemini)', 'Karka (Cancer)', 'Simha (Leo)','Kanya (Virgo)', 'Tula (Libra)', 'Vrischik (Scorpio)', 'Dhanu (Sagittarius)','Makar (Capricorn)', 'Kumbh (Aquarius)', 'Meen (Pisces)'],
        bloodGroup: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
        diet: ['Veg', 'Non Veg'],
    };

    const hasErrors = Object.values(errors).some(Boolean);
    const progress = Math.round((currentStep / totalSteps) * 100);

    /* ----------- UI Rendering ----------- */
    return (
        <div className="min-h-screen bg-slate-100 font-sans">
            {/* HEADER + STEPPER */}
            <div className="relative overflow-hidden bg-gradient-to-br from-red-950 via-red-900 to-rose-700 text-white px-4 pt-10 pb-28 sm:pt-14 sm:pb-32">
                <div className="pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-pink-500/25 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-rose-400/20 blur-3xl" />

                <div className="relative max-w-4xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-center tracking-tight">Complete Your Profile</h1>
                    <p className="text-center text-rose-100 mt-2 text-sm sm:text-base">
                        A complete profile gets more attention. Let's make yours shine! ✨
                    </p>

                    {/* Stepper */}
                    <div className="max-w-xl mx-auto mt-8 sm:mt-10">
                        <div className="flex items-center">
                            {stepKeys.map((step, index) => {
                                const n = parseInt(step, 10);
                                const done = currentStep > n;
                                const active = currentStep === n;
                                return (
                                    <React.Fragment key={step}>
                                        <div className="relative">
                                            <div
                                                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
                                                    done
                                                        ? 'bg-pink-500 text-white'
                                                        : active
                                                            ? 'bg-white text-red-800 ring-4 ring-white/30 scale-110'
                                                            : 'bg-white/15 text-white/70 border border-white/30'
                                                }`}
                                            >
                                                {done ? <FiCheck /> : step}
                                            </div>
                                            <p
                                                className={`hidden sm:block absolute top-full mt-2 left-1/2 -translate-x-1/2 w-28 text-center text-xs transition-all duration-300 ${
                                                    currentStep >= n ? 'font-semibold text-white' : 'text-rose-200'
                                                }`}
                                            >
                                                {steps[step].title}
                                            </p>
                                        </div>
                                        {index < totalSteps - 1 && (
                                            <div className="flex-1 mx-2 sm:mx-3 h-1 rounded-full bg-white/20 overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-pink-400 transition-all duration-500"
                                                    style={{ width: done ? '100%' : '0%' }}
                                                />
                                            </div>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>

                        {/* Mobile label */}
                        <p className="sm:hidden mt-4 text-center text-sm text-rose-100">
                            Step {currentStep} of {totalSteps} · <span className="font-semibold text-white">{steps[currentStep].title}</span>
                        </p>
                        <div className="hidden sm:block h-8" />
                    </div>
                </div>
            </div>

            {/* FORM CARD */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-12 -mt-20 relative">
                <div ref={cardRef} className="bg-white rounded-3xl shadow-2xl shadow-slate-300/60 overflow-hidden scroll-mt-4">
                    {/* Card header */}
                    <div className="px-6 sm:px-10 pt-6 sm:pt-8">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-rose-600">
                                    Step {currentStep} of {totalSteps}
                                </p>
                                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-0.5">{steps[currentStep].title}</h2>
                            </div>
                            <span className="shrink-0 text-sm font-bold text-red-900 bg-rose-50 border border-rose-100 rounded-full px-3 py-1">
                                {progress}%
                            </span>
                        </div>
                        <div className="mt-4 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-red-900 via-rose-600 to-pink-500 transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    <form onSubmit={(e) => e.preventDefault()} noValidate className="px-6 sm:px-10 py-6 sm:py-8">
                        {hasErrors && (
                            <div role="alert" className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                <FiAlertCircle className="mt-0.5 shrink-0 text-lg" />
                                <span>Please fill out all required fields on this page.</span>
                            </div>
                        )}

                        {/* Step 1: Basic Information */}
                        {currentStep === 1 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                <FormField icon={<FiMapPin />} name="country" label="Country" value={formData.country} onChange={handleInputChange} error={errors.country} type="select" options={options.country} />
                                <FormField icon={<FiMapPin />} name="state" label="State" value={formData.state} onChange={handleInputChange} error={errors.state} type="select" options={options.state} />
                                <FormField icon={<FiMapPin />} name="city" label="City Living In" value={formData.city} onChange={handleInputChange} error={errors.city} placeholder="Enter your city" />
                                <FormField icon={<FiMapPin />} name="birthPlace" label="Birth Place" value={formData.birthPlace} onChange={handleInputChange} error={errors.birthPlace} placeholder="Enter city of birth" />
                                <FormField icon={<FiMapPin />} name="currentAddress" label="Current Address" value={formData.currentAddress} onChange={handleInputChange} error={errors.currentAddress} placeholder="E.g., 123 Main St" type="textarea" />
                                <FormField icon={<FiMapPin />} name="permanentAddress" label="Permanent Address" value={formData.permanentAddress} onChange={handleInputChange} error={errors.permanentAddress} placeholder="E.g., 456 Home Ave" type="textarea" />
                                <FormField icon={<FiPhone />} name="mobileNo" label="Mobile Number" value={formData.mobileNo} onChange={handleInputChange} error={errors.mobileNo} placeholder="10-digit number" type="tel" />
                                <FormField icon={<FiCalendar />} name="dob" label="Date of Birth" value={formData.dob} onChange={handleInputChange} error={errors.dob} type="date" />
                            </div>
                        )}

                        {/* Step 2: Professional & Education */}
                        {currentStep === 2 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                <FormField icon={<FiBookOpen />} name="degree" label="Highest Qualification" value={formData.degree} onChange={handleInputChange} error={errors.degree} type="select" options={options.degree} />
                                <FormField icon={<FiBriefcase />} name="employedIn" label="Employed In" value={formData.employedIn} onChange={handleInputChange} error={errors.employedIn} type="select" options={options.employedIn} />
                                <FormField icon={<FiBriefcase />} name="occupation" label="Occupation" value={formData.occupation} onChange={handleInputChange} error={errors.occupation} type="select" options={options.occupation} />
                                <FormField icon={<FiDollarSign />} name="income" label="Annual Income" value={formData.income} onChange={handleInputChange} error={errors.income} type="select" options={options.income} />
                            </div>
                        )}

                        {/* Step 3: Personal Details */}
                        {currentStep === 3 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                <FormField icon={<FiUser />} name="height" label="Height" value={formData.height} onChange={handleInputChange} error={errors.height} type="select" options={options.height} />
                                <FormField icon={<FiUser />} name="weight" label="Weight" value={formData.weight} onChange={handleInputChange} error={errors.weight} type="select" options={options.weight} />
                                <FormField icon={<FiUser />} name="faceColor" label="Face Color" value={formData.faceColor} onChange={handleInputChange} error={errors.faceColor} type="select" options={options.faceColor} />
                                <FormField icon={<FiUser />} name="bodyShape" label="Body Shape" value={formData.bodyShape} onChange={handleInputChange} error={errors.bodyShape} type="select" options={options.bodyShape} />
                                <FormField icon={<FiUser />} name="rashifal" label="Rashifal (Zodiac)" value={formData.rashifal} onChange={handleInputChange} error={errors.rashifal} type="select" options={options.rashifal} />
                                <FormField icon={<FiHeart />} name="bloodGroup" label="Blood Group" value={formData.bloodGroup} onChange={handleInputChange} error={errors.bloodGroup} type="select" options={options.bloodGroup} />
                                <FormField icon={<FiHeart />} name="diet" label="Diet" value={formData.diet} onChange={handleInputChange} error={errors.diet} type="select" options={options.diet} />
                                <div>
                                    <span className="block text-sm font-semibold text-red-900 mb-1.5">Manglik <span className="text-pink-500">*</span></span>
                                    <div role="radiogroup" aria-label="Manglik" className="grid grid-cols-3 gap-2">
                                        {['Yes', 'No', "Don't Know"].map(opt => {
                                            const selected = formData.manglik === opt;
                                            return (
                                                <label
                                                    key={opt}
                                                    className={`cursor-pointer text-center rounded-xl border px-2 py-2.5 text-sm font-medium transition focus-within:ring-2 focus-within:ring-rose-400 ${
                                                        selected
                                                            ? 'border-red-800 bg-red-50 text-red-900 shadow-sm'
                                                            : errors.manglik
                                                                ? 'border-red-300 bg-red-50/40 text-slate-600'
                                                                : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-rose-300 hover:bg-rose-50/50'
                                                    }`}
                                                >
                                                    <input type="radio" name="manglik" value={opt} checked={selected} onChange={handleInputChange} className="sr-only" />
                                                    {opt}
                                                </label>
                                            );
                                        })}
                                    </div>
                                    {errors.manglik && (
                                        <p className="flex items-center gap-1 text-red-500 text-xs mt-1.5">
                                            <FiAlertCircle className="shrink-0" /> {errors.manglik}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Step 4: About & Photos */}
                        {currentStep === 4 && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                    <FormField icon={<FiHeart />} name="hobby" label="Hobbies" value={formData.hobby} onChange={handleInputChange} error={errors.hobby} placeholder="E.g., Reading, Music" />
                                    <FormField icon={<FiHeart />} name="favoriteColor" label="Favorite Color" value={formData.favoriteColor} onChange={handleInputChange} error={errors.favoriteColor} placeholder="E.g., Blue" />
                                    <FormField icon={<FiHeart />} name="favoriteSong" label="Favorite Song" value={formData.favoriteSong} onChange={handleInputChange} error={errors.favoriteSong} placeholder="Enter song title" />
                                    <FormField icon={<FiHeart />} name="favoriteMovies" label="Favorite Movies" value={formData.favoriteMovies} onChange={handleInputChange} error={errors.favoriteMovies} placeholder="E.g., Inception, The Matrix" />
                                </div>

                                <FormField icon={<FiEdit2 />} name="about" label="About Yourself" value={formData.about} onChange={handleInputChange} error={errors.about} placeholder="Write something that makes your profile stand out..." type="textarea" />

                                <div>
                                    <span className="block text-sm font-semibold text-red-900 mb-1">Upload Photos <span className="text-pink-500">*</span></span>
                                    <p className="text-xs text-slate-500 mb-3">The first photo is used as your main profile picture.</p>
                                    {errors.photos && (
                                        <p className="flex items-center gap-1 text-red-500 text-xs mb-3">
                                            <FiAlertCircle className="shrink-0" /> {errors.photos}
                                        </p>
                                    )}

                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {formData.photos.map((photo, idx) => (
                                            <PhotoSlot
                                                key={idx}
                                                photo={photo}
                                                index={idx}
                                                canRemove={formData.photos.length > 1}
                                                hasError={Boolean(errors.photos)}
                                                onChange={handlePhotoChange}
                                                onRemove={removePhotoField}
                                            />
                                        ))}

                                        <button
                                            type="button"
                                            onClick={addPhotoField}
                                            className="aspect-square rounded-2xl border-2 border-dashed border-rose-300 bg-rose-50/40 text-rose-600 hover:bg-rose-50 hover:border-rose-400 transition flex flex-col items-center justify-center gap-2 text-sm font-semibold"
                                        >
                                            <FiPlus className="text-2xl" />
                                            Add Another Photo
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex items-center gap-3 pt-6 mt-8 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                            >
                                <FiArrowLeft /> Back
                            </button>
                            <button
                                type="button"
                                onClick={handleNext}
                                className="flex-1 sm:flex-none sm:ml-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-900 to-red-700 text-white px-7 py-3 rounded-xl font-semibold shadow-lg shadow-red-200 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                            >
                                {currentStep === totalSteps ? 'Submit Profile' : 'Next Step'}
                                {currentStep === totalSteps ? <FiCheck /> : <FiArrowRight />}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Car;