import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

import abi from './contract/abi.json';

const contractAddress = '0x36c33F7Ce6427A7B87189E2668F6C68F7710c93e'; // Replace with your actual contract address

const SmartContract = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [stdID, setStdID] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [allStudents, setAllStudents] = useState([]);

  //connect metamask
  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        try {
          // Request accounts if not available
          const accs = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setAccounts(accs);
        } catch (error) {
          console.error('Error fetching accounts:', error);
        }
      } else {
        console.error('MetaMask not detected. Please install MetaMask.');
      }
    };

    initWeb3();
  }, []);

  //connect contractAddress
  useEffect(() => {
    if (web3) {
      const myContract = new web3.eth.Contract(abi, contractAddress);
      setContract(myContract);
    }
  }, [web3]);

  const fetchDataFromContract = async () => {
    try {
      if (web3 && contract) {
        const result = await contract.methods.getAllStudents().call();
        setAllStudents(result);
      }
    } catch (error) {
      console.error('Error fetching data from smart contract:', error.message);
      console.error('Error details:', error);
    }
  };

  const handleFetchData = (e) => {
    e.preventDefault();
    fetchDataFromContract();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (contract && accounts.length > 0) {
      try {
        await contract.methods.add(stdID, name, age).send({ from: accounts[0] });
        console.log('Transaction successful');
      } catch (error) {
        console.error('Error submitting transaction:', error);
      }
    } else {
      console.error('Contract or accounts not available.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={stdID}
          onChange={(e) => setStdID(e.target.value)}
          placeholder="Enter stdID"
        />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
        />
        <input
          type="text"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Enter age"
        />
        <button type="submit">Submit</button>
      </form>

      <div>
        <button onClick={handleFetchData}>Fetch All Students</button>
        {allStudents.length > 0 && (
          <div>
            <h2>All Students</h2>
            <ul>
              {allStudents.map((student, index) => (
                <li key={index}>
                  <p>Name: {student.name}</p>
                  <p>Age: {student.age.toString()}</p> {/* Remove .toNumber() */}
                </li>
              ))}

            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartContract;
