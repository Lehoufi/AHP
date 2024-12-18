'use client'
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Steps() {




  const buttonStyles = 'bg-[#f9f9f9] dark:bg-[#000000fc]   text px-3 py-1  font-semibold rounded-full ';

  return (
<>
<section className="py-9 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
  <div className="container mx-auto text-center">
    <h2 className="text-2xl font-semibold mb-4">
      Why Us?
    </h2>

    <p className="text-lg mb-4 max-w-2xl mx-auto leading-relaxed">
      We offer a streamlined decision-making process that saves you time and money. Our tool generates a detailed report with graphs to help visualize the results.
    </p>

    <p className="text-lg mb-4 max-w-2xl mx-auto leading-relaxed">
      Plus, test the sensitivity of each criterion and see how it impacts the final decision, ensuring robust and informed choices.
    </p>
  </div>
</section>


   {/* <section className="py-10 bg-gray-100">
   <div className="container mx-auto">
       <h2 className="text-3xl font-semibold text-center text-gray-800">Steps in the AHP Method</h2>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          
           <div className="bg-white p-6 rounded-lg shadow-md">
               <h3 className="text-xl font-bold text-blue-500">1. Define the Problem</h3>
               <p className="mt-2 text-gray-600">
                   Clearly state the decision-making goal or problem to be solved.
               </p>
           </div>
           
           <div className="bg-white p-6 rounded-lg shadow-md">
               <h3 className="text-xl font-bold text-blue-500">2. Structure the Hierarchy</h3>
               <p className="mt-2 text-gray-600">
                   Break down the problem into a hierarchy of goals, criteria, and alternatives.
               </p>
           </div>
         
           <div className="bg-white p-6 rounded-lg shadow-md">
               <h3 className="text-xl font-bold text-blue-500">3. Pairwise Comparisons</h3>
               <p className="mt-2 text-gray-600">
                   Compare criteria and alternatives in pairs to establish their relative importance.
               </p>
           </div>
           
           <div className="bg-white p-6 rounded-lg shadow-md">
               <h3 className="text-xl font-bold text-blue-500">4. Calculate Priorities</h3>
               <p className="mt-2 text-gray-600">
                   Use mathematical calculations to determine the weights of each criterion.
               </p>
           </div>
         
           <div className="bg-white p-6 rounded-lg shadow-md">
               <h3 className="text-xl font-bold text-blue-500">5. Synthesize Results</h3>
               <p className="mt-2 text-gray-600">
                   Combine the weights and evaluate the alternatives to make a decision.
               </p>
           </div>
       </div>
   </div>
    </section> */}
</>
  );
}