import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { FaQuoteLeft } from "react-icons/fa";
import "swiper/css";
import { api } from '../services/api';

const Prsn = () => {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/stories');
        if (res.success && res.data.length) {
          setStories(res.data.map((s) => ({
            name: s.couple_names,
            image: s.image_url || '/image/s1.jpg',
            description: s.story,
          })));
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <div className="py-16 px-4 md:px-20 bg-rose-50">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-gray-800">5 Million Success Stories 💖</h2>
        <p className="text-lg text-gray-600 mt-2">Hear from our happy couples who found their soulmates.</p>
      </div>

      <div className="relative">
        {stories.length === 0 ? (
          <p className="text-center text-gray-500">No stories yet.</p>
        ) : (
          <Swiper
            modules={[Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
          >
            {stories.map((story, index) => (
              <SwiperSlide key={index}>
                <div className="bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 h-[420px] flex flex-col">
                  <img src={story.image} alt={story.name} className="w-full h-48 object-cover" />
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-rose-600 mb-3">{story.name}</h3>
                    <div className="flex text-gray-600">
                      <FaQuoteLeft className="text-rose-200 text-2xl flex-shrink-0 mr-3 mt-1" />
                      <p className="text-sm line-clamp-4">{story.description}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
};

export default Prsn;




// import React from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay } from "swiper/modules";
// import { FaQuoteLeft } from "react-icons/fa"; // Icon import karein
// import "swiper/css";

// // Success stories ka data
// const stories = [
//   {
//     name: "Shubham & Shruti",
//     image: "/image/s1.jpg",
//     description:
//       "Shubham and Shruti’s journey from strangers to life partners is a heartwarming tale of modern love facilitated by First marriage...",
//   },
//   {
//     name: "Habeeba & Alikhan",
//     image: "/image/s2.jpg",
//     description:
//       "I have married with Syed Habeeba from Nellore on 4.7.2024 Thursday, Thank you First marriage owner and supporting all staffs.",
//   },
//   {
//     name: "Pinkey & Nikhil",
//     image: "/image/s3.jpg",
//     description:
//       "We had met in Ayodhya first time April 2022. After completing a year, a lot of fight and love then we decided to marry.",
//   },
//   {
//     name: "Ravi & Anjali",
//     image: "/image/s4.jpg",
//     description:
//       "Our journey started with First marriage and ended with us being happily married since 2023.",
//   },
//   {
//     name: "Amit & Priya",
//     image: "/image/s5.jpg",
//     description:
//       "Thanks to First marriage, we found each other despite the busy city life.",
//   },
//   {
//     name: "Karan & Meera",
//     image: "/image/s6.jpg",
//     description:
//       "Thanks to First marriage – we highly recommend this platform to anyone looking for companionship.",
//   },
// ];

// const Prsn = () => {
//   return (
//     // Section ke liye halka gulabi background aur zyada padding
//     <div className="py-16 px-4 md:px-20 bg-rose-50">
//       <div className="text-center mb-12">
//         <h2 className="text-4xl font-extrabold text-gray-800">
//           5 Million Success Stories 💖
//         </h2>
//         <p className="text-lg text-gray-600 mt-2">
//           Hear from our happy couples who found their soulmates.
//         </p>
//       </div>

//       <div className="relative">
//         <Swiper
//           modules={[Autoplay]}
//           spaceBetween={30} // Cards ke beech thoda zyada space
//           slidesPerView={1}
//           loop={true}
//           autoplay={{
//             delay: 4000,
//             disableOnInteraction: false,
//             pauseOnMouseEnter: true,
//           }}
//           breakpoints={{
//             768: {
//               slidesPerView: 2,
//             },
//             1024: {
//               slidesPerView: 3,
//             },
//           }}
//         >
//           {stories.map((story, index) => (
//             <SwiperSlide key={index}>
//               {/* Card ke liye behtar styling aur hover effect */}
//               <div className="bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 h-[420px] flex flex-col">
//                 <img
//                   src={story.image}
//                   alt={story.name}
//                   className="w-full h-48 object-cover"
//                 />
//                 <div className="p-6 flex flex-col flex-grow">
//                   <h3 className="text-xl font-bold text-rose-600 mb-3">
//                     {story.name}
//                   </h3>
//                   <div className="flex text-gray-600">
//                     <FaQuoteLeft className="text-rose-200 text-2xl flex-shrink-0 mr-3 mt-1" />
//                     <p className="text-sm line-clamp-4">
//                       {story.description}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>
//     </div>
//   );
// };

// export default Prsn;