import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from '../components/Footer';
import { FiMapPin, FiBriefcase, FiHeart, FiUser, FiCalendar, FiPhone, FiBookOpen, FiDollarSign, FiPlus, FiTrash2, FiImage, FiEdit2 } from 'react-icons/fi';

// Helper component for each form field
const FormField = ({ icon, name, label, value, onChange, error, placeholder, type = 'text', options = [] }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-red-900 mb-1">
            {label} <span className="text-pink-500">*</span>
        </label>
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                {icon}
            </span>
            {type === 'select' ? (
                <select
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={`block w-full pl-10 pr-3 py-2 bg-slate-50 border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 ${error ? 'border-red-500 text-red-600 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
                >
                    <option value="" disabled>{placeholder || `Select ${label}`}</option>
                    {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            ) : type === 'textarea' ? (
                 <textarea
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    rows="4"
                    placeholder={placeholder}
                    className={`block w-full pl-10 pr-3 py-2 bg-slate-50 border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 ${error ? 'border-red-500 text-red-600 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
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
                    className={`block w-full pl-10 pr-3 py-2 bg-slate-50 border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 ${error ? 'border-red-500 text-red-600 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
                />
            )}
        </div>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);


const Car = () => {
    const navigate = useNavigate();
    const { state: prevState = {} } = useLocation();

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
            if (currentStep < 4) {
                setCurrentStep(prev => prev + 1);
            } else {
                // Final submission on the last step
                handleSubmit();
            }
        } else {
             alert('Please fill out all required fields on this page.');
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

    /* ----------- UI Rendering ----------- */
    return (
        <div className="min-h-screen bg-slate-100 font-sans">
            {/* MODIFICATION: Changed py-10 to py-20 to increase the vertical padding and thus the height of the header. */}
            <div 
                className="w-full text-white py-20 px-4 bg-cover bg-center bg-fixed bg-blend-multiply bg-gradient-to-br from-indigo-600 to-purple-700"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1501901609772-df0848060b33?auto=format&fit=crop&q=80&w=2070')` }}
            >
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-center">Complete Your Profile</h1>
                    <p className="text-center text-indigo-200 mt-2">A complete profile gets more attention. Let's make yours shine! ✨</p>
                    {/* Stepper */}
                    <div className="max-w-xl mx-auto mt-8">
                        <div className="flex items-center">
                            {Object.keys(steps).map((step, index) => (
                                <React.Fragment key={step}>
                                    <div className="flex flex-col items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${currentStep >= parseInt(step) ? 'bg-pink-500' : 'bg-indigo-400'}`}>
                                            {currentStep > parseInt(step) ? '✓' : step}
                                        </div>
                                        <p className={`text-xs mt-2 text-center transition-all duration-300 ${currentStep >= parseInt(step) ? 'font-semibold text-white' : 'text-indigo-200'}`}>{steps[step].title}</p>
                                    </div>
                                    {index < Object.keys(steps).length - 1 && (
                                        <div className={`flex-1 h-1 transition-all duration-300 mx-2 ${currentStep > parseInt(step) ? 'bg-pink-500' : 'bg-indigo-400'}`}></div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-4 sm:p-8 -mt-16">
                <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8">
                    <form onSubmit={(e) => e.preventDefault()} noValidate>
                        {/* Step 1: Basic Information */}
                        {currentStep === 1 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                                <FormField icon={<FiMapPin />} name="country" label="Country" value={formData.country} onChange={handleInputChange} error={errors.country} type="select" options={options.country} />
                                <FormField icon={<FiMapPin />} name="state" label="State" value={formData.state} onChange={handleInputChange} error={errors.state} type="select" options={options.state} />
                                <FormField icon={<FiMapPin />} name="city" label="City Living In" value={formData.city} onChange={handleInputChange} error={errors.city} placeholder="Enter your city" />
                                <FormField icon={<FiMapPin />} name="currentAddress" label="Current Address" value={formData.currentAddress} onChange={handleInputChange} error={errors.currentAddress} placeholder="E.g., 123 Main St" type="textarea" />
                                <FormField icon={<FiMapPin />} name="permanentAddress" label="Permanent Address" value={formData.permanentAddress} onChange={handleInputChange} error={errors.permanentAddress} placeholder="E.g., 456 Home Ave" type="textarea" />
                                <FormField icon={<FiPhone />} name="mobileNo" label="Mobile Number" value={formData.mobileNo} onChange={handleInputChange} error={errors.mobileNo} placeholder="10-digit number" type="tel" />
                                <FormField icon={<FiCalendar />} name="dob" label="Date of Birth" value={formData.dob} onChange={handleInputChange} error={errors.dob} type="date" />
                                <FormField icon={<FiMapPin />} name="birthPlace" label="Birth Place" value={formData.birthPlace} onChange={handleInputChange} error={errors.birthPlace} placeholder="Enter city of birth" />
                            </div>
                        )}
                        
                        {/* Step 2: Professional & Education */}
                        {currentStep === 2 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                                <FormField icon={<FiBookOpen />} name="degree" label="Highest Qualification" value={formData.degree} onChange={handleInputChange} error={errors.degree} type="select" options={options.degree} />
                                <FormField icon={<FiBriefcase />} name="employedIn" label="Employed In" value={formData.employedIn} onChange={handleInputChange} error={errors.employedIn} type="select" options={options.employedIn} />
                                <FormField icon={<FiBriefcase />} name="occupation" label="Occupation" value={formData.occupation} onChange={handleInputChange} error={errors.occupation} type="select" options={options.occupation} />
                                <FormField icon={<FiDollarSign />} name="income" label="Annual Income" value={formData.income} onChange={handleInputChange} error={errors.income} type="select" options={options.income} />
                            </div>
                        )}
                        
                        {/* Step 3: Personal Details */}
                        {currentStep === 3 && (
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                                <FormField icon={<FiUser />} name="height" label="Height" value={formData.height} onChange={handleInputChange} error={errors.height} type="select" options={options.height} />
                                <FormField icon={<FiUser />} name="weight" label="Weight" value={formData.weight} onChange={handleInputChange} error={errors.weight} type="select" options={options.weight} />
                                <FormField icon={<FiUser />} name="faceColor" label="Face Color" value={formData.faceColor} onChange={handleInputChange} error={errors.faceColor} type="select" options={options.faceColor} />
                                <FormField icon={<FiUser />} name="bodyShape" label="Body Shape" value={formData.bodyShape} onChange={handleInputChange} error={errors.bodyShape} type="select" options={options.bodyShape} />
                                <FormField icon={<FiUser />} name="rashifal" label="Rashifal (Zodiac)" value={formData.rashifal} onChange={handleInputChange} error={errors.rashifal} type="select" options={options.rashifal} />
                                <FormField icon={<FiHeart />} name="bloodGroup" label="Blood Group" value={formData.bloodGroup} onChange={handleInputChange} error={errors.bloodGroup} type="select" options={options.bloodGroup} />
                                <FormField icon={<FiHeart />} name="diet" label="Diet" value={formData.diet} onChange={handleInputChange} error={errors.diet} type="select" options={options.diet} />
                                <div>
                                    <label className="block text-sm font-medium text-red-900 mb-1">Manglik <span className="text-pink-500">*</span></label>
                                    <div className="flex gap-4 mt-2 p-2 bg-slate-50 border border-slate-300 rounded-md">
                                        {['Yes', 'No', "Don't Know"].map(opt => (
                                            <label key={opt} className="flex items-center gap-2 cursor-pointer text-sm">
                                                <input type="radio" name="manglik" value={opt} checked={formData.manglik === opt} onChange={handleInputChange} className="accent-pink-500" />
                                                <span>{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.manglik && <p className="text-red-500 text-xs mt-1">{errors.manglik}</p>}
                                </div>
                            </div>
                        )}
                        
                        {/* Step 4: About & Photos */}
                        {currentStep === 4 && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                                     <FormField icon={<FiHeart />} name="hobby" label="Hobbies" value={formData.hobby} onChange={handleInputChange} error={errors.hobby} placeholder="E.g., Reading, Music" />
                                     <FormField icon={<FiHeart />} name="favoriteColor" label="Favorite Color" value={formData.favoriteColor} onChange={handleInputChange} error={errors.favoriteColor} placeholder="E.g., Blue" />
                                     <FormField icon={<FiHeart />} name="favoriteSong" label="Favorite Song" value={formData.favoriteSong} onChange={handleInputChange} error={errors.favoriteSong} placeholder="Enter song title" />
                                     <FormField icon={<FiHeart />} name="favoriteMovies" label="Favorite Movies" value={formData.favoriteMovies} onChange={handleInputChange} error={errors.favoriteMovies} placeholder="E.g., Inception, The Matrix" />
                                </div>
                                <FormField icon={<FiEdit2 />} name="about" label="About Yourself" value={formData.about} onChange={handleInputChange} error={errors.about} placeholder="Write something that makes your profile stand out..." type="textarea" />
                                <div>
                                    <label className="block text-sm font-medium text-red-900 mb-1">Upload Photos <span className="text-pink-500">*</span></label>
                                    {errors.photos && <p className="text-red-500 text-xs mb-2">{errors.photos}</p>}
                                    <div className="space-y-3">
                                        {formData.photos.map((photo, idx) => (
                                            <div key={idx} className="flex items-center gap-3">
                                                <label className="flex-1 cursor-pointer">
                                                    <div className={`flex items-center gap-3 p-2 border-2 ${errors.photos ? 'border-red-400' : 'border-slate-300'} border-dashed rounded-lg`}>
                                                        <FiImage className="text-slate-400 text-xl" />
                                                        <span className="text-sm text-slate-500">{photo ? `Selected: ${photo.name.substring(0, 25)}...` : 'Click to select a photo'}</span>
                                                    </div>
                                                    <input type="file" accept="image/*" onChange={(e) => handlePhotoChange(idx, e.target.files[0])} className="hidden" />
                                                </label>
                                                {formData.photos.length > 1 && (
                                                    <button type="button" onClick={() => removePhotoField(idx)} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full">
                                                        <FiTrash2 />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <button type="button" onClick={addPhotoField} className="flex items-center gap-2 text-sm mt-3 text-indigo-600 hover:text-indigo-800 font-semibold">
                                        <FiPlus /> Add Another Photo
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        {/* Navigation Buttons */}
                        <div className="flex justify-between items-center pt-8 mt-8 border-t border-slate-200">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="bg-slate-200 text-slate-700 px-6 py-2 rounded-md font-semibold hover:bg-slate-300 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={handleNext}
                                className="bg-red-900 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-700 transition-colors shadow-md"
                            >
                                {currentStep === 4 ? 'Submit Profile' : 'Next Step'}
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