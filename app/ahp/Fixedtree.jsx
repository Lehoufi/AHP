 import React, { useEffect, useState } from 'react';
import Tree from 'react-d3-tree';
import { motion } from 'framer-motion';

const AHPTree = ({ treeData }) => {
  const [currentLevelNodes, setCurrentLevelNodes] = useState([]);
  const [formData, setFormData] = useState({}); // To track form inputs
  const [currentLevel, setCurrentLevel] = useState(null);
  const [criteriaMatrices, setCriteriaMatrices] = useState({});
  const [showMatrix, setShowMatrix] = useState(false); // Track matrix modal visibility
  const [showMatrixView, setShowMatrixView] = useState(true); // Track matrix view toggle
 
  const [levelMatrices, setLevelMatrices] = useState({
    lvl1: [], 
    lvl2: [], 
    lvl3: [], 
  });
  const [ranking,setranking]=useState(false)
  
  const sendDataToDjango = async () => {
    setranking(true); 

    try {
      const groupedLevels = groupByLevel(treeData);
      const result = combineLevelsAndMatrices(groupedLevels, levelMatrices);
      console.log(result)
      const response = await fetch('http://your-django-server-url/api/your-endpoint/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ result }), // Send the result in the body
      });
      
      if (!response.ok) {
        throw new Error('Failed to send data to the server');
      }

      const data = await response.json();
      console.log('Server Response:', data);

      // Handle the response here (if needed)
    } catch (error) {
      console.error('Error sending data to server:', error);
    }
  };

  const ahpScale = [
    { value: 1, label: 'Equal importance' },
    { value: 2, label: 'Moderate importance (2)' },
    { value: 3, label: 'Moderate importance (3)' },
    { value: 4, label: 'Moderate plus (4)' },
    { value: 5, label: 'Strong importance (5)' },
    { value: 6, label: 'Strong plus (6)' },
    { value: 7, label: 'Very strong importance (7)' },
    { value: 8, label: 'Very, very strong (8)' },
    { value: 9, label: 'Extreme importance' },
    { value: 0.5, label: '(1/2)' },
    { value: 0.33, label: '(1/3)' },
    { value: 0.25, label: '(1/4)' },
    { value: 0.2, label: '(1/5)' },
    { value: 0.17, label: '(1/6)' },
    { value: 0.14, label: '(1/7)' },
    { value: 0.12, label: '(1/8)' },
    { value: 0.11, label: '(1/9)' },
  ];

  const getNodesAtLevel = (node, level, currentLevel = 0, nodes = [], parentName = null) => {
    if (currentLevel === level) {
      nodes.push({ name: node.name, parent: parentName });
    }
    if (node.children) {
      node.children.forEach((child) =>
        getNodesAtLevel(child, level, currentLevel + 1, nodes, node.name)
      );
    }
    return nodes;
  };

 
  const openMatrixModal = (level, nodeDatum) => {
    if (level === 0) return; // Do not show matrix for "Goal" level

    const nodesAtLevel = getNodesAtLevel(treeData[0], level);
    setCurrentLevel(level);
    setShowMatrix(true); // Show matrix modal

    if (level === 1) {
      // Level 1: One matrix for criteria under the Goal
      const size = nodesAtLevel.length;
      setCriteriaMatrices({
        [level]: Array(size)
          .fill(1)
          .map((_, i) => Array(size).fill(1).map((_, j) => (i >= j ? 1 : 1 / (i + 1)))),
      });
      setCurrentLevelNodes(nodesAtLevel.map((node) => node.name));
    } else if (level === 2) {
      // Level 2: Separate matrices for each parent criterion
      const parents = [...new Set(nodesAtLevel.map((node) => node.parent))];
      const newMatrices = {};
      const childNodesByParent = {};

      parents.forEach((parent) => {
        const children = nodesAtLevel
          .filter((node) => node.parent === parent)
          .map((node) => node.name);
        childNodesByParent[parent] = children;
        newMatrices[parent] = Array(children.length)
          .fill(1)
          .map((_, i) =>
            Array(children.length)
              .fill(1)
              .map((_, j) => (i >= j ? 1 : 1 / (i + 1)))
          );
      });

      setCriteriaMatrices(newMatrices);
      setCurrentLevelNodes(childNodesByParent);
    } else if (level === 3) {
      // Level 3: Pairwise comparisons for alternatives under each subcriterion
      const subCriteriaMap = new Map();

      nodesAtLevel.forEach((node) => {
        if (!subCriteriaMap.has(node.parent)) {
          subCriteriaMap.set(node.parent, []);
        }
        subCriteriaMap.get(node.parent).push(node.name);
      });

      setCurrentLevelNodes(subCriteriaMap);
      setCriteriaMatrices(subCriteriaMap);
    } else {
      setCurrentLevelNodes(nodesAtLevel.map((node) => node.name));
    }
  };

  const handleMatrixChange = (criterionName, rowIndex, colIndex, value) => {
    setFormData((prev) => ({
      ...prev,
      [criterionName]: {
        ...(prev[criterionName] || {}),
        [rowIndex]: {
          ...(prev[criterionName]?.[rowIndex] || {}),
          [colIndex]: value,
        },
      },
    }));
  };



  const saveMatrixChanges = (currentLevel) => {
    setLevelMatrices((prevMatrices) => {
      const updatedMatrices = { ...prevMatrices };
  
      // Update static matrices based on the current level
      if (currentLevel === 1) {
        updatedMatrices.lvl1 = [
          [1, formData[0]?.[1] || 1, formData[0]?.[2] || 1],
          [1 / (formData[0]?.[1] || 1), 1, formData[1]?.[2] || 1],
          [1 / (formData[0]?.[2] || 1), 1 / (formData[1]?.[2] || 1), 1],
        ];
      } else if (currentLevel === 2) {
        updatedMatrices.lvl2 = [
          [1, formData[0]?.[1] || 1, formData[0]?.[2] || 1],
          [1 / (formData[0]?.[1] || 1), 1, formData[1]?.[2] || 1],
          [1 / (formData[0]?.[2] || 1), 1 / (formData[1]?.[2] || 1), 1],
        ];
      } else if (currentLevel === 3) {
        updatedMatrices.lvl3 = [
          [1, formData[0]?.[1] || 1, formData[0]?.[2] || 1],
          [1 / (formData[0]?.[1] || 1), 1, formData[1]?.[2] || 1],
          [1 / (formData[0]?.[2] || 1), 1 / (formData[1]?.[2] || 1), 1],
        ];
      }
  
      return updatedMatrices;
    });
  
    setShowMatrix(false);
  
    // Function to extract lower triangle values and return them as an array
    const extractLowerTriangle = (tableId) => {
      const table = document.getElementById(tableId);
      if (!table) return [];
  
      const rows = table.querySelectorAll('tr');
      const lowerTriangleValues = [];
  
      rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll('td');
        for (let colIndex = 0; colIndex <= rowIndex; colIndex++) {
          if (cells[colIndex]) {
            const cellValue = parseFloat(cells[colIndex].textContent.trim());
            if (!isNaN(cellValue)) {
              lowerTriangleValues.push(cellValue);
            }
          }
        }
      });
  
      return lowerTriangleValues;
    };
  
    let separatedValues = [];
    let combinedValues = [];
  
    // Extract values based on the current level and store them in `separatedValues`
    if (currentLevel === 1) {
      separatedValues = [extractLowerTriangle('1')];
    } else if (currentLevel === 2) {
      for (let i = 1; i <= 11; i++) {
        const tableId = `2_${i}`;
        const tableValues = extractLowerTriangle(tableId);
        if (tableValues.length > 0) separatedValues.push(tableValues);
      }
    } else if (currentLevel === 3) {
      for (let i = 1; i <= 11; i++) {
        const tableId = `3_${i}`;
        const tableValues = extractLowerTriangle(tableId);
        if (tableValues.length > 0) separatedValues.push(tableValues);
      }
    }
  
    // Optionally combine all values if needed
    combinedValues = separatedValues.flat();
  
    // Log extracted values
    console.log('Separated values: ', separatedValues);
    console.log('Combined values: ', combinedValues);
  
    // Update state with separated values
    setLevelMatrices((prevMatrices) => {
      const newMatrices = {
        ...prevMatrices,
        [`lvl${currentLevel}`]: separatedValues,
      };
  
      // Remove empty levels dynamically
      Object.keys(newMatrices).forEach((key) => {
        if (newMatrices[key].length === 0) {
          delete newMatrices[key];
        }
      });
  
      return newMatrices;
    });
  };
  
  const groupByLevel = (treeData) => {
    const groupedLevels = {};

    const traverse = (node, level) => {
        if (!groupedLevels[level]) groupedLevels[level] = [];
        groupedLevels[level].push(node.name);

        if (node.children) {
            node.children.forEach((child) => traverse(child, level + 1));
        }
    };

    treeData.forEach((node) => traverse(node, 0));
    return groupedLevels;
};

