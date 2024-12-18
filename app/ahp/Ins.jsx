'use client';
import React, { useState, useEffect } from 'react';
import Tree from 'react-d3-tree';
import { motion } from 'framer-motion';
import FixedTree from './Fixedtree';

export default function InteractiveTree() {
  const [treeData, setTreeData] = useState([{ name: 'Goal', children: [] }]);
  const [isCriteriaModalOpen, setIsCriteriaModalOpen] = useState(false);
  const [criteria, setCriteria] = useState(['']);
  const [currentNode, setCurrentNode] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isAlternativesModalOpen, setIsAlternativesModalOpen] = useState(false);
  const [alternatives, setAlternatives] = useState(['']);
  const [isFinished, setIsFinished] = useState(false); 
  const [isstarted, setisstarted] = useState(false); 
  const handleFinish = () => {
    console.log('Finished! Logging entire tree structure:', treeData);
    console.log('Alternatives entered:', alternatives);
  
    // Clone the tree data to avoid mutating the original tree
    const newTree = JSON.parse(JSON.stringify(treeData));
  
    // Add level to each node recursively
    const addLevelToTree = (nodes, currentLevel = 0) => {
      nodes.forEach((node) => {
        node.level = currentLevel; // Set the current level for the node
  
        // If the node has children, recurse through them
        if (node.children && node.children.length > 0) {
          addLevelToTree(node.children, currentLevel + 1);
        } else {
          // If it's the last level, add alternatives
          alternatives.forEach((alternative) => {
            node.children = node.children || []; // Ensure the 'children' array exists
            node.children.push({ name: alternative.trim(), level: currentLevel + 1 });
          });
        }
      });
    };
  
    // Add levels to the tree and alternatives to the deepest nodes
    addLevelToTree(newTree);
  
    // Update the state with the modified tree
    setTreeData(newTree);
  
    // Close the modal and mark the process as finished
    setIsAlternativesModalOpen(false);
    setIsFinished(true); // Mark as finished
  };
  
  
  

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const addNode = () => {
    if (!currentNode || criteria.some((criterion) => !criterion.trim())) {
      console.log('Missing criteria or current node');
      return;
    }

    console.log(`Adding nodes to ${currentNode.name} with criteria:`, criteria);

    const newTree = JSON.parse(JSON.stringify(treeData));

    const findAndAdd = (nodes) => {
      nodes.forEach((node) => {
        if (node.name === currentNode.name) {
          if (!node.children) node.children = [];
          criteria.forEach((criterion) => {
            node.children.push({ name: criterion.trim(), children: [] });
          });
        } else if (node.children) {
          findAndAdd(node.children);
        }
      });
    };

    findAndAdd(newTree);
    setTreeData(newTree);
    setIsCriteriaModalOpen(false);
    setCriteria(['']);
  };

  const openModal = (node) => {
    setCurrentNode(node);
    setIsCriteriaModalOpen(true);
  };

  const removeNode = (nodeToRemove) => {
    const newTree = JSON.parse(JSON.stringify(treeData));

    const findAndRemove = (nodes, parent = null) => {
      nodes.forEach((node, index) => {
        if (node.name === nodeToRemove.name) {
          parent?.children.splice(index, 1);
        } else if (node.children) {
          findAndRemove(node.children, node);
        }
      });
    };

    if (newTree[0].name === nodeToRemove.name) {
      alert('Cannot remove the root goal node!');
      return;
    }

    findAndRemove(newTree);
    setTreeData(newTree);
  };

  const renderCustomNode = ({ nodeDatum }) => {
    const rectWidth = 70;
    const rectHeight = 30;
    const rectX = -rectWidth / 2; // Center the rectangle horizontally
    const rectY = -rectHeight / 2; // Center the rectangle vertically

    return (
      <g>
        {/* Rectangle (node background) */}
        <motion.rect
          x={rectX}
          y={rectY}
          width={rectWidth}
          height={rectHeight}
          rx="10"
          ry="10"
          fill="lightblue"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Node name (text) */}
        <motion.text
          x="0"
          y="2" // Center the text vertically within the rectangle
          textAnchor="middle"
          alignmentBaseline="middle"
          style={{ fontSize: '18px', fill: 'black' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {nodeDatum.name}
        </motion.text>

        {/* Remove node button */}
        {nodeDatum.name !== 'Goal' && (
          <foreignObject x="-0" y={rectY - 20} width="40" height="40">
            <button
              onClick={() => removeNode(nodeDatum)}
              style={{
                backgroundColor: 'white',
                color: 'white',
                borderRadius: '5px',
                border: 'none',
                cursor: 'pointer',
                width: '20px',
                height: '20px',
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ff0000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9.17065 4C9.58249 2.83481 10.6937 2 11.9999 2C13.3062 2 14.4174 2.83481 14.8292 4" stroke="#ff0000" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M20.5 6H3.49988" stroke="#ff0000" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M18.3735 15.3991C18.1965 18.054 18.108 19.3815 17.243 20.1907C16.378 21 15.0476 21 12.3868 21H11.6134C8.9526 21 7.6222 21 6.75719 20.1907C5.89218 19.3815 5.80368 18.054 5.62669 15.3991L5.16675 8.5M18.8334 8.5L18.6334 11.5" stroke="#ff0000" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M9.5 11L10 16" stroke="#ff0000" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M14.5 11L14 16" stroke="#ff0000" strokeWidth="1.5" strokeLinecap="round"></path> </g></svg>
            </button>
          </foreignObject>
        )}

        {/* Add node button */}
        <foreignObject x={rectWidth / 2 - 10} y={rectY - 20} width="20" height="20">
          <button
            onClick={() => openModal(nodeDatum)}
            style={{
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
              width: '20px',
              height: '20px',
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12.75 9C12.75 8.58579 12.4142 8.25 12 8.25C11.5858 8.25 11.25 8.58579 11.25 9L11.25 11.25H9C8.58579 11.25 8.25 11.5858 8.25 12C8.25 12.4142 8.58579 12.75 9 12.75H11.25V15C11.25 15.4142 11.5858 15.75 12 15.75C12.4142 15.75 12.75 15.4142 12.75 15L12.75 12.75H15C15.4142 12.75 15.75 12.4142 15.75 12C15.75 11.5858 15.4142 11.25 15 11.25H12.75V9Z" fill="#00ff2a"></path> </g></svg>
          </button>
        </foreignObject>
      </g>
    );
  };

  const handleNextClick = () => {
    setIsAlternativesModalOpen(true);
  };



  if (!isMounted) {
    return null;
  }

  return (
    <div className="h-[98vh]">
    {isstarted ? (
      <>
        {!isFinished && (
          <div className="w-full h-full p-4">
            <div className="border rounded h-full ">
              <Tree
                data={treeData}
                orientation="vertical"
                translate={{ x: 400, y: 200 }}
                renderCustomNodeElement={renderCustomNode}
                zoomable
                collapsible
                nodeSize={{ x: 140, y: 100 }}
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
            <div
              className="fixed bottom-4 right-4 rounded-full cursor-pointer"
              onClick={handleNextClick}
            >
           
<div className="">
  <div className="relative group">
    <button
      className="relative inline-block p-px font-semibold leading-6 text-white bg-gray-800 shadow-2xl cursor-pointer rounded-xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95"
    >
 

      <span className="relative z-10 block px-6 py-3 rounded-xl bg-gray-950">
        <div className="relative z-10 flex items-center space-x-2">
          <span className="transition-all duration-500 group-hover:translate-x-1"
            >Finished </span>
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
</div>

            </div>
          </div>
        )}
  
        {/* Criteria Modal */}
        {isCriteriaModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
            <div className="mx-auto max-w-lg rounded-lg border border-stone bg-stone-100 p-4 shadow-lg sm:p-6 lg:p-8">
              <div className="flex items-center gap-4">
                <span className="shrink-0 rounded-full bg-emerald-400 p-2 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </span>
                <p className="font-medium sm:text-lg text-emerald-600">Add Criterias</p>
              </div>
  
              <p className="mt-4 text-gray-600">Enter the names :</p>
              {criteria.map((criterion, index) => (
                <input
                  key={index}
                  type="text"
                  value={criterion}
                  onChange={(e) => {
                    const newCriteria = [...criteria];
                    newCriteria[index] = e.target.value;
                    setCriteria(newCriteria);
                  }}
                  className="w-full p-3 bg-gray-100 border text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 placeholder-gray-400 mb-4 transition-all"
                  placeholder={`Node name ${index + 1}`}
                />
              ))}
              <button
                onClick={() => setCriteria([...criteria, ''])}
                className="text-emerald-500 text-base mt-2"
              >
                Add another criteria
              </button>
  
              <div className="mt-6 sm:flex sm:gap-4">
              <button
                                onClick={addNode}
      className="relative inline-block p-px font-semibold leading-6 text-white bg-gray-800 shadow-2xl cursor-pointer rounded-xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95"
    >

      <span className="relative z-10 block px-3 py-1 rounded-xl bg-gray-950">
        <div className="relative z-10 flex items-center space-x-2">
          <span className="transition-all duration-500 group-hover:translate-x-1"
            >Add </span>
       <svg             className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-1"
 viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke="#fcfcfc" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" stroke="#fcfcfc" strokeWidth="1.5" strokeLinecap="round"></path> </g></svg>
        </div>
      </span>
    </button>
                <button
                  onClick={() => setIsCriteriaModalOpen(false)}
                  className="mt-2 inline-block w-full rounded-lg bg-stone-300 px-5 py-3 text-center text-sm font-semibold text-gray-800 sm:mt-0 sm:w-auto"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}
  
        {/* Alternatives Modal */}
        {isAlternativesModalOpen && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center">
            <div className="mx-auto max-w-lg rounded-lg border border-blue-600 bg-white p-4 shadow-lg sm:p-6 lg:p-8">
              <div className="flex items-center gap-4">
                <span className="shrink-0 rounded-full bg-blue-400 p-2 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </span>
                <p className="font-medium sm:text-lg text-blue-600">Enter Alternatives</p>
              </div>
  
              <p className="mt-4 text-gray-600">Enter the alternatives :</p>
              {alternatives.map((alt, index) => (
                <input
                  key={index}
                  type="text"
                  value={alt}
                  onChange={(e) => {
                    const newAlternatives = [...alternatives];
                    newAlternatives[index] = e.target.value;
                    setAlternatives(newAlternatives);
                  }}
                  className="w-full p-3 bg-gray-100 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 placeholder-gray-400 mb-4 transition-all"
                  placeholder={`Alternative ${index + 1}`}
                />
              ))}
              <button
                onClick={() => setAlternatives([...alternatives, ''])}
                className="text-blue-500 text-sm mt-2"
              >
                Add another alternative
              </button>
  
              <div className="mt-6 sm:flex sm:gap-4">
              <button
                                onClick={handleFinish}
      className="relative inline-block p-px font-semibold leading-6 text-white bg-gray-800 shadow-2xl cursor-pointer rounded-xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95"
    >

      <span className="relative z-10 block px-3 py-1 rounded-xl bg-gray-950">
        <div className="relative z-10 flex items-center space-x-2">
          <span className="transition-all duration-500 group-hover:translate-x-1"
            >Finish </span>
       <svg             className="w-6 h-6 transition-transform duration-500 group-hover:translate-x-1"
 viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8.00011 13L12.2278 16.3821C12.6557 16.7245 13.2794 16.6586 13.6264 16.2345L22.0001 6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"></path> <path fillRule="evenodd" clipRule="evenodd" d="M11.1892 12.2368L15.774 6.63327C16.1237 6.20582 16.0607 5.5758 15.6332 5.22607C15.2058 4.87635 14.5758 4.93935 14.226 5.36679L9.65273 10.9564L11.1892 12.2368ZM8.02292 16.1068L6.48641 14.8263L5.83309 15.6248L2.6 13.2C2.15817 12.8687 1.53137 12.9582 1.2 13.4C0.868627 13.8419 0.95817 14.4687 1.4 14.8L4.63309 17.2248C5.49047 17.8679 6.70234 17.7208 7.381 16.8913L8.02292 16.1068Z" fill="#ffffff"></path> </g></svg>
        </div>
      </span>
    </button>
              </div>
            </div>
          </div>
        )}
  
        {/* Display Fixed Tree when Finished */}
        {isFinished && (
          <div className="w-full h-full p-4">
            <FixedTree treeData={treeData} />
          </div>
        )}
      </>
    ) : (
      <div onClick={()=>setisstarted(true)} className="text-center text-2xl font-bold">

<div className="flex items-center justify-center h-screen">
  <div className="relative group">
    <button
      className="relative inline-block p-px font-semibold leading-6 text-white bg-gray-800 shadow-2xl cursor-pointer rounded-xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95"
    >
      <span
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      ></span>

      <span className="relative z-10 block px-6 py-3 rounded-xl bg-gray-950">
        <div className="relative z-10 flex items-center space-x-2">
          <span className="transition-all duration-500 group-hover:translate-x-1"
            >Create Project</span>
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
</div>

      </div>
    )}
  </div>
  
  );
  
  
}
