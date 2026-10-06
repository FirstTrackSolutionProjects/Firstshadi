import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from '../components/Footer';
import { api } from '../services/api';

/* ----- option lists ----- */
const generalJobs = ['Private Sector','Government','Business','Not Working'];
const occupations = [
  'Software Engineer','Civil Engineer','Mechanical Engineer','Electrical Engineer','Electronics Engineer',
  'Data Scientist','Doctor','Teacher','Accountant','Lawyer','Banker','Professor','Designer','Pharmacist',
  'Police','Army Personnel','IAS','State PCS','SSC CGL Officer','SSC CHSL Clerk','JE (Junior Engineer)',
  'AE (Assistant Engineer)','Marketing Manager','Human Resources','Pilot','Journalist','Architect','Scientist','None'
];
const qualifications = [
  'PhD','Postgraduate','MCom','MA','MBA','MBBS','CA','Journalism','LLB','LLM','BTech','BSc','BCom','BBA','BA',
  'B.Ed','MPharma','BPharma','Pharmacy','Dentist','Agriculture','Hospitality','Undergraduate','Diploma','ITI',
  'Higher Secondary (12th)','11th','Secondary (10th)','None'
];

const Fmprof = () => {
  const navigate = useNavigate();
  const { state: prevData = {} } = useLocation();

  useEffect(() => {
    if (!prevData?.firstName) navigate('/box');
  }, [prevData, navigate]);

  const [family, setFamily] = useState({
    father:  { name: '', job: '', occupation: '', qualification: '' },
    mother:  { name: '', job: '', occupation: '', qualification: '' },
    brothers: [{ name: '', job: '', occupation: '', qualification: '' }],
    sisters:  [{ name: '', job: '', occupation: '', qualification: '' }]
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (type, index, field, value) => {
    if (type === 'father' || type === 'mother') {
      setFamily({ ...family, [type]: { ...family[type], [field]: value } });
    } else {
      const updated = [...family[type]];
      updated[index][field] = value;
      setFamily({ ...family, [type]: updated });
    }
  };

  const addMember = (type) => setFamily({ ...family, [type]: [...family[type], { name:'', job:'', occupation:'', qualification:'' }] });
  const removeMember = (type, idx) => {
    const updated = [...family[type]];
    updated.splice(idx, 1);
    setFamily({ ...family, [type]: updated });
  };

  const getJobOptions = (role) => {
    if (role === 'father' || role === 'brothers') return [...generalJobs, 'Farmer'];
    if (role === 'mother' || role === 'sisters')  return [...generalJobs, 'Housewife'];
    return generalJobs;
  };

  const buildFamilyMembers = () => {
    const arr = [];
    // father / mother
    ['father', 'mother'].forEach((role) => {
      const f = family[role];
      if (f.name) {
        arr.push({
          relation: role === 'father' ? 'Father' : 'Mother',
          name: f.name,
          job: f.job,
          occupation: f.occupation,
          qualification: f.qualification,
          is_married: true,
        });
      }
    });
    // brothers / sisters
    family.brothers.forEach((b) => {
      if (b.name) arr.push({ relation: 'Brother', name: b.name, job: b.job, occupation: b.occupation, qualification: b.qualification, is_married: false });
    });
    family.sisters.forEach((s) => {
      if (s.name) arr.push({ relation: 'Sister', name: s.name, job: s.job, occupation: s.occupation, qualification: s.qualification, is_married: false });
    });
    return arr;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!e.target.checkValidity()) return e.target.reportValidity();

    setSaving(true);
    try {
      const members = buildFamilyMembers();
      if (members.length > 0) {
        // Try to save; if profile doesn't exist yet, Preview will create it and family can be re-saved later.
        try {
          await api.post('/family', { family_members: members });
        } catch (err) {
          console.warn('Family save failed (profile may not exist yet):', err.message);
        }
      }
    } finally {
      setSaving(false);
    }

    navigate('/preview', { state: { ...prevData, family } });
  };

  const renderField = (value, onChange, options, placeholder) => (
    <div className="flex gap-2 w-full">
      <input
        type="text"
        placeholder={placeholder}
        className="border border-gray-300 p-2 rounded w-full text-base focus:outline-none focus:ring-2 focus:ring-yellow-500"
        required
        value={value}
        onChange={onChange}
      />
      <select
        className="border border-gray-300 p-2 rounded w-full text-base bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
        onChange={onChange}
        value=""
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex flex-col items-center py-10 px-4">
        <div className="w-full md:w-3/4 lg:w-2/3 overflow-hidden rounded-t-lg shadow-lg">
          <img src="/image/s34.jpg" alt="Family" className="w-full h-[400px] object-cover rounded-t-lg" />
        </div>

        <form
          className="w-full md:w-3/4 lg:w-2/3 bg-white shadow-2xl rounded-b-lg p-6 md:p-10 space-y-10"
          onSubmit={handleSubmit}
        >
          <h2 className="text-3xl font-bold text-center text-red-700">About Family</h2>

          {['father', 'mother'].map((role) => (
            <div key={role}>
              <h3 className="text-xl font-semibold text-yellow-800 mb-3 capitalize">{role}'s Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder={`${role.charAt(0).toUpperCase() + role.slice(1)}'s Name`}
                  className="border border-gray-300 p-2 rounded w-full text-base focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                  value={family[role].name}
                  onChange={(e) => handleChange(role, null, 'name', e.target.value)}
                />
                {renderField(
                  family[role].job,
                  (e) => handleChange(role, null, 'job', e.target.value),
                  getJobOptions(role),
                  'Job'
                )}
                {renderField(
                  family[role].occupation,
                  (e) => handleChange(role, null, 'occupation', e.target.value),
                  occupations,
                  'Occupation'
                )}
                {renderField(
                  family[role].qualification,
                  (e) => handleChange(role, null, 'qualification', e.target.value),
                  qualifications,
                  'Qualification'
                )}
              </div>
            </div>
          ))}

          {['brothers', 'sisters'].map((relation) => (
            <div key={relation}>
              <h3 className="text-xl font-semibold text-yellow-800 mb-3 capitalize">{relation}</h3>
              <div className="space-y-4">
                {family[relation].map((person, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center bg-gray-50 p-4 rounded shadow-sm">
                    <input
                      type="text"
                      placeholder={`${relation.slice(0, -1)} ${idx + 1} Name`}
                      className="border border-gray-300 p-2 rounded w-full text-base focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      required
                      value={person.name}
                      onChange={(e) => handleChange(relation, idx, 'name', e.target.value)}
                    />
                    {renderField(
                      person.job,
                      (e) => handleChange(relation, idx, 'job', e.target.value),
                      getJobOptions(relation),
                      'Job'
                    )}
                    {renderField(
                      person.occupation,
                      (e) => handleChange(relation, idx, 'occupation', e.target.value),
                      occupations,
                      'Occupation'
                    )}
                    {renderField(
                      person.qualification,
                      (e) => handleChange(relation, idx, 'qualification', e.target.value),
                      qualifications,
                      'Qualification'
                    )}
                  </div>
                ))}

                <div className="flex gap-2 mt-2">
                  <button type="button" onClick={() => addMember(relation)} className="bg-green-600 text-white text-sm px-2 py-1 rounded-md hover:bg-green-700 transition">+ Add</button>
                  <button
                    type="button"
                    onClick={() => removeMember(relation, family[relation].length - 1)}
                    className="bg-red-600 text-white text-sm px-2 py-1 rounded-md hover:bg-red-700 transition"
                    disabled={family[relation].length === 1}
                  >
                    − Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition"
            >
              ← Back
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-red-800 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Fmprof;







//     import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import Footer from '../components/Footer';

// /* ----- option lists ----- */
// const generalJobs = ['Private Sector','Government','Business','Not Working'];
// const occupations = [
//   'Software Engineer','Civil Engineer','Mechanical Engineer','Electrical Engineer','Electronics Engineer',
//   'Data Scientist','Doctor','Teacher','Accountant','Lawyer','Banker','Professor','Designer','Pharmacist',
//   'Police','Army Personnel','IAS','State PCS','SSC CGL Officer','SSC CHSL Clerk','JE (Junior Engineer)',
//   'AE (Assistant Engineer)','Marketing Manager','Human Resources','Pilot','Journalist','Architect','Scientist','None'
// ];
// const qualifications = [
//   'PhD','Postgraduate','MCom','MA','MBA','MBBS','CA','Journalism','LLB','LLM','BTech','BSc','BCom','BBA','BA',
//   'B.Ed','MPharma','BPharma','Pharmacy','Dentist','Agriculture','Hospitality','Undergraduate','Diploma','ITI',
//   'Higher Secondary (12th)','11th','Secondary (10th)','None'
// ];

// const Fmprof = () => {
//   const navigate                = useNavigate();
//   const { state: prevData = {} } = useLocation();   // Box + Rels + Car data

//   /* guard direct entry */
//   useEffect(() => {
//     if (!prevData?.firstName) navigate('/box');
//   }, [prevData, navigate]);

//   /* local state */
//   const [family, setFamily] = useState({
//     father  : { name: '', job: '', occupation: '', qualification: '' },
//     mother  : { name: '', job: '', occupation: '', qualification: '' },
//     brothers: [{ name: '', job: '', occupation: '', qualification: '' }],
//     sisters : [{ name: '', job: '', occupation: '', qualification: '' }]
//   });

//   /* helpers */
//   const handleChange = (type, index, field, value) => {
//     if (type === 'father' || type === 'mother') {
//       setFamily({ ...family, [type]: { ...family[type], [field]: value } });
//     } else {
//       const updated      = [...family[type]];
//       updated[index][field] = value;
//       setFamily({ ...family, [type]: updated });
//     }
//   };

//   const addMember    = (type) => setFamily({ ...family, [type]: [...family[type], { name:'', job:'', occupation:'', qualification:'' }] });
//   const removeMember = (type, idx) => {
//     const updated = [...family[type]];
//     updated.splice(idx, 1);
//     setFamily({ ...family, [type]: updated });
//   };

//   const getJobOptions = (role) => {
//     if (role === 'father' || role === 'brothers') return [...generalJobs, 'Farmer'];
//     if (role === 'mother' || role === 'sisters')  return [...generalJobs, 'Housewife'];
//     return generalJobs;
//   };

//   /* submit */
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!e.target.checkValidity()) return e.target.reportValidity();
//     /* forward everything to Preview */
//     navigate('/preview', { state: { ...prevData, family } });
//   };

//   /* reusable combo input */
//   const renderField = (value, onChange, options, placeholder) => (
//     <div className="flex gap-2 w-full">
//       <input
//         type="text"
//         placeholder={placeholder}
//         className="border border-gray-300 p-2 rounded w-full text-base focus:outline-none focus:ring-2 focus:ring-yellow-500"
//         required
//         value={value}
//         onChange={onChange}
//       />
//       <select
//         className="border border-gray-300 p-2 rounded w-full text-base bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
//         onChange={onChange}
//         value=""
//       >
//         <option value="">Select</option>
//         {options.map((opt) => (
//           <option key={opt} value={opt}>{opt}</option>
//         ))}
//       </select>
//     </div>
//   );

//   /* JSX */
//   return (
//     <div className="bg-gray-100 min-h-screen">
//       <div className="flex flex-col items-center py-10 px-4">

//         {/* banner */}
//         <div className="w-full md:w-3/4 lg:w-2/3 overflow-hidden rounded-t-lg shadow-lg">
//           <img src="/image/s34.jpg" alt="Family" className="w-full h-[400px] object-cover rounded-t-lg" />
//         </div>

//         {/* form */}
//         <form
//           className="w-full md:w-3/4 lg:w-2/3 bg-white shadow-2xl rounded-b-lg p-6 md:p-10 space-y-10"
//           onSubmit={handleSubmit}
//         >
//           <h2 className="text-3xl font-bold text-center text-red-700">About Family</h2>

//           {/* father / mother */}
//           {['father', 'mother'].map((role) => (
//             <div key={role}>
//               <h3 className="text-xl font-semibold text-yellow-800 mb-3 capitalize">{role}'s Details</h3>
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                 <input
//                   type="text"
//                   placeholder={`${role.charAt(0).toUpperCase() + role.slice(1)}'s Name`}
//                   className="border border-gray-300 p-2 rounded w-full text-base focus:outline-none focus:ring-2 focus:ring-yellow-500"
//                   required
//                   value={family[role].name}
//                   onChange={(e) => handleChange(role, null, 'name', e.target.value)}
//                 />
//                 {renderField(
//                   family[role].job,
//                   (e) => handleChange(role, null, 'job', e.target.value),
//                   getJobOptions(role),
//                   'Job'
//                 )}
//                 {renderField(
//                   family[role].occupation,
//                   (e) => handleChange(role, null, 'occupation', e.target.value),
//                   occupations,
//                   'Occupation'
//                 )}
//                 {renderField(
//                   family[role].qualification,
//                   (e) => handleChange(role, null, 'qualification', e.target.value),
//                   qualifications,
//                   'Qualification'
//                 )}
//               </div>
//             </div>
//           ))}

//           {/* brothers / sisters */}
//           {['brothers', 'sisters'].map((relation) => (
//             <div key={relation}>
//               <h3 className="text-xl font-semibold text-yellow-800 mb-3 capitalize">{relation}</h3>
//               <div className="space-y-4">
//                 {family[relation].map((person, idx) => (
//                   <div
//                     key={idx}
//                     className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center bg-gray-50 p-4 rounded shadow-sm"
//                   >
//                     <input
//                       type="text"
//                       placeholder={`${relation.slice(0, -1)} ${idx + 1} Name`}
//                       className="border border-gray-300 p-2 rounded w-full text-base focus:outline-none focus:ring-2 focus:ring-yellow-500"
//                       required
//                       value={person.name}
//                       onChange={(e) => handleChange(relation, idx, 'name', e.target.value)}
//                     />
//                     {renderField(
//                       person.job,
//                       (e) => handleChange(relation, idx, 'job', e.target.value),
//                       getJobOptions(relation),
//                       'Job'
//                     )}
//                     {renderField(
//                       person.occupation,
//                       (e) => handleChange(relation, idx, 'occupation', e.target.value),
//                       occupations,
//                       'Occupation'
//                     )}
//                     {renderField(
//                       person.qualification,
//                       (e) => handleChange(relation, idx, 'qualification', e.target.value),
//                       qualifications,
//                       'Qualification'
//                     )}
//                   </div>
//                 ))}

//                 <div className="flex gap-2 mt-2">
//                   <button
//                     type="button"
//                     onClick={() => addMember(relation)}
//                     className="bg-green-600 text-white text-sm px-2 py-1 rounded-md hover:bg-green-700 transition"
//                   >
//                     + Add
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => removeMember(relation, family[relation].length - 1)}
//                     className="bg-red-600 text-white text-sm px-2 py-1 rounded-md hover:bg-red-700 transition"
//                     disabled={family[relation].length === 1}
//                   >
//                     − Remove
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}

//           {/* buttons */}
//           <div className="flex justify-center gap-4">
//             <button
//               type="button"
//               onClick={() => navigate(-1)}
//               className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition"
//             >
//               ← Back
//             </button>
//             <button
//               type="submit"
//               className="bg-red-800 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition"
//             >
//               Continue
//             </button>
//           </div>
//         </form>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Fmprof;