// Combine grouped levels with matrices
const combineLevelsAndMatrices = (groupedLevels, matrices) => {
    const formatted = {};

    Object.keys(groupedLevels).forEach((level) => {
        let levelKey = groupedLevels[level];

        // Remove duplicates in level names
        levelKey = [...new Set(levelKey)];

        if (level === "0") {
            // Assign goal level to [0]
            formatted[levelKey[0]] = [0];
        } else {
            const matrixKey = matrices[`lvl${+level}`]; // lvl1, lvl2, etc.
            if (matrixKey) {
                formatted[levelKey.join(",")] = matrixKey;
            }
        }
    });

    return formatted;
};



// Group nodes by level and log the result



  



  const toggleMatrixView = () => {
    setShowMatrixView((prev) => !prev);
  };
  
  const CustomNodeElement = ({ nodeDatum }) => {
    const textPadding = 30; // Padding for better spacing around the text
    const rectHeight = 40; // Height for better visibility
    const textLength = nodeDatum.name.length; // Length of the node's name
    const rectWidth = Math.max(textLength * 19 + textPadding, 120); // Adjust width based on text length, with a minimum width of 120
    const rectX = -rectWidth / 2; // Center the rectangle horizontally
    const rectY = -rectHeight / 2; // Center the rectangle vertically

    return (
        <motion.g
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Rectangle (node background) */}
            <motion.rect
                x={rectX}
                y={rectY}
                width={rectWidth}
                height={rectHeight}
                rx="12" // Rounded corners
                ry="12"
                fill="#7BD3EA" // Light blue background
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            />

            {/* Node name (text) */}
            <motion.text
                x="0" // Centered horizontally
                y="3" // Adjusted to vertically center within the rectangle
                textAnchor="middle"
                alignmentBaseline="middle"
                style={{ fontSize: '18px', fill: 'black', fontWeight: 'normal' }} // Style for text
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {nodeDatum.name}
            </motion.text>

            {/* Button for non-zero level nodes */}
            {nodeDatum.level !== 0 && (
                <foreignObject x="15" y="30" width="140" height="140">
                    <button
                        className="text-white text-xs px-1 py-1 hover:bg-blue-600/30 rounded-md-lg -z-10 transition"
                        onClick={() => openMatrixModal(nodeDatum.level, nodeDatum)}
                    >
                        <svg
                            className="w-6"
                            fill="#000000"
                            viewBox="0 0 32 32"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path d="M0.844 0.735v30.531h2.197v0.735h-3.041v-32h3.041v0.735zM10.235 10.412v1.547h0.041c0.412-0.595 0.912-1.047 1.489-1.371 0.579-0.323 1.251-0.484 2-0.484 0.719 0 1.38 0.141 1.975 0.417 0.599 0.281 1.047 0.776 1.359 1.479 0.339-0.5 0.803-0.943 1.38-1.323 0.579-0.38 1.267-0.573 2.063-0.573 0.604 0 1.161 0.073 1.677 0.224 0.521 0.145 0.959 0.38 1.328 0.703 0.365 0.329 0.651 0.751 0.86 1.272 0.203 0.52 0.307 1.151 0.307 1.891v7.635h-3.129v-6.468c0-0.381-0.016-0.745-0.048-1.084-0.020-0.307-0.099-0.604-0.239-0.88-0.131-0.251-0.333-0.459-0.584-0.593-0.255-0.152-0.609-0.224-1.047-0.224-0.443 0-0.797 0.083-1.068 0.249-0.265 0.167-0.489 0.396-0.64 0.667-0.161 0.287-0.265 0.604-0.308 0.927-0.052 0.349-0.077 0.699-0.083 1.048v6.359h-3.131v-6.401c0-0.339-0.005-0.672-0.025-1-0.011-0.317-0.073-0.624-0.193-0.916-0.104-0.281-0.301-0.516-0.552-0.672-0.255-0.167-0.636-0.255-1.136-0.255-0.151 0-0.348 0.031-0.588 0.099-0.24 0.067-0.479 0.192-0.703 0.375-0.229 0.188-0.428 0.453-0.589 0.797-0.161 0.343-0.239 0.796-0.239 1.359v6.62h-3.131v-11.421zM31.156 31.265v-30.531h-2.197v-0.735h3.041v32h-3.041v-0.735z"></path>
                            </g>
                        </svg>
                    </button>
                </foreignObject>
            )}
        </motion.g>
    );
};


