// Replace with your contract address
const contractAddress = "0x3AfDAA4bd3DCF807bBDBbFd864871dFb92C36982";

// Replace with your contract ABI
const abi = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_question",
				"type": "string"
			},
			{
				"internalType": "string[]",
				"name": "_options",
				"type": "string[]"
			}
		],
		"name": "createSession",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "nonpayable",
		"type": "fallback"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "sessionId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "option",
				"type": "string"
			}
		],
		"name": "vote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	},
	{
		"inputs": [],
		"name": "getAllSessions",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "question",
						"type": "string"
					},
					{
						"internalType": "string[]",
						"name": "options",
						"type": "string[]"
					}
				],
				"internalType": "struct FavoriteFruitsVoting.SessionInfo[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "sessionId",
				"type": "uint256"
			}
		],
		"name": "getSessionResults",
		"outputs": [
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			},
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "sessionId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "option",
				"type": "string"
			}
		],
		"name": "getVoteCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

// Connect to the web3 provider (MetaMask)
const provider = new ethers.providers.Web3Provider(window.ethereum);

let signer;
let contract;

// Request user accounts and connect to the first account
provider.send("eth_requestAccounts", []).then(() => {
  provider.listAccounts().then((accounts) => {
    signer = provider.getSigner(accounts[0]);
    // Create a contract object
    contract = new ethers.Contract(contractAddress, abi, signer);
    console.log(contract);
  });
});

// Call createSession() in the smart contract
async function createSession() {
  const question = document.getElementById("question").value;
  const options = document.getElementById("options").value.split(",").map(option => option.trim());
  const tx = await contract.createSession(question, options);
  await tx.wait();
}

// Call vote() in the smart contract
async function vote() {
  const sessionId = parseInt(document.getElementById("sessionId").value);
  const option = document.getElementById("option").value;
  const tx = await contract.vote(sessionId, option);
  await tx.wait();
}

// Call getSessionResults() in the smart contract and display the results
async function getSessionResults() {
  const sessionId = parseInt(document.getElementById("resultsSessionId").value);
  const [optionNames, counts] = await contract.getSessionResults(sessionId);
  const results = document.getElementById("results");
  results.innerHTML = "";

  for (let i = 0; i < optionNames.length; i++) {
    const option = document.createElement("div");
    option.innerText = `${optionNames[i]}: ${counts[i]} votes`;
    results.appendChild(option);
  }
}

//Call getVoteCount() in the smart contract and display the results
async function getVoteCount() {
  const sessionId = parseInt(document.getElementById("countSessionId").value);
  const option = document.getElementById("countOption").value;
  const count = await contract.getVoteCount(sessionId, option);
  document.getElementById("voteCountResult").innerText = `Vote count for "${option}": ${count}`;
}


// Call getAllSessions() in the smart contract and display results of sessions
async function getAllSessions() {
    const sessions = await contract.getAllSessions();
    const allSessions = document.getElementById("allSessions");
    allSessions.innerHTML = "";
  
    for (let i = 0; i < sessions.length; i++) {
      const sessionContainer = document.createElement("div");
      sessionContainer.innerHTML = `
        <strong>Session ID: ${i}</strong><br />
        Question: ${sessions[i].question}<br />
        Options: ${sessions[i].options.join(", ")}<br />
      `;
      allSessions.appendChild(sessionContainer);
    }
  }
  