return (
  <>
    {!ranking ? (
  <div className="relative">

  <div className="border border-gray-300 rounded-md-lg p-4" style={{ height: '666px' }}>
  <Tree
data={treeData}
renderCustomNodeElement={CustomNodeElement}
orientation="vertical"
nodeSize={{ x: 140, y: 100 }}
translate={{ x: 400, y: 200 }}
zoomable
collapsible
separation={{ siblings: 1, nonSiblings: 2 }}
pathFunc={(linkData, orientation) => {
  const { source, target } = linkData;
  if (orientation === 'vertical') {
    return `M${source.x},${source.y} L${source.x},${target.y} L${target.x},${target.y}`;
  }
  return `M${source.x},${source.y} L${target.x},${source.y} L${target.x},${target.y}`;
}}
/>

  </div>
  <div className="relative group">
<button
        onClick={sendDataToDjango}
        className=" absolute right-4 bottom-4 inline-block p-px font-semibold leading-6 text-white bg-gray-800 shadow-2xl cursor-pointer rounded-xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95"
>


  <span className="relative z-10 block px-6 py-3 rounded-xl bg-gray-950">
    <div className="relative z-10 flex items-center space-x-2">
      <span className="transition-all duration-500 group-hover:translate-x-1"
        >Get ranking  </span>
      <svg
        className="w-6 h-6 transition-transform duration-500 group-hover:translate-x-1"
        data-slot="icon"
        aria-hidden="true"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          clipRule="evenodd"
          d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
          fillRule="evenodd"
        ></path>
      </svg>
    </div>
  </span>
</button>
</div>

  {showMatrix && (
<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
<div className="bg-white dark:bg-slate-900 dark:text-white p-6 rounded-md-lg shadow-lg  w-3/4 max-w-4xl max-h-[70vh] overflow-y-auto">
  <h3 className="text-2xl font-semibold mb-4 text-center">
    {currentLevel === 2
      ? 'Pairwise Comparison for Alternatives with Each Criterion'
      : currentLevel === 3
      ? 'Pairwise Comparison for Alternatives with Subcriteria'
      : `Pairwise Comparison Matrix for Level ${currentLevel || 'undefined'}`}
  </h3>

  {currentLevel === 1 ? (
<table className="table-auto w-full border-collapse text-base" id={currentLevel}>
<thead>
  <tr className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
    <th className="border p-3"></th>
    {currentLevelNodes.map((node, index) => (
      <th key={index} className="border p-3">
        {node}
      </th>
    ))}
  </tr>
</thead>
<tbody>
  {currentLevelNodes.map((rowName, rowIndex) => (
    <tr key={rowIndex} className="even:bg-gray-50 dark:even:bg-gray-700">
      <th className="border p-3 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
        {rowName}
      </th>
      {currentLevelNodes.map((_, colIndex) => (
        <td key={colIndex} className="border p-3 text-center">
          {rowIndex >= colIndex ? (
            <span>{(1 / formData[currentLevel]?.[colIndex]?.[rowIndex] || 1).toFixed(2)}</span>
          ) : (
            <select
              className="border  border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
              value={formData[currentLevel]?.[rowIndex]?.[colIndex] || 1}
              onChange={(e) =>
                handleMatrixChange(
                  currentLevel,
                  rowIndex,
                  colIndex,
                  parseFloat(e.target.value)
                )
              }
            >
              {ahpScale.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          )}
         </td>
      ))}
    </tr>
  ))}
</tbody>
</table>
) : currentLevel === 2 ? (
Object.keys(currentLevelNodes).map((parent,index) => (
<div key={parent} className="mb-6">
  <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
    Criterion: {parent}
  </h4>
  <table className="table-auto w-full border-collapse text-base" id={`${currentLevel}_${index + 1}`}>
    <thead>
      <tr className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
        <th className="border p-3"></th>
        {currentLevelNodes[parent].map((child, index) => (
          <th key={index} className="border p-3">
            {child}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {currentLevelNodes[parent].map((rowName, rowIndex) => (
        <tr key={rowIndex} className="even:bg-gray-50 dark:even:bg-gray-700">
          <th className="border p-3 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
            {rowName}
          </th>
          {currentLevelNodes[parent].map((_, colIndex) => (
            <td key={colIndex} className="border p-3 text-center">
              {rowIndex >= colIndex ? (
                <span>{(1 / formData[parent]?.[colIndex]?.[rowIndex] || 1).toFixed(2)}</span>
              ) : (
                <select
                  className="border  border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                  value={formData[parent]?.[rowIndex]?.[colIndex] || 1}
                  onChange={(e) =>
                    handleMatrixChange(
                      parent,
                      rowIndex,
                      colIndex,
                      parseFloat(e.target.value)
                    )
                  }
                >
                  {ahpScale.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              )}
             </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
</div>
))
) : currentLevel === 3 ? (
Array.from(currentLevelNodes).map(([parent, alts],index) => (
<div key={parent} className="mb-6">
  <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
    Subcriterion: {parent}
  </h4>
  <table className="table-auto w-full border-collapse text-base" id={`${currentLevel}_${index + 1}`}>
    <thead>
      <tr className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
        <th className="border p-3"></th>
        {alts.map((alt, index) => (
          <th key={index} className="border p-3">
            {alt}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {alts.map((altName, rowIndex) => (
        <tr key={rowIndex} className="even:bg-gray-50 dark:even:bg-gray-700">
          <th className="border p-3 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
            {altName}
          </th>
          {alts.map((_, colIndex) => (
            <td key={colIndex} className="border p-3 text-center">
              {rowIndex >= colIndex ? (
                <span>{(1 / formData[parent]?.[colIndex]?.[rowIndex] || 1).toFixed(2)}</span>
              ) : (
                <select
                  className="border  border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                  value={formData[parent]?.[rowIndex]?.[colIndex] || 1}
                  onChange={(e) =>
                    handleMatrixChange(
                      parent,
                      rowIndex,
                      colIndex,
                      parseFloat(e.target.value)
                    )
                  }
                >
                  {ahpScale.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              )}
             </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
</div>
))
) : null}



  <div className="mt-6 fx justify-center">

<button
          onClick={() => saveMatrixChanges(currentLevel)}
          className="cursor-pointer text-center text-zinc-200 flex gap-2 items-center bg-black px-4 py-2 rounded-lg font-medium text-sm hover:bg-[#111] transition-all ease-in duration-200"
>
<svg className='w-6' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20.1497 7.93997L8.27971 19.81C7.21971 20.88 4.04971 21.3699 3.27971 20.6599C2.50971 19.9499 3.06969 16.78 4.12969 15.71L15.9997 3.84C16.5478 3.31801 17.2783 3.03097 18.0351 3.04019C18.7919 3.04942 19.5151 3.35418 20.0503 3.88938C20.5855 4.42457 20.8903 5.14781 20.8995 5.90463C20.9088 6.66146 20.6217 7.39189 20.0997 7.93997H20.1497Z" stroke="#fafafa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M21 21H12" stroke="#fafafa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
Save matrix
</button>

  </div>
</div>
</div>
)}








</div>    ) : (
      <div className="flex items-center space-x-2 justify-center h-[70%] flex-col gap-5">
    <span className="text-2xl font-semibold text-gray-700 animate-pulse">Now calculating ranking...</span> 
    <div className="loader">
<div className="loader-square"></div>
<div className="loader-square"></div>
<div className="loader-square"></div>
<div className="loader-square"></div>
<div className="loader-square"></div>
<div className="loader-square"></div>
<div className="loader-square"></div>
</div>    </div>
    
    )}
  </>
);

};

export default AHPTree;
